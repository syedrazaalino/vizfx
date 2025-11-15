/**
 * Wave/Ripple Effect
 */

import { Effect } from '../core/Effect';
import { createProgram, createQuad } from '../utils/shaders';

export interface WaveEffectOptions {
  amplitude?: number;
  frequency?: number;
  speed?: number;
  color1?: string;
  color2?: string;
}

export class WaveEffect implements Effect {
  private options: Required<WaveEffectOptions>;
  private program: WebGLProgram | null = null;
  private quadBuffer: WebGLBuffer | null = null;
  private width: number = 0;
  private height: number = 0;

  constructor(options: WaveEffectOptions = {}) {
    this.options = {
      amplitude: options.amplitude ?? 0.1,
      frequency: options.frequency ?? 3.0,
      speed: options.speed ?? 1.0,
      color1: options.color1 ?? '#6366f1',
      color2: options.color2 ?? '#8b5cf6',
    };
  }

  init(gl: WebGLRenderingContext): void {
    const vertexShader = `
      attribute vec2 a_position;
      attribute vec2 a_texCoord;
      
      varying vec2 v_texCoord;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_texCoord;
      }
    `;

    const fragmentShader = `
      precision mediump float;
      
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_amplitude;
      uniform float u_frequency;
      uniform float u_speed;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      
      varying vec2 v_texCoord;
      
      void main() {
        vec2 uv = v_texCoord;
        
        // Create wave distortion
        float wave1 = sin(uv.x * u_frequency + u_time * u_speed) * u_amplitude;
        float wave2 = cos(uv.y * u_frequency + u_time * u_speed * 0.8) * u_amplitude;
        
        uv.y += wave1;
        uv.x += wave2;
        
        // Create gradient based on distorted coordinates
        float gradient = (uv.x + uv.y) * 0.5;
        gradient += sin(u_time * 0.5) * 0.2;
        
        vec3 color = mix(u_color1, u_color2, gradient);
        
        // Add some glow
        float glow = abs(sin(uv.y * 10.0 + u_time * 2.0)) * 0.3;
        color += vec3(glow);
        
        gl_FragColor = vec4(color, 0.8);
      }
    `;

    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.quadBuffer = createQuad(gl);
  }

  update(time: number, deltaTime: number): void {
    // Animation is handled in the shader
  }

  render(gl: WebGLRenderingContext): void {
    if (!this.program || !this.quadBuffer) return;

    gl.useProgram(this.program);

    // Bind quad buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer);

    // Set attributes
    const positionLoc = gl.getAttribLocation(this.program, 'a_position');
    const texCoordLoc = gl.getAttribLocation(this.program, 'a_texCoord');

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(texCoordLoc);
    gl.vertexAttribPointer(texCoordLoc, 2, gl.FLOAT, false, 16, 8);

    // Set uniforms
    const timeLoc = gl.getUniformLocation(this.program, 'u_time');
    const resolutionLoc = gl.getUniformLocation(this.program, 'u_resolution');
    const amplitudeLoc = gl.getUniformLocation(this.program, 'u_amplitude');
    const frequencyLoc = gl.getUniformLocation(this.program, 'u_frequency');
    const speedLoc = gl.getUniformLocation(this.program, 'u_speed');
    const color1Loc = gl.getUniformLocation(this.program, 'u_color1');
    const color2Loc = gl.getUniformLocation(this.program, 'u_color2');

    gl.uniform1f(timeLoc, performance.now() / 1000);
    gl.uniform2f(resolutionLoc, this.width, this.height);
    gl.uniform1f(amplitudeLoc, this.options.amplitude);
    gl.uniform1f(frequencyLoc, this.options.frequency);
    gl.uniform1f(speedLoc, this.options.speed);

    // Convert hex colors to RGB
    const rgb1 = this.hexToRgb(this.options.color1);
    const rgb2 = this.hexToRgb(this.options.color2);
    gl.uniform3f(color1Loc, rgb1.r, rgb1.g, rgb1.b);
    gl.uniform3f(color2Loc, rgb2.r, rgb2.g, rgb2.b);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  destroy(gl: WebGLRenderingContext): void {
    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }
    if (this.quadBuffer) {
      gl.deleteBuffer(this.quadBuffer);
      this.quadBuffer = null;
    }
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 1, g: 1, b: 1 };
  }
}

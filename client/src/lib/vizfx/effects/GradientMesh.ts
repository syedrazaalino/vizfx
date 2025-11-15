/**
 * Gradient Mesh Effect - Animated gradient background
 */

import { Effect } from '../core/Effect';
import { createProgram, createQuad } from '../utils/shaders';

export interface GradientMeshOptions {
  colors?: string[];
  speed?: number;
  complexity?: number;
}

export class GradientMesh implements Effect {
  private options: Required<GradientMeshOptions>;
  private program: WebGLProgram | null = null;
  private quadBuffer: WebGLBuffer | null = null;
  private width: number = 0;
  private height: number = 0;

  constructor(options: GradientMeshOptions = {}) {
    this.options = {
      colors: options.colors ?? ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      speed: options.speed ?? 0.5,
      complexity: options.complexity ?? 3.0,
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
      uniform float u_speed;
      uniform float u_complexity;
      uniform vec3 u_color1;
      uniform vec3 u_color2;
      uniform vec3 u_color3;
      uniform vec3 u_color4;
      
      varying vec2 v_texCoord;
      
      // Smooth noise function
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      float smoothNoise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        
        float a = noise(i);
        float b = noise(i + vec2(1.0, 0.0));
        float c = noise(i + vec2(0.0, 1.0));
        float d = noise(i + vec2(1.0, 1.0));
        
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }
      
      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        
        for (int i = 0; i < 4; i++) {
          value += amplitude * smoothNoise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        
        return value;
      }
      
      void main() {
        vec2 uv = v_texCoord;
        vec2 p = uv * u_complexity;
        
        // Animate the noise
        float t = u_time * u_speed;
        p += vec2(cos(t * 0.3), sin(t * 0.2));
        
        // Generate noise values
        float n1 = fbm(p + t * 0.1);
        float n2 = fbm(p + vec2(5.2, 1.3) + t * 0.15);
        float n3 = fbm(p + vec2(2.8, 9.1) - t * 0.12);
        float n4 = fbm(p + vec2(7.5, 4.6) + t * 0.08);
        
        // Mix colors based on noise
        vec3 color = u_color1 * n1;
        color += u_color2 * n2;
        color += u_color3 * n3;
        color += u_color4 * n4;
        
        // Normalize
        color /= (n1 + n2 + n3 + n4);
        
        // Add some variation
        color += vec3(0.1) * sin(uv.x * 10.0 + t) * cos(uv.y * 10.0 + t);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `;

    this.program = createProgram(gl, vertexShader, fragmentShader);
    this.quadBuffer = createQuad(gl);
  }

  update(time: number, deltaTime: number): void {
    // Animation handled in shader
  }

  render(gl: WebGLRenderingContext): void {
    if (!this.program || !this.quadBuffer) return;

    gl.useProgram(this.program);

    // Bind quad
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
    const speedLoc = gl.getUniformLocation(this.program, 'u_speed');
    const complexityLoc = gl.getUniformLocation(this.program, 'u_complexity');

    gl.uniform1f(timeLoc, performance.now() / 1000);
    gl.uniform2f(resolutionLoc, this.width, this.height);
    gl.uniform1f(speedLoc, this.options.speed);
    gl.uniform1f(complexityLoc, this.options.complexity);

    // Set color uniforms
    const colors = this.options.colors.slice(0, 4);
    while (colors.length < 4) {
      colors.push(colors[colors.length - 1]);
    }

    for (let i = 0; i < 4; i++) {
      const colorLoc = gl.getUniformLocation(this.program, `u_color${i + 1}`);
      const rgb = this.hexToRgb(colors[i]);
      gl.uniform3f(colorLoc, rgb.r, rgb.g, rgb.b);
    }

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

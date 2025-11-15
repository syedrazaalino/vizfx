/**
 * Floating Particles Effect - Ambient background particles with connections
 */

import { Effect } from '../core/Effect';
import { Vec2, random } from '../utils/math';
import { createProgram } from '../utils/shaders';

export interface FloatingParticlesOptions {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  connectionDistance?: number;
  showConnections?: boolean;
}

interface FloatingParticle {
  position: Vec2;
  velocity: Vec2;
  size: number;
}

export class FloatingParticles implements Effect {
  private options: Required<FloatingParticlesOptions>;
  private particles: FloatingParticle[] = [];
  private particleProgram: WebGLProgram | null = null;
  private lineProgram: WebGLProgram | null = null;
  private particleBuffer: WebGLBuffer | null = null;
  private lineBuffer: WebGLBuffer | null = null;
  private width: number = 0;
  private height: number = 0;

  constructor(options: FloatingParticlesOptions = {}) {
    this.options = {
      count: options.count ?? 100,
      color: options.color ?? '#ffffff',
      size: options.size ?? 2,
      speed: options.speed ?? 20,
      connectionDistance: options.connectionDistance ?? 150,
      showConnections: options.showConnections ?? true,
    };
  }

  init(gl: WebGLRenderingContext): void {
    // Particle shader
    const particleVertexShader = `
      attribute vec2 a_position;
      attribute float a_size;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = a_size;
      }
    `;

    const particleFragmentShader = `
      precision mediump float;
      uniform vec3 u_color;
      
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        
        float alpha = 1.0 - dist * 2.0;
        gl_FragColor = vec4(u_color, alpha * 0.6);
      }
    `;

    this.particleProgram = createProgram(
      gl,
      particleVertexShader,
      particleFragmentShader
    );

    // Line shader
    const lineVertexShader = `
      attribute vec2 a_position;
      attribute float a_alpha;
      
      varying float v_alpha;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_alpha = a_alpha;
      }
    `;

    const lineFragmentShader = `
      precision mediump float;
      uniform vec3 u_color;
      varying float v_alpha;
      
      void main() {
        gl_FragColor = vec4(u_color, v_alpha * 0.2);
      }
    `;

    this.lineProgram = createProgram(gl, lineVertexShader, lineFragmentShader);

    // Create buffers
    this.particleBuffer = gl.createBuffer();
    this.lineBuffer = gl.createBuffer();

    // Initialize particles
    this.initParticles();
  }

  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.options.count; i++) {
      this.particles.push({
        position: new Vec2(random(0, this.width), random(0, this.height)),
        velocity: new Vec2(
          random(-this.options.speed, this.options.speed),
          random(-this.options.speed, this.options.speed)
        ),
        size: random(this.options.size * 0.5, this.options.size * 1.5),
      });
    }
  }

  update(time: number, deltaTime: number): void {
    for (const p of this.particles) {
      // Update position
      p.position.x += p.velocity.x * deltaTime;
      p.position.y += p.velocity.y * deltaTime;

      // Wrap around screen edges
      if (p.position.x < 0) p.position.x = this.width;
      if (p.position.x > this.width) p.position.x = 0;
      if (p.position.y < 0) p.position.y = this.height;
      if (p.position.y > this.height) p.position.y = 0;
    }
  }

  render(gl: WebGLRenderingContext): void {
    if (!this.particleProgram || !this.particleBuffer) return;

    const rgb = this.hexToRgb(this.options.color);

    // Draw connections first (behind particles)
    if (this.options.showConnections && this.lineProgram && this.lineBuffer) {
      this.renderConnections(gl, rgb);
    }

    // Draw particles
    this.renderParticles(gl, rgb);
  }

  private renderParticles(
    gl: WebGLRenderingContext,
    rgb: { r: number; g: number; b: number }
  ): void {
    if (!this.particleProgram || !this.particleBuffer) return;

    gl.useProgram(this.particleProgram);

    // Prepare particle data
    const data: number[] = [];
    for (const p of this.particles) {
      const x = (p.position.x / this.width) * 2 - 1;
      const y = (p.position.y / this.height) * 2 - 1;
      data.push(x, y, p.size);
    }

    // Upload data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);

    // Set attributes
    const positionLoc = gl.getAttribLocation(this.particleProgram, 'a_position');
    const sizeLoc = gl.getAttribLocation(this.particleProgram, 'a_size');

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 12, 0);

    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 12, 8);

    // Set color
    const colorLoc = gl.getUniformLocation(this.particleProgram, 'u_color');
    gl.uniform3f(colorLoc, rgb.r, rgb.g, rgb.b);

    // Draw
    gl.drawArrays(gl.POINTS, 0, this.particles.length);
  }

  private renderConnections(
    gl: WebGLRenderingContext,
    rgb: { r: number; g: number; b: number }
  ): void {
    if (!this.lineProgram || !this.lineBuffer) return;

    gl.useProgram(this.lineProgram);

    // Find connections
    const lineData: number[] = [];
    const maxDist = this.options.connectionDistance;

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const dist = p1.position.distance(p2.position);

        if (dist < maxDist) {
          const alpha = 1 - dist / maxDist;

          const x1 = (p1.position.x / this.width) * 2 - 1;
          const y1 = (p1.position.y / this.height) * 2 - 1;
          const x2 = (p2.position.x / this.width) * 2 - 1;
          const y2 = (p2.position.y / this.height) * 2 - 1;

          lineData.push(x1, y1, alpha, x2, y2, alpha);
        }
      }
    }

    if (lineData.length === 0) return;

    // Upload data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineData), gl.DYNAMIC_DRAW);

    // Set attributes
    const positionLoc = gl.getAttribLocation(this.lineProgram, 'a_position');
    const alphaLoc = gl.getAttribLocation(this.lineProgram, 'a_alpha');

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 12, 0);

    gl.enableVertexAttribArray(alphaLoc);
    gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 12, 8);

    // Set color
    const colorLoc = gl.getUniformLocation(this.lineProgram, 'u_color');
    gl.uniform3f(colorLoc, rgb.r, rgb.g, rgb.b);

    // Draw
    gl.drawArrays(gl.LINES, 0, lineData.length / 3);
  }

  resize(width: number, height: number): void {
    const oldWidth = this.width;
    const oldHeight = this.height;

    this.width = width;
    this.height = height;

    // Scale particle positions
    if (oldWidth > 0 && oldHeight > 0) {
      for (const p of this.particles) {
        p.position.x = (p.position.x / oldWidth) * width;
        p.position.y = (p.position.y / oldHeight) * height;
      }
    } else {
      this.initParticles();
    }
  }

  destroy(gl: WebGLRenderingContext): void {
    if (this.particleProgram) {
      gl.deleteProgram(this.particleProgram);
      this.particleProgram = null;
    }
    if (this.lineProgram) {
      gl.deleteProgram(this.lineProgram);
      this.lineProgram = null;
    }
    if (this.particleBuffer) {
      gl.deleteBuffer(this.particleBuffer);
      this.particleBuffer = null;
    }
    if (this.lineBuffer) {
      gl.deleteBuffer(this.lineBuffer);
      this.lineBuffer = null;
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

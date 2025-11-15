/**
 * Particle System Effect
 */

import { Effect } from '../core/Effect';
import { Vec2, random, hexToRgb } from '../utils/math';
import { createProgram } from '../utils/shaders';

export interface ParticleSystemOptions {
  count?: number;
  color?: string;
  size?: number;
  speed?: number;
  lifetime?: number;
  gravity?: Vec2;
  emitterPosition?: Vec2;
  emitterRadius?: number;
  fadeOut?: boolean;
}

interface Particle {
  position: Vec2;
  velocity: Vec2;
  life: number;
  maxLife: number;
  size: number;
}

export class ParticleSystem implements Effect {
  private options: Required<ParticleSystemOptions>;
  private particles: Particle[] = [];
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private width: number = 0;
  private height: number = 0;

  constructor(options: ParticleSystemOptions = {}) {
    this.options = {
      count: options.count ?? 1000,
      color: options.color ?? '#ffffff',
      size: options.size ?? 3,
      speed: options.speed ?? 100,
      lifetime: options.lifetime ?? 3,
      gravity: options.gravity ?? new Vec2(0, -50),
      emitterPosition: options.emitterPosition ?? new Vec2(0, 0),
      emitterRadius: options.emitterRadius ?? 50,
      fadeOut: options.fadeOut ?? true,
    };
  }

  init(gl: WebGLRenderingContext): void {
    // Create shader program
    const vertexShader = `
      attribute vec2 a_position;
      attribute float a_size;
      attribute float a_alpha;
      
      varying float v_alpha;
      
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        gl_PointSize = a_size;
        v_alpha = a_alpha;
      }
    `;

    const fragmentShader = `
      precision mediump float;
      
      uniform vec3 u_color;
      varying float v_alpha;
      
      void main() {
        // Create circular particles
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        if (dist > 0.5) discard;
        
        float alpha = (1.0 - dist * 2.0) * v_alpha;
        gl_FragColor = vec4(u_color, alpha);
      }
    `;

    this.program = createProgram(gl, vertexShader, fragmentShader);

    // Create buffer
    this.positionBuffer = gl.createBuffer();

    // Initialize particles
    this.initParticles();
  }

  private initParticles(): void {
    this.particles = [];
    for (let i = 0; i < this.options.count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  private createParticle(): Particle {
    const angle = random(0, Math.PI * 2);
    const radius = random(0, this.options.emitterRadius);
    const speed = random(this.options.speed * 0.5, this.options.speed * 1.5);

    return {
      position: new Vec2(
        this.options.emitterPosition.x + Math.cos(angle) * radius,
        this.options.emitterPosition.y + Math.sin(angle) * radius
      ),
      velocity: new Vec2(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      ),
      life: this.options.lifetime,
      maxLife: this.options.lifetime,
      size: random(this.options.size * 0.5, this.options.size * 1.5),
    };
  }

  update(time: number, deltaTime: number): void {
    // Update particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update life
      p.life -= deltaTime;

      // Reset particle if dead
      if (p.life <= 0) {
        this.particles[i] = this.createParticle();
        continue;
      }

      // Apply gravity
      p.velocity.add(
        new Vec2(
          this.options.gravity.x * deltaTime,
          this.options.gravity.y * deltaTime
        )
      );

      // Update position
      p.position.add(
        new Vec2(p.velocity.x * deltaTime, p.velocity.y * deltaTime)
      );
    }
  }

  render(gl: WebGLRenderingContext): void {
    if (!this.program || !this.positionBuffer) return;

    gl.useProgram(this.program);

    // Prepare particle data
    const data: number[] = [];
    for (const p of this.particles) {
      // Convert to clip space (-1 to 1)
      const x = (p.position.x / this.width) * 2 - 1;
      const y = (p.position.y / this.height) * 2 - 1;
      const alpha = this.options.fadeOut ? p.life / p.maxLife : 1.0;

      data.push(x, y, p.size, alpha);
    }

    // Upload data
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);

    // Set attributes
    const stride = 4 * 4; // 4 floats per particle
    const positionLoc = gl.getAttribLocation(this.program, 'a_position');
    const sizeLoc = gl.getAttribLocation(this.program, 'a_size');
    const alphaLoc = gl.getAttribLocation(this.program, 'a_alpha');

    gl.enableVertexAttribArray(positionLoc);
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, stride, 0);

    gl.enableVertexAttribArray(sizeLoc);
    gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, stride, 8);

    gl.enableVertexAttribArray(alphaLoc);
    gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, stride, 12);

    // Set color uniform
    const colorLoc = gl.getUniformLocation(this.program, 'u_color');
    const rgb = hexToRgb(this.options.color);
    gl.uniform3f(colorLoc, rgb.r, rgb.g, rgb.b);

    // Draw particles
    gl.drawArrays(gl.POINTS, 0, this.particles.length);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;

    // Update emitter position to center if not set
    if (
      this.options.emitterPosition.x === 0 &&
      this.options.emitterPosition.y === 0
    ) {
      this.options.emitterPosition.set(width / 2, height / 2);
    }
  }

  destroy(gl: WebGLRenderingContext): void {
    if (this.program) {
      gl.deleteProgram(this.program);
      this.program = null;
    }
    if (this.positionBuffer) {
      gl.deleteBuffer(this.positionBuffer);
      this.positionBuffer = null;
    }
  }

  // Public API for dynamic control
  setEmitterPosition(x: number, y: number): void {
    this.options.emitterPosition.set(x, y);
  }

  setColor(color: string): void {
    this.options.color = color;
  }

  setCount(count: number): void {
    this.options.count = count;
    // Adjust particles array if needed
    while (this.particles.length < count) {
      this.particles.push(this.createParticle());
    }
    if (this.particles.length > count) {
      this.particles.length = count;
    }
  }
}

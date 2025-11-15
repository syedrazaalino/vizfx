/**
 * Main VizFX class - Entry point for the library
 */

import { Effect } from './Effect';
import { InteractionManager } from '../utils/interaction';

export interface VizFXOptions {
  canvas?: HTMLCanvasElement | string;
  width?: number;
  height?: number;
  dpr?: number;
  alpha?: boolean;
  antialias?: boolean;
}

export class VizFX {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private effects: Effect[] = [];
  private animationId: number | null = null;
  private startTime: number = 0;
  private lastTime: number = 0;
  private isRunning: boolean = false;
  private interactionManager: InteractionManager | null = null;
  private dpr: number;

  constructor(options: VizFXOptions = {}) {
    // Get or create canvas
    if (typeof options.canvas === 'string') {
      const element = document.querySelector(options.canvas);
      if (!(element instanceof HTMLCanvasElement)) {
        throw new Error(`Canvas element not found: ${options.canvas}`);
      }
      this.canvas = element;
    } else if (options.canvas instanceof HTMLCanvasElement) {
      this.canvas = options.canvas;
    } else {
      this.canvas = document.createElement('canvas');
      document.body.appendChild(this.canvas);
    }

    // Set device pixel ratio
    this.dpr = options.dpr ?? window.devicePixelRatio ?? 1;

    // Initialize WebGL
    this.initWebGL(options);

    // Setup interaction
    this.interactionManager = new InteractionManager(this.canvas);

    // Handle resize
    this.resize(options.width, options.height);
    window.addEventListener('resize', () => this.resize());
  }

  private initWebGL(options: VizFXOptions): void {
    const contextOptions = {
      alpha: options.alpha ?? true,
      antialias: options.antialias ?? true,
      premultipliedAlpha: false,
    };

    this.gl =
      (this.canvas.getContext('webgl', contextOptions) as WebGLRenderingContext) ||
      (this.canvas.getContext('experimental-webgl', contextOptions) as WebGLRenderingContext);

    if (!this.gl) {
      throw new Error('WebGL not supported');
    }

    // Set clear color
    this.gl.clearColor(0, 0, 0, 0);

    // Enable blending for transparency
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
  }

  /**
   * Add an effect to the scene
   */
  addEffect(effect: Effect): VizFX {
    if (!this.gl) return this;

    effect.init(this.gl);
    this.effects.push(effect);

    // Resize effect to current canvas size
    effect.resize(this.canvas.width / this.dpr, this.canvas.height / this.dpr);

    return this;
  }

  /**
   * Remove an effect from the scene
   */
  removeEffect(effect: Effect): VizFX {
    if (!this.gl) return this;

    const index = this.effects.indexOf(effect);
    if (index !== -1) {
      effect.destroy(this.gl);
      this.effects.splice(index, 1);
    }

    return this;
  }

  /**
   * Start the animation loop
   */
  start(): VizFX {
    if (this.isRunning) return this;

    this.isRunning = true;
    this.startTime = performance.now();
    this.lastTime = this.startTime;
    this.animate();

    return this;
  }

  /**
   * Stop the animation loop
   */
  stop(): VizFX {
    if (!this.isRunning) return this;

    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    return this;
  }

  /**
   * Animation loop
   */
  private animate = (): void => {
    if (!this.isRunning || !this.gl) return;

    this.animationId = requestAnimationFrame(this.animate);

    const now = performance.now();
    const time = (now - this.startTime) / 1000;
    const deltaTime = (now - this.lastTime) / 1000;
    this.lastTime = now;

    // Clear canvas
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    // Update and render all effects
    for (const effect of this.effects) {
      effect.update(time, deltaTime);
      effect.render(this.gl);
    }
  };

  /**
   * Resize canvas
   */
  resize(width?: number, height?: number): VizFX {
    if (!this.gl) return this;

    // Use provided dimensions or container dimensions
    const w = width ?? this.canvas.clientWidth;
    const h = height ?? this.canvas.clientHeight;

    // Update canvas size with device pixel ratio
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;

    // Update canvas style size
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;

    // Update viewport
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    // Resize all effects
    for (const effect of this.effects) {
      effect.resize(w, h);
    }

    return this;
  }

  /**
   * Get the interaction manager
   */
  getInteraction(): InteractionManager | null {
    return this.interactionManager;
  }

  /**
   * Get the canvas element
   */
  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  /**
   * Get the WebGL context
   */
  getGL(): WebGLRenderingContext | null {
    return this.gl;
  }

  /**
   * Destroy and clean up
   */
  destroy(): void {
    this.stop();

    if (this.gl) {
      for (const effect of this.effects) {
        effect.destroy(this.gl);
      }
    }

    this.effects = [];

    if (this.interactionManager) {
      this.interactionManager.destroy();
      this.interactionManager = null;
    }

    window.removeEventListener('resize', () => this.resize());
  }
}

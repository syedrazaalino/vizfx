/**
 * Base interface for all VizFX effects
 */
export interface Effect {
  /**
   * Initialize the effect (create buffers, shaders, etc.)
   */
  init(gl: WebGLRenderingContext): void;

  /**
   * Update effect state
   * @param time - Total elapsed time in seconds
   * @param deltaTime - Time since last frame in seconds
   */
  update(time: number, deltaTime: number): void;

  /**
   * Render the effect
   */
  render(gl: WebGLRenderingContext): void;

  /**
   * Handle canvas resize
   */
  resize(width: number, height: number): void;

  /**
   * Clean up resources
   */
  destroy(gl: WebGLRenderingContext): void;
}

/**
 * Base effect options
 */
export interface EffectOptions {
  enabled?: boolean;
}

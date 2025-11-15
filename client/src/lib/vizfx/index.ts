/**
 * VizFX - Visual Effects Library
 * A lightweight WebGL-based effects library for stunning web visuals
 */

// Core
export { VizFX } from './core/VizFX';
export type { VizFXOptions } from './core/VizFX';
export type { Effect, EffectOptions } from './core/Effect';

// Effects
export { ParticleSystem } from './effects/ParticleSystem';
export type { ParticleSystemOptions } from './effects/ParticleSystem';

export { WaveEffect } from './effects/WaveEffect';
export type { WaveEffectOptions } from './effects/WaveEffect';

export { FloatingParticles } from './effects/FloatingParticles';
export type { FloatingParticlesOptions } from './effects/FloatingParticles';

export { GradientMesh } from './effects/GradientMesh';
export type { GradientMeshOptions } from './effects/GradientMesh';

// Utils
export { Vec2, lerp, clamp, map, smoothstep, random, randomInt, hexToRgb } from './utils/math';
export { InteractionManager } from './utils/interaction';
export type { PointerState } from './utils/interaction';

# VizFX Library Architecture

## Overview

VizFX is an independent, lightweight WebGL-based visual effects library designed to bring stunning visual effects to websites with minimal setup. The library provides a simple API similar to Three.js but focused specifically on common web effects rather than full 3D rendering.

## Design Philosophy

**Simplicity First**: The library should be easy to use with minimal boilerplate. Users should be able to create effects with just a few lines of code.

**Performance**: All effects are GPU-accelerated using WebGL for smooth 60fps animations even on lower-end devices.

**Modularity**: Each effect is independent and can be used standalone or combined with others.

**Zero Dependencies**: The library has no external dependencies, making it lightweight and easy to integrate.

## Core Architecture

### 1. VizFX Core (`VizFX` class)
The main entry point that manages the WebGL context and canvas setup.

**Responsibilities:**
- Initialize WebGL context
- Handle canvas resizing
- Manage animation loop
- Coordinate multiple effects

### 2. Effect System
Each effect is a self-contained module that implements a common interface:

**Base Effect Interface:**
- `init()` - Initialize effect resources (shaders, buffers)
- `update(time, deltaTime)` - Update effect state
- `render()` - Draw effect to canvas
- `resize(width, height)` - Handle canvas resize
- `destroy()` - Clean up resources

### 3. Effects Library

**Particle System** - Customizable particle effects with physics simulation
- Support for various particle shapes (circles, squares, custom)
- Physics properties (velocity, acceleration, friction)
- Emitter patterns (point, line, circle, area)

**Wave Effect** - Animated wave/ripple distortions
- Vertex displacement for wave motion
- Mouse interaction for ripple creation
- Configurable amplitude, frequency, speed

**Gradient Mesh** - Animated gradient backgrounds
- Smooth color transitions
- Mesh deformation
- Mouse-reactive gradients

**Floating Particles** - Ambient particle background
- Depth parallax effect
- Connection lines between nearby particles
- Mouse attraction/repulsion

### 4. Utilities

**Math Helpers:**
- Easing functions (easeInOut, easeElastic, etc.)
- Interpolation (lerp, smoothstep)
- Vector operations
- Random number generation

**Shader Library:**
- Reusable shader components
- Common vertex/fragment shaders
- Shader composition utilities

### 5. Interaction System

**Mouse/Touch Tracking:**
- Normalized coordinates
- Velocity calculation
- Event delegation

## File Structure

```
client/public/
  vizfx/
    vizfx.js           - Main library (UMD build)
    vizfx.min.js       - Minified production build
    vizfx.d.ts         - TypeScript definitions

client/src/lib/vizfx/
  core/
    VizFX.ts           - Main class
    Effect.ts          - Base effect interface
    Renderer.ts        - WebGL renderer wrapper
  effects/
    ParticleSystem.ts  - Particle effect
    WaveEffect.ts      - Wave/ripple effect
    GradientMesh.ts    - Gradient mesh effect
    FloatingParticles.ts - Floating particles
  utils/
    math.ts            - Math utilities
    shaders.ts         - Shader library
    interaction.ts     - Mouse/touch handling
  index.ts             - Main export
```

## Usage Example

```javascript
// Simple usage
const viz = new VizFX('#canvas');
const particles = viz.addEffect('particles', {
  count: 1000,
  color: '#00ff88',
  speed: 2
});

// Advanced usage with multiple effects
const viz = new VizFX('#canvas');
viz.addEffect('gradientMesh', { colors: ['#ff0080', '#0080ff'] });
viz.addEffect('floatingParticles', { count: 100 });
viz.start();
```

## Performance Considerations

- Use instanced rendering for particles
- Implement object pooling for particle systems
- Optimize shader complexity
- Provide quality settings (low/medium/high)
- Automatic performance scaling based on FPS
- Fallback to canvas 2D for unsupported devices

## Browser Support

- Modern browsers with WebGL support
- Graceful degradation for older browsers
- Mobile optimization with reduced particle counts

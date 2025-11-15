# VizFX

[![npm version](https://img.shields.io/npm/v/vizfx.svg)](https://www.npmjs.com/package/vizfx)
[![GitHub](https://img.shields.io/badge/GitHub-syedrazaalino%2Fvizfx-blue)](https://github.com/syedrazaalino/vizfx)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight, independent WebGL-based visual effects library for creating stunning effects on websites. Inspired by Three.js but focused specifically on common web effects rather than full 3D rendering.

**🔗 [View on GitHub](https://github.com/syedrazaalino/vizfx)** | **📦 [View on npm](https://www.npmjs.com/package/vizfx)**

## Features

- **Zero Dependencies** - Pure WebGL implementation with no external libraries
- **GPU Accelerated** - All effects run on the GPU for smooth 60fps performance
- **Simple API** - Easy-to-use interface inspired by Three.js
- **TypeScript Support** - Full TypeScript definitions included
- **Multiple Effects** - Particle systems, wave effects, gradient meshes, and more
- **Interactive** - Built-in mouse/touch interaction support
- **Lightweight** - Small bundle size, perfect for production

## Installation

### Using npm (when published)

```bash
npm install vizfx
```

### Direct Import

```typescript
import { VizFX, ParticleSystem, Vec2 } from './lib/vizfx';
```

## Quick Start

```typescript
import { VizFX, ParticleSystem, Vec2 } from 'vizfx';

// Create VizFX instance
const viz = new VizFX({ canvas: '#myCanvas' });

// Add a particle system
const particles = new ParticleSystem({
  count: 1000,
  color: '#00ff88',
  size: 3,
  speed: 100,
  gravity: new Vec2(0, -50),
});

viz.addEffect(particles);
viz.start();
```

## Available Effects

### Particle System

Create dynamic particle effects with physics simulation.

```typescript
import { VizFX, ParticleSystem, Vec2 } from 'vizfx';

const viz = new VizFX({ canvas: '#canvas' });

const particles = new ParticleSystem({
  count: 500,              // Number of particles
  color: '#667eea',        // Particle color (hex)
  size: 4,                 // Particle size in pixels
  speed: 150,              // Emission speed
  lifetime: 2,             // Particle lifetime in seconds
  gravity: new Vec2(0, -80), // Gravity force
  emitterRadius: 20,       // Emission radius
  fadeOut: true,           // Fade out particles over lifetime
});

viz.addEffect(particles);
viz.start();

// Dynamic control
particles.setEmitterPosition(x, y);
particles.setColor('#ff0000');
```

### Wave Effect

Animated wave distortions with gradient colors.

```typescript
import { VizFX, WaveEffect } from 'vizfx';

const viz = new VizFX({ canvas: '#canvas' });

const waves = new WaveEffect({
  amplitude: 0.08,         // Wave height
  frequency: 4.0,          // Wave frequency
  speed: 1.2,              // Animation speed
  color1: '#6366f1',       // First gradient color
  color2: '#8b5cf6',       // Second gradient color
});

viz.addEffect(waves);
viz.start();
```

### Floating Particles

Ambient background particles with connection lines.

```typescript
import { VizFX, FloatingParticles } from 'vizfx';

const viz = new VizFX({ canvas: '#canvas' });

const floating = new FloatingParticles({
  count: 80,               // Number of particles
  color: '#4facfe',        // Particle color
  size: 3,                 // Particle size
  speed: 25,               // Movement speed
  connectionDistance: 150, // Max distance for connections
  showConnections: true,   // Show connection lines
});

viz.addEffect(floating);
viz.start();
```

### Gradient Mesh

Smooth animated gradients with organic motion.

```typescript
import { VizFX, GradientMesh } from 'vizfx';

const viz = new VizFX({ canvas: '#canvas' });

const gradient = new GradientMesh({
  colors: [                // Array of gradient colors
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#4facfe'
  ],
  speed: 0.6,              // Animation speed
  complexity: 3.5,         // Noise complexity
});

viz.addEffect(gradient);
viz.start();
```

## API Reference

### VizFX

Main class for managing the WebGL context and effects.

#### Constructor Options

```typescript
interface VizFXOptions {
  canvas?: HTMLCanvasElement | string;  // Canvas element or selector
  width?: number;                       // Canvas width (default: container width)
  height?: number;                      // Canvas height (default: container height)
  dpr?: number;                         // Device pixel ratio (default: window.devicePixelRatio)
  alpha?: boolean;                      // Enable transparency (default: true)
  antialias?: boolean;                  // Enable antialiasing (default: true)
}
```

#### Methods

- `addEffect(effect: Effect): VizFX` - Add an effect to the scene
- `removeEffect(effect: Effect): VizFX` - Remove an effect from the scene
- `start(): VizFX` - Start the animation loop
- `stop(): VizFX` - Stop the animation loop
- `resize(width?: number, height?: number): VizFX` - Resize the canvas
- `getInteraction(): InteractionManager | null` - Get the interaction manager
- `getCanvas(): HTMLCanvasElement` - Get the canvas element
- `getGL(): WebGLRenderingContext | null` - Get the WebGL context
- `destroy(): void` - Clean up and destroy the instance

### Effect Interface

All effects implement this interface:

```typescript
interface Effect {
  init(gl: WebGLRenderingContext): void;
  update(time: number, deltaTime: number): void;
  render(gl: WebGLRenderingContext): void;
  resize(width: number, height: number): void;
  destroy(gl: WebGLRenderingContext): void;
}
```

### Utilities

#### Vec2

2D vector class for position and velocity.

```typescript
const vec = new Vec2(x, y);
vec.set(x, y);
vec.add(otherVec);
vec.sub(otherVec);
vec.multiply(scalar);
vec.normalize();
const length = vec.length();
const distance = vec.distance(otherVec);
const clone = vec.clone();
```

#### Math Functions

- `lerp(start, end, t)` - Linear interpolation
- `clamp(value, min, max)` - Clamp value between min and max
- `map(value, inMin, inMax, outMin, outMax)` - Map value from one range to another
- `smoothstep(edge0, edge1, x)` - Smooth interpolation
- `random(min, max)` - Random number between min and max
- `randomInt(min, max)` - Random integer between min and max
- `hexToRgb(hex)` - Convert hex color to RGB object

## Examples

### Multiple Effects

Combine multiple effects for complex visuals:

```typescript
const viz = new VizFX({ canvas: '#canvas' });

// Background gradient
viz.addEffect(new GradientMesh({
  colors: ['#667eea', '#764ba2'],
  speed: 0.3,
}));

// Floating particles on top
viz.addEffect(new FloatingParticles({
  count: 50,
  color: '#ffffff',
  showConnections: true,
}));

viz.start();
```

### Mouse Interaction

Use the interaction manager for mouse-reactive effects:

```typescript
const viz = new VizFX({ canvas: '#canvas' });
const particles = new ParticleSystem({ count: 1000 });

viz.addEffect(particles);
viz.start();

const interaction = viz.getInteraction();
const canvas = viz.getCanvas();

canvas.addEventListener('mousemove', (e) => {
  const pointer = interaction?.getPointer();
  if (pointer) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.height - (e.clientY - rect.top);
    particles.setEmitterPosition(x, y);
  }
});
```

### Responsive Canvas

Automatically resize canvas on window resize:

```typescript
const viz = new VizFX({ canvas: '#canvas' });

// Effects are automatically resized
viz.addEffect(new WaveEffect());
viz.start();

// Resize is handled automatically by VizFX
// Manual resize if needed:
window.addEventListener('resize', () => {
  viz.resize();
});
```

## Browser Support

VizFX requires WebGL support. It works in all modern browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers with WebGL support

## Performance Tips

1. **Particle Count** - Start with fewer particles and increase based on performance
2. **Effect Complexity** - Use simpler effects on mobile devices
3. **Canvas Size** - Smaller canvases render faster
4. **Device Pixel Ratio** - Set `dpr: 1` for better performance on high-DPI displays
5. **Multiple Effects** - Limit the number of simultaneous effects

## Architecture

VizFX is built with a modular architecture:

- **Core** - Main VizFX class and effect interface
- **Effects** - Individual effect implementations
- **Utils** - Math utilities, shader helpers, and interaction management

Each effect is self-contained and can be used independently. See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed information.

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Type check
pnpm type-check
```

## License

MIT License - feel free to use in personal and commercial projects.

## Credits

Created and maintained by **[DigitalCloud.no](https://digitalcloud.no)** - A Norwegian digital innovation company specializing in modern web technologies and creative solutions.

Built as an independent, lightweight alternative to Three.js for common web effects. Inspired by the WebGL community and modern web design trends.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Roadmap

- [ ] Additional effects (aurora, liquid, morphing shapes)
- [ ] Performance optimization for mobile
- [ ] Effect presets and templates
- [ ] Visual effect editor
- [ ] NPM package publication
- [ ] CDN distribution
- [ ] More examples and tutorials

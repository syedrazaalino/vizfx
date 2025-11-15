# VizFX Usage Guide

This guide provides practical examples and best practices for using VizFX in your projects.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Common Patterns](#common-patterns)
3. [Effect Combinations](#effect-combinations)
4. [Performance Optimization](#performance-optimization)
5. [Responsive Design](#responsive-design)
6. [Troubleshooting](#troubleshooting)

## Basic Setup

### HTML Setup

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VizFX Demo</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
    }
    #canvas {
      display: block;
      width: 100vw;
      height: 100vh;
    }
  </style>
</head>
<body>
  <canvas id="canvas"></canvas>
  <script type="module" src="main.js"></script>
</body>
</html>
```

### JavaScript Setup

```javascript
import { VizFX, ParticleSystem } from './lib/vizfx';

const viz = new VizFX({ canvas: '#canvas' });
const particles = new ParticleSystem({ count: 1000 });

viz.addEffect(particles);
viz.start();
```

## Common Patterns

### Full-Screen Background Effect

Create a full-screen background effect that doesn't interfere with page content:

```javascript
import { VizFX, GradientMesh, FloatingParticles } from './lib/vizfx';

// Create canvas
const canvas = document.createElement('canvas');
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100%';
canvas.style.height = '100%';
canvas.style.zIndex = '-1';
canvas.style.pointerEvents = 'none';
document.body.appendChild(canvas);

// Initialize VizFX
const viz = new VizFX({ canvas, alpha: true });

// Add effects
viz.addEffect(new GradientMesh({
  colors: ['#667eea', '#764ba2', '#f093fb'],
  speed: 0.4,
}));

viz.addEffect(new FloatingParticles({
  count: 30,
  color: '#ffffff',
  size: 2,
  speed: 10,
}));

viz.start();
```

### Section Background

Add effects to specific sections of your page:

```html
<section id="hero" style="position: relative; height: 100vh;">
  <canvas id="hero-canvas" style="position: absolute; inset: 0;"></canvas>
  <div style="position: relative; z-index: 1;">
    <h1>Your Content Here</h1>
  </div>
</section>
```

```javascript
import { VizFX, WaveEffect } from './lib/vizfx';

const viz = new VizFX({ canvas: '#hero-canvas' });
viz.addEffect(new WaveEffect({
  amplitude: 0.06,
  frequency: 3.0,
  speed: 0.8,
  color1: '#4f46e5',
  color2: '#7c3aed',
}));
viz.start();
```

### Interactive Button Effect

Create an interactive effect that follows the cursor:

```javascript
import { VizFX, ParticleSystem, Vec2 } from './lib/vizfx';

const button = document.querySelector('#myButton');
const canvas = document.createElement('canvas');
canvas.style.position = 'absolute';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.pointerEvents = 'none';
button.style.position = 'relative';
button.appendChild(canvas);

const viz = new VizFX({ canvas });
const particles = new ParticleSystem({
  count: 200,
  color: '#00ff88',
  size: 2,
  speed: 50,
  lifetime: 1,
  gravity: new Vec2(0, -30),
  emitterRadius: 5,
});

viz.addEffect(particles);
viz.start();

button.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = canvas.height - (e.clientY - rect.top);
  particles.setEmitterPosition(x, y);
});
```

## Effect Combinations

### Layered Background

Combine multiple effects for depth:

```javascript
import { VizFX, GradientMesh, FloatingParticles, WaveEffect } from './lib/vizfx';

const viz = new VizFX({ canvas: '#canvas' });

// Layer 1: Base gradient
viz.addEffect(new GradientMesh({
  colors: ['#1a1a2e', '#16213e', '#0f3460'],
  speed: 0.2,
  complexity: 2.0,
}));

// Layer 2: Slow floating particles (background)
viz.addEffect(new FloatingParticles({
  count: 30,
  color: '#ffffff',
  size: 1.5,
  speed: 8,
  showConnections: false,
}));

// Layer 3: Fast floating particles (foreground)
viz.addEffect(new FloatingParticles({
  count: 20,
  color: '#4facfe',
  size: 3,
  speed: 20,
  connectionDistance: 100,
  showConnections: true,
}));

viz.start();
```

### Dynamic Theme Switcher

Switch between different effect themes:

```javascript
import { VizFX, GradientMesh } from './lib/vizfx';

const viz = new VizFX({ canvas: '#canvas' });
let currentEffect = null;

const themes = {
  ocean: {
    colors: ['#0077be', '#00a8e8', '#00d9ff', '#7dd3fc'],
    speed: 0.4,
  },
  sunset: {
    colors: ['#ff6b6b', '#ee5a6f', '#c44569', '#f093fb'],
    speed: 0.5,
  },
  forest: {
    colors: ['#2d6a4f', '#40916c', '#52b788', '#74c69d'],
    speed: 0.3,
  },
};

function setTheme(themeName) {
  if (currentEffect) {
    viz.removeEffect(currentEffect);
  }
  
  currentEffect = new GradientMesh(themes[themeName]);
  viz.addEffect(currentEffect);
  
  if (!viz.isRunning) {
    viz.start();
  }
}

// Set initial theme
setTheme('ocean');

// Switch themes
document.querySelector('#theme-ocean').addEventListener('click', () => setTheme('ocean'));
document.querySelector('#theme-sunset').addEventListener('click', () => setTheme('sunset'));
document.querySelector('#theme-forest').addEventListener('click', () => setTheme('forest'));
```

## Performance Optimization

### Adaptive Quality

Adjust quality based on device performance:

```javascript
import { VizFX, FloatingParticles } from './lib/vizfx';

// Detect device capabilities
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const isLowEnd = navigator.hardwareConcurrency <= 4;

// Adjust settings
const particleCount = isMobile ? 30 : isLowEnd ? 50 : 100;
const dpr = isMobile ? 1 : window.devicePixelRatio;

const viz = new VizFX({ 
  canvas: '#canvas',
  dpr: dpr,
});

viz.addEffect(new FloatingParticles({
  count: particleCount,
  showConnections: !isMobile, // Disable connections on mobile
}));

viz.start();
```

### FPS Monitoring

Monitor and adjust based on frame rate:

```javascript
import { VizFX, ParticleSystem } from './lib/vizfx';

const viz = new VizFX({ canvas: '#canvas' });
let particleSystem = new ParticleSystem({ count: 1000 });
viz.addEffect(particleSystem);
viz.start();

// Simple FPS counter
let lastTime = performance.now();
let frames = 0;
let fps = 60;

function measureFPS() {
  frames++;
  const now = performance.now();
  
  if (now >= lastTime + 1000) {
    fps = Math.round((frames * 1000) / (now - lastTime));
    frames = 0;
    lastTime = now;
    
    // Adjust quality if FPS drops
    if (fps < 30 && particleSystem.options.count > 100) {
      console.log('Low FPS detected, reducing particles');
      viz.removeEffect(particleSystem);
      particleSystem = new ParticleSystem({ 
        count: Math.max(100, particleSystem.options.count - 200) 
      });
      viz.addEffect(particleSystem);
    }
  }
  
  requestAnimationFrame(measureFPS);
}

measureFPS();
```

### Lazy Loading

Load effects only when visible:

```javascript
import { VizFX, WaveEffect } from './lib/vizfx';

const section = document.querySelector('#effects-section');
const canvas = section.querySelector('canvas');
let viz = null;

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !viz) {
      // Section is visible, start effect
      viz = new VizFX({ canvas });
      viz.addEffect(new WaveEffect());
      viz.start();
    } else if (!entry.isIntersecting && viz) {
      // Section is not visible, stop effect
      viz.stop();
    }
  });
});

observer.observe(section);
```

## Responsive Design

### Auto-Resize Handler

Ensure effects resize properly:

```javascript
import { VizFX, GradientMesh } from './lib/vizfx';

const viz = new VizFX({ canvas: '#canvas' });
viz.addEffect(new GradientMesh());
viz.start();

// Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    viz.resize();
  }, 250);
});
```

### Breakpoint-Based Effects

Different effects for different screen sizes:

```javascript
import { VizFX, ParticleSystem, FloatingParticles } from './lib/vizfx';

const viz = new VizFX({ canvas: '#canvas' });
let currentEffect = null;

function updateEffect() {
  if (currentEffect) {
    viz.removeEffect(currentEffect);
  }
  
  if (window.innerWidth < 768) {
    // Mobile: Simple floating particles
    currentEffect = new FloatingParticles({
      count: 20,
      showConnections: false,
    });
  } else {
    // Desktop: Full particle system
    currentEffect = new ParticleSystem({
      count: 500,
    });
  }
  
  viz.addEffect(currentEffect);
  if (!viz.isRunning) viz.start();
}

updateEffect();

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(updateEffect, 250);
});
```

## Troubleshooting

### Canvas Not Showing

**Problem:** Canvas appears blank or effects don't render.

**Solutions:**

1. Check WebGL support:
```javascript
const canvas = document.querySelector('#canvas');
const gl = canvas.getContext('webgl');
if (!gl) {
  console.error('WebGL not supported');
  // Show fallback content
}
```

2. Ensure canvas has dimensions:
```css
#canvas {
  width: 100%;
  height: 100%;
  min-height: 400px; /* Fallback height */
}
```

3. Check z-index and positioning:
```css
#canvas {
  position: absolute;
  z-index: 1;
}
```

### Performance Issues

**Problem:** Effects run slowly or cause lag.

**Solutions:**

1. Reduce particle count
2. Lower device pixel ratio: `dpr: 1`
3. Disable antialiasing: `antialias: false`
4. Use simpler effects on mobile
5. Limit to one or two effects at a time

### Memory Leaks

**Problem:** Memory usage increases over time.

**Solution:** Always call `destroy()` when removing effects:

```javascript
// When component unmounts or page changes
viz.stop();
viz.destroy();
```

### TypeScript Errors

**Problem:** TypeScript can't find VizFX types.

**Solution:** Ensure proper import:

```typescript
import { VizFX, ParticleSystem } from './lib/vizfx';
import type { VizFXOptions, ParticleSystemOptions } from './lib/vizfx';
```

## Best Practices

1. **Always clean up:** Call `destroy()` when done
2. **Use appropriate particle counts:** Start low and increase
3. **Test on mobile:** Effects should work on all devices
4. **Monitor performance:** Watch for FPS drops
5. **Provide fallbacks:** Handle WebGL unsupported cases
6. **Use CSS for static effects:** Reserve WebGL for dynamic effects
7. **Lazy load:** Only run effects when visible
8. **Debounce resize:** Avoid excessive resize calls

## React Integration

```typescript
import { useEffect, useRef } from 'react';
import { VizFX, ParticleSystem } from './lib/vizfx';

function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current });
    vizRef.current = viz;

    viz.addEffect(new ParticleSystem({ count: 500 }));
    viz.start();

    return () => {
      viz.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
```

## Vue Integration

```vue
<template>
  <canvas ref="canvas" class="w-full h-full"></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { VizFX, WaveEffect } from './lib/vizfx';

const canvas = ref(null);
let viz = null;

onMounted(() => {
  viz = new VizFX({ canvas: canvas.value });
  viz.addEffect(new WaveEffect());
  viz.start();
});

onUnmounted(() => {
  if (viz) {
    viz.destroy();
  }
});
</script>
```

## Additional Resources

- [README.md](./README.md) - Main documentation
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Technical architecture
- [Demo Website](https://vizfx-demo.example.com) - Live examples

## Support

For issues, questions, or contributions, please visit the GitHub repository.

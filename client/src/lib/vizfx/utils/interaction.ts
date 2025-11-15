/**
 * Mouse and touch interaction utilities
 */

import { Vec2 } from './math';

export interface PointerState {
  position: Vec2;
  normalized: Vec2; // -1 to 1 coordinates
  velocity: Vec2;
  isDown: boolean;
}

export class InteractionManager {
  private canvas: HTMLCanvasElement;
  private pointer: PointerState;
  private lastPosition: Vec2;
  private lastTime: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.pointer = {
      position: new Vec2(),
      normalized: new Vec2(),
      velocity: new Vec2(),
      isDown: false,
    };
    this.lastPosition = new Vec2();
    this.lastTime = Date.now();

    this.setupListeners();
  }

  private setupListeners(): void {
    // Mouse events
    this.canvas.addEventListener('mousemove', (e) => this.handleMove(e));
    this.canvas.addEventListener('mousedown', () => this.handleDown());
    this.canvas.addEventListener('mouseup', () => this.handleUp());
    this.canvas.addEventListener('mouseleave', () => this.handleUp());

    // Touch events
    this.canvas.addEventListener(
      'touchmove',
      (e) => {
        e.preventDefault();
        if (e.touches.length > 0) {
          this.handleMove(e.touches[0]);
        }
      },
      { passive: false }
    );
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.handleMove(e.touches[0]);
        this.handleDown();
      }
    });
    this.canvas.addEventListener('touchend', () => this.handleUp());
  }

  private handleMove(e: MouseEvent | Touch): void {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Update position
    this.lastPosition.set(this.pointer.position.x, this.pointer.position.y);
    this.pointer.position.set(x, y);

    // Update normalized coordinates (-1 to 1)
    this.pointer.normalized.set(
      (x / rect.width) * 2 - 1,
      -(y / rect.height) * 2 + 1
    );

    // Calculate velocity
    const now = Date.now();
    const dt = Math.max(now - this.lastTime, 1) / 1000;
    this.lastTime = now;

    const dx = this.pointer.position.x - this.lastPosition.x;
    const dy = this.pointer.position.y - this.lastPosition.y;
    this.pointer.velocity.set(dx / dt, dy / dt);
  }

  private handleDown(): void {
    this.pointer.isDown = true;
  }

  private handleUp(): void {
    this.pointer.isDown = false;
    this.pointer.velocity.set(0, 0);
  }

  getPointer(): PointerState {
    return this.pointer;
  }

  destroy(): void {
    // Remove event listeners
    // (In a production library, we'd store bound functions to properly remove them)
  }
}

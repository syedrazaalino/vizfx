import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code, ShoppingCart } from 'lucide-react';
import { VizFX, WaveEffect } from '@/lib/vizfx';

const products = [
  { id: 1, name: 'Premium Headphones', price: '$299', color1: '#6366f1', color2: '#8b5cf6' },
  { id: 2, name: 'Smart Watch', price: '$399', color1: '#ec4899', color2: '#f43f5e' },
  { id: 3, name: 'Wireless Earbuds', price: '$199', color1: '#14b8a6', color2: '#06b6d4' },
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current, alpha: true });
    vizRef.current = viz;

    const wave = new WaveEffect({
      amplitude: 0.06,
      frequency: 3.5,
      speed: isHovered ? 1.5 : 0.8,
      color1: product.color1,
      color2: product.color2,
    });

    viz.addEffect(wave);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, [isHovered, product.color1, product.color2]);

  return (
    <Card
      className="overflow-hidden bg-card hover:shadow-2xl transition-all duration-300 border-border group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: isHovered ? 0.8 : 0.5 }}
        />
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-8xl opacity-40 group-hover:scale-110 transition-transform">
            🎧
          </div>
        </div>
      </div>
      <div className="p-6 space-y-4 bg-card">
        <h3 className="text-xl font-semibold text-card-foreground">{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">{product.price}</span>
          <Button size="sm">
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function ProductShowcase() {
  const codeExample = `import { VizFX, WaveEffect } from 'vizfx';

function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const viz = new VizFX({ canvas: '#product-canvas', alpha: true });

    const wave = new WaveEffect({
      amplitude: 0.06,
      frequency: 3.5,
      speed: isHovered ? 1.5 : 0.8,  // Speed up on hover
      color1: product.color1,
      color2: product.color2,
    });

    viz.addEffect(wave);
    viz.start();

    return () => viz.destroy();
  }, [isHovered, product]);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas id="product-canvas" />
      {/* Product content */}
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Showcase Section */}
      <section className="py-16 bg-gradient-to-b from-background to-card/50">
        <div className="container">
          <div className="absolute top-4 left-4 z-20">
            <Link href="/examples">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Examples
              </Button>
            </Link>
          </div>

          <div className="text-center mb-12 pt-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Product Showcase
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hover over products to see the wave effect animation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Code Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-3xl font-bold text-card-foreground">Implementation</h2>
            </div>

            <Card className="p-6 bg-background border-border">
              <pre className="overflow-x-auto">
                <code className="text-sm text-foreground font-mono">{codeExample}</code>
              </pre>
            </Card>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold text-card-foreground">How It Works</h3>
              <Card className="p-6 bg-background border-border">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Each product card has its own VizFX instance with a WaveEffect</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Wave colors match the product's brand colors for cohesive design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>On hover, the wave speed increases and opacity changes for feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>The effect is destroyed when the component unmounts to prevent memory leaks</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">💡 Pro Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Use product-specific colors to create brand consistency</li>
                <li>• Increase animation speed on hover for interactive feedback</li>
                <li>• Keep amplitude low (0.05-0.08) for subtle, professional effects</li>
                <li>• Consider using CSS transitions alongside WebGL effects</li>
                <li>• On mobile, you can disable hover effects to save resources</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

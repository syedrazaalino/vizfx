import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Code } from 'lucide-react';
import { VizFX, GradientMesh, FloatingParticles } from '@/lib/vizfx';
import { Card } from '@/components/ui/card';

export default function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current, alpha: true });
    vizRef.current = viz;

    // Gradient background
    const gradient = new GradientMesh({
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      speed: 0.4,
      complexity: 2.5,
    });

    // Floating particles
    const particles = new FloatingParticles({
      count: 60,
      color: '#ffffff',
      size: 2.5,
      speed: 15,
      connectionDistance: 120,
      showConnections: true,
    });

    viz.addEffect(gradient);
    viz.addEffect(particles);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, []);

  const codeExample = `import { VizFX, GradientMesh, FloatingParticles } from 'vizfx';

const viz = new VizFX({ canvas: '#hero-canvas', alpha: true });

// Add gradient background
viz.addEffect(new GradientMesh({
  colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
  speed: 0.4,
  complexity: 2.5,
}));

// Add floating particles
viz.addEffect(new FloatingParticles({
  count: 60,
  color: '#ffffff',
  size: 2.5,
  speed: 15,
  connectionDistance: 120,
  showConnections: true,
}));

viz.start();`;

  return (
    <div className="min-h-screen bg-background">
      {/* Example Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.6 }}
        />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent">
            Your Product
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-8 max-w-2xl mx-auto">
            Build something amazing with stunning visual effects
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="text-lg">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="text-lg bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/examples">
            <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Examples
            </Button>
          </Link>
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
              <h3 className="text-xl font-semibold text-card-foreground">HTML Structure</h3>
              <Card className="p-6 bg-background border-border">
                <pre className="overflow-x-auto">
                  <code className="text-sm text-foreground font-mono">{`<section class="hero">
  <canvas id="hero-canvas"></canvas>
  <div class="hero-content">
    <h1>Your Product</h1>
    <p>Your tagline here</p>
    <button>Get Started</button>
  </div>
</section>`}</code>
                </pre>
              </Card>

              <h3 className="text-xl font-semibold text-card-foreground">CSS Styling</h3>
              <Card className="p-6 bg-background border-border">
                <pre className="overflow-x-auto">
                  <code className="text-sm text-foreground font-mono">{`.hero {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

#hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.6;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
}`}</code>
                </pre>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">💡 Pro Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Adjust opacity (0.4-0.7) to ensure text remains readable</li>
                <li>• Use fewer particles (30-60) on mobile for better performance</li>
                <li>• Match gradient colors to your brand palette</li>
                <li>• Add backdrop-blur to buttons for a modern glass effect</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

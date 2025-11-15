import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code } from 'lucide-react';
import { VizFX, GradientMesh } from '@/lib/vizfx';

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current, alpha: false });
    vizRef.current = viz;

    const gradient = new GradientMesh({
      colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483'],
      speed: 0.3,
      complexity: 2.0,
    });

    viz.addEffect(gradient);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, []);

  const codeExample = `import { VizFX, GradientMesh } from 'vizfx';

// Create full-screen background
const canvas = document.createElement('canvas');
canvas.style.cssText = \`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
\`;
document.body.appendChild(canvas);

const viz = new VizFX({ canvas, alpha: false });

viz.addEffect(new GradientMesh({
  colors: ['#1a1a2e', '#16213e', '#0f3460', '#533483'],
  speed: 0.3,
  complexity: 2.0,
}));

viz.start();`;

  return (
    <div className="min-h-screen relative">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="container py-4">
          <Link href="/examples">
            <Button variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Examples
            </Button>
          </Link>
        </div>

        {/* Hero Content */}
        <section className="container py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
            Animated Background
          </h1>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-8">
            A full-page gradient mesh that works as a dynamic background for any content
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20">
              Learn More
            </Button>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="container py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { title: 'Always Visible', desc: 'Background stays fixed while content scrolls' },
              { title: 'Performance', desc: 'Optimized for smooth 60fps animation' },
              { title: 'Customizable', desc: 'Easy to adjust colors, speed, and complexity' },
            ].map((item, i) => (
              <Card key={i} className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                <p className="text-white/70">{item.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Scrollable Content Demo */}
        <section className="container py-16">
          <Card className="max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-sm border-white/20">
            <h2 className="text-3xl font-bold mb-4 text-white">Scroll to See Effect</h2>
            <p className="text-white/80 mb-4">
              Notice how the background stays fixed while the content scrolls smoothly over it.
              This creates a professional, modern look perfect for landing pages, portfolios, and web apps.
            </p>
            <div className="space-y-4 text-white/70">
              <p>
                The gradient mesh continuously animates, creating an organic, living background
                that adds depth and visual interest without being distracting.
              </p>
              <p>
                You can customize the colors to match your brand, adjust the animation speed,
                and control the complexity of the gradient patterns.
              </p>
              <p>
                This technique is particularly effective for hero sections, full-page layouts,
                and anywhere you want to add subtle motion to your design.
              </p>
            </div>
          </Card>
        </section>

        {/* Code Section */}
        <section className="py-16 bg-black/30 backdrop-blur-sm">
          <div className="container">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-2 mb-6">
                <Code className="h-6 w-6 text-white" />
                <h2 className="text-3xl font-bold text-white">Implementation</h2>
              </div>

              <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/20">
                <pre className="overflow-x-auto">
                  <code className="text-sm text-white font-mono">{codeExample}</code>
                </pre>
              </Card>

              <div className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold text-white">CSS Setup</h3>
                <Card className="p-6 bg-black/50 backdrop-blur-sm border-white/20">
                  <pre className="overflow-x-auto">
                    <code className="text-sm text-white font-mono">{`/* Ensure body allows fixed positioning */
body {
  margin: 0;
  min-height: 100vh;
}

/* Content should be above background */
.content {
  position: relative;
  z-index: 1;
}

/* Optional: Add backdrop blur to cards */
.card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}`}</code>
                  </pre>
                </Card>
              </div>

              <div className="mt-8 p-6 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
                <h3 className="text-lg font-semibold mb-2 text-white">💡 Pro Tips</h3>
                <ul className="space-y-2 text-white/80">
                  <li>• Use position: fixed and z-index: -1 for true background behavior</li>
                  <li>• Set alpha: false for opaque backgrounds (better performance)</li>
                  <li>• Choose darker colors for better text contrast</li>
                  <li>• Add backdrop-blur to content cards for glass morphism effect</li>
                  <li>• Keep complexity low (1.5-2.5) for subtle, professional look</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-white/20">
          <div className="container text-center">
            <p className="text-white/70">
              This entire page uses VizFX as the background
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

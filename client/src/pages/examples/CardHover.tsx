import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Code, Sparkles, Zap, Star } from 'lucide-react';
import { VizFX, ParticleSystem, Vec2 } from '@/lib/vizfx';

const features = [
  { icon: Sparkles, title: 'Fast Performance', description: 'Lightning-fast load times', color: '#f59e0b' },
  { icon: Zap, title: 'Easy to Use', description: 'Simple and intuitive API', color: '#3b82f6' },
  { icon: Star, title: 'Beautiful Design', description: 'Stunning visual effects', color: '#ec4899' },
];

function InteractiveCard({ feature }: { feature: typeof features[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current, alpha: true });
    vizRef.current = viz;

    const particles = new ParticleSystem({
      count: 0, // Start with no particles
      color: feature.color,
      size: 4,
      speed: 120,
      lifetime: 0.8,
      gravity: new Vec2(0, -100),
      emitterRadius: 40,
      fadeOut: true,
    });
    particleSystemRef.current = particles;

    viz.addEffect(particles);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, [feature.color]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !particleSystemRef.current) return;
    
    // Burst effect on hover
    const rect = canvasRef.current.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    particleSystemRef.current.setEmitterPosition(x, y);
    
    // Temporarily increase particle count for burst effect
    particleSystemRef.current.setCount(150);
    
    setTimeout(() => {
      if (particleSystemRef.current) {
        particleSystemRef.current.setCount(0);
      }
    }, 100);
  };

  return (
    <Card
      className="relative overflow-hidden p-8 bg-card hover:bg-card/80 transition-all hover:scale-105 hover:shadow-2xl border-border group cursor-pointer"
      onMouseEnter={handleMouseEnter}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
      
      <div className="relative z-10 space-y-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <feature.icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-card-foreground">{feature.title}</h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </Card>
  );
}

export default function CardHover() {
  const codeExample = `import { VizFX, ParticleSystem, Vec2 } from 'vizfx';

function InteractiveCard({ color }) {
  const canvasRef = useRef(null);
  const particleSystemRef = useRef(null);

  useEffect(() => {
    const viz = new VizFX({ canvas: canvasRef.current, alpha: true });

    const particles = new ParticleSystem({
      count: 0,  // Start with no particles
      color: color,
      size: 4,
      speed: 120,
      lifetime: 0.8,
      gravity: new Vec2(0, -100),
      emitterRadius: 40,
      fadeOut: true,
    });
    particleSystemRef.current = particles;

    viz.addEffect(particles);
    viz.start();

    return () => viz.destroy();
  }, [color]);

  const handleMouseEnter = () => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    
    particleSystemRef.current.setEmitterPosition(x, y);
    
    // Burst effect
    particleSystemRef.current.setCount(150);
    setTimeout(() => {
      particleSystemRef.current.setCount(0);
    }, 100);
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      <canvas ref={canvasRef} />
      {/* Card content */}
    </div>
  );
}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Section */}
      <section className="py-16 bg-gradient-to-b from-background to-card/50 min-h-screen">
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
              Interactive Card Hover
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Hover over cards to trigger particle burst effects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <InteractiveCard key={index} feature={feature} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Try hovering multiple times to see the effect!
            </p>
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
              <h3 className="text-xl font-semibold text-card-foreground">Burst Effect Technique</h3>
              <Card className="p-6 bg-background border-border">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span><strong className="text-card-foreground">Start with zero particles:</strong> No particles are visible initially</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span><strong className="text-card-foreground">On hover:</strong> Temporarily set particle count to 150 for burst</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span><strong className="text-card-foreground">After 100ms:</strong> Reset count to 0, particles fade out naturally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span><strong className="text-card-foreground">Short lifetime:</strong> Particles disappear quickly (0.8s) for snappy feel</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">💡 Pro Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Use different colors for each card to create visual variety</li>
                <li>• Keep burst duration short (50-150ms) for responsive feel</li>
                <li>• Set particle lifetime to 0.5-1.0s for quick disappearance</li>
                <li>• Position emitter at card center for symmetrical burst</li>
                <li>• Combine with CSS scale transform for enhanced effect</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

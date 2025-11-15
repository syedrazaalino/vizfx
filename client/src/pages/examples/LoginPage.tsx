import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Code } from 'lucide-react';
import { VizFX, ParticleSystem, Vec2 } from '@/lib/vizfx';

export default function LoginPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current, alpha: true });
    vizRef.current = viz;

    const particles = new ParticleSystem({
      count: 300,
      color: '#667eea',
      size: 3,
      speed: 80,
      lifetime: 2.5,
      gravity: new Vec2(0, -60),
      emitterRadius: 30,
      fadeOut: true,
    });
    particleSystemRef.current = particles;

    viz.addEffect(particles);
    viz.start();

    // Set initial position
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    particles.setEmitterPosition(rect.width / 2, rect.height / 2);

    return () => {
      viz.destroy();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current || !particleSystemRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = rect.height - (e.clientY - rect.top);
    particleSystemRef.current.setEmitterPosition(x, y);
  };

  const codeExample = `import { VizFX, ParticleSystem, Vec2 } from 'vizfx';

const viz = new VizFX({ canvas: '#login-canvas', alpha: true });

const particles = new ParticleSystem({
  count: 300,
  color: '#667eea',
  size: 3,
  speed: 80,
  lifetime: 2.5,
  gravity: new Vec2(0, -60),
  emitterRadius: 30,
  fadeOut: true,
});

viz.addEffect(particles);
viz.start();

// Follow mouse cursor
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = rect.height - (e.clientY - rect.top);
  particles.setEmitterPosition(x, y);
});`;

  return (
    <div className="min-h-screen bg-background">
      {/* Login Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        onMouseMove={handleMouseMove}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 0.3 }}
        />

        <div className="relative z-10 w-full max-w-md px-4">
          <Card className="p-8 bg-card/90 backdrop-blur-sm border-border shadow-2xl">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2 text-card-foreground">Welcome Back</h1>
              <p className="text-muted-foreground">Sign in to your account</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-primary hover:underline">
                Sign up
              </a>
            </div>
          </Card>
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <Link href="/examples">
            <Button variant="outline" className="bg-card/50 backdrop-blur-sm">
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
              <h3 className="text-xl font-semibold text-card-foreground">Key Features</h3>
              <Card className="p-6 bg-background border-border">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-card-foreground">Mouse-following particles:</strong> Creates an engaging, interactive experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-card-foreground">Backdrop blur:</strong> Modern glass-morphism effect on the login card</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-card-foreground">Low opacity:</strong> Ensures form remains readable and accessible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span><strong className="text-card-foreground">Subtle animation:</strong> Adds polish without being distracting</span>
                  </li>
                </ul>
              </Card>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="text-lg font-semibold mb-2 text-card-foreground">💡 Pro Tips</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Keep particle count moderate (200-400) for smooth performance</li>
                <li>• Use backdrop-blur-sm on the card for better text contrast</li>
                <li>• Set canvas opacity to 0.2-0.4 to maintain form visibility</li>
                <li>• Consider disabling particles on mobile to save battery</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

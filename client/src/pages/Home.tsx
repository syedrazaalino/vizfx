import { useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  VizFX,
  ParticleSystem,
  WaveEffect,
  FloatingParticles,
  GradientMesh,
  Vec2,
} from '@/lib/vizfx';
import { Sparkles, Waves, Network, Palette, Code, Zap, Github } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section with Background Effect */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Interactive Demos */}
      <DemosSection />

      {/* Code Examples */}
      <CodeSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}

function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current, alpha: true });
    vizRef.current = viz;

    const gradientMesh = new GradientMesh({
      colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      speed: 0.3,
      complexity: 2.5,
    });

    const floatingParticles = new FloatingParticles({
      count: 50,
      color: '#ffffff',
      size: 2,
      speed: 15,
      connectionDistance: 120,
      showConnections: true,
    });

    viz.addEffect(gradientMesh);
    viz.addEffect(floatingParticles);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.4 }}
      />

      {/* Content */}
      <div className="container relative z-10 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            VizFX
          </h1>
          <p className="text-2xl md:text-3xl text-muted-foreground">
            A lightweight WebGL effects library for stunning web visuals
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create beautiful particle systems, wave effects, gradient meshes, and more with just a few lines of code. Zero dependencies, pure WebGL magic.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => {
                document.getElementById('code-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              <Code className="mr-2 h-5 w-5" />
              Get Started
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => {
                window.open('https://github.com/vizfx/vizfx', '_blank');
              }}
            >
              <Github className="mr-2 h-5 w-5" />
              View on GitHub
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex items-start justify-center p-2">
          <div className="w-1 h-3 bg-primary rounded-full" />
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: Sparkles,
      title: 'Particle Systems',
      description: 'Create dynamic particle effects with physics simulation, emitters, and customizable behaviors.',
    },
    {
      icon: Waves,
      title: 'Wave Effects',
      description: 'Animated wave distortions and ripple effects with customizable amplitude and frequency.',
    },
    {
      icon: Network,
      title: 'Floating Particles',
      description: 'Ambient background particles with connection lines and mouse interaction.',
    },
    {
      icon: Palette,
      title: 'Gradient Mesh',
      description: 'Smooth animated gradients with noise-based color mixing for organic motion.',
    },
    {
      icon: Zap,
      title: 'GPU Accelerated',
      description: 'All effects run on the GPU using WebGL for smooth 60fps performance.',
    },
    {
      icon: Code,
      title: 'Simple API',
      description: 'Easy-to-use API inspired by Three.js. Create effects with just a few lines of code.',
    },
  ];

  return (
    <section className="py-24 bg-card/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create stunning visual effects for your website
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 bg-card hover:bg-card/80 transition-colors border-border">
              <feature.icon className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemosSection() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Interactive Demos</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Try out different effects and see them in action
          </p>
        </div>

        <Tabs defaultValue="particles" className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="particles">Particles</TabsTrigger>
            <TabsTrigger value="waves">Waves</TabsTrigger>
            <TabsTrigger value="floating">Floating</TabsTrigger>
            <TabsTrigger value="gradient">Gradient</TabsTrigger>
          </TabsList>

          <TabsContent value="particles">
            <ParticleDemo />
          </TabsContent>
          <TabsContent value="waves">
            <WaveDemo />
          </TabsContent>
          <TabsContent value="floating">
            <FloatingDemo />
          </TabsContent>
          <TabsContent value="gradient">
            <GradientDemo />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function ParticleDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);
  const particleSystemRef = useRef<ParticleSystem | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current });
    vizRef.current = viz;

    const particleSystem = new ParticleSystem({
      count: 500,
      color: '#667eea',
      size: 4,
      speed: 150,
      lifetime: 2,
      gravity: new Vec2(0, -80),
      emitterRadius: 20,
      fadeOut: true,
    });
    particleSystemRef.current = particleSystem;

    viz.addEffect(particleSystem);
    viz.start();

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvasRef.current!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = rect.height - (e.clientY - rect.top);
      particleSystem.setEmitterPosition(x, y);
    };

    canvasRef.current.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvasRef.current?.removeEventListener('mousemove', handleMouseMove);
      viz.destroy();
    };
  }, []);

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold mb-2 text-card-foreground">Particle System</h3>
          <p className="text-muted-foreground">
            Move your mouse over the canvas to control the particle emitter
          </p>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] bg-background/50 rounded-lg border border-border"
        />
      </div>
    </Card>
  );
}

function WaveDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current });
    vizRef.current = viz;

    const waveEffect = new WaveEffect({
      amplitude: 0.08,
      frequency: 4.0,
      speed: 1.2,
      color1: '#6366f1',
      color2: '#8b5cf6',
    });

    viz.addEffect(waveEffect);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, []);

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold mb-2 text-card-foreground">Wave Effect</h3>
          <p className="text-muted-foreground">
            Animated wave distortions with smooth gradient colors
          </p>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] rounded-lg border border-border"
        />
      </div>
    </Card>
  );
}

function FloatingDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current });
    vizRef.current = viz;

    const floatingParticles = new FloatingParticles({
      count: 80,
      color: '#4facfe',
      size: 3,
      speed: 25,
      connectionDistance: 150,
      showConnections: true,
    });

    viz.addEffect(floatingParticles);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, []);

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold mb-2 text-card-foreground">Floating Particles</h3>
          <p className="text-muted-foreground">
            Ambient particles with connection lines for a network effect
          </p>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] bg-background/50 rounded-lg border border-border"
        />
      </div>
    </Card>
  );
}

function GradientDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vizRef = useRef<VizFX | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const viz = new VizFX({ canvas: canvasRef.current });
    vizRef.current = viz;

    const gradientMesh = new GradientMesh({
      colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731'],
      speed: 0.6,
      complexity: 3.5,
    });

    viz.addEffect(gradientMesh);
    viz.start();

    return () => {
      viz.destroy();
    };
  }, []);

  return (
    <Card className="p-8 bg-card border-border">
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold mb-2 text-card-foreground">Gradient Mesh</h3>
          <p className="text-muted-foreground">
            Smooth animated gradients with organic noise-based motion
          </p>
        </div>
        <canvas
          ref={canvasRef}
          className="w-full h-[400px] rounded-lg border border-border"
        />
      </div>
    </Card>
  );
}

function CodeSection() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(exampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleCode = `import { VizFX, ParticleSystem, Vec2 } from 'vizfx';

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
viz.start();`;

  return (
    <section id="code-section" className="py-24 bg-card/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Simple to Use</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started with just a few lines of code
          </p>
        </div>

        <Card className="max-w-4xl mx-auto p-8 bg-card border-border">
          <div className="relative">
            <Button
              size="sm"
              variant="outline"
              className="absolute top-4 right-4 z-10"
              onClick={copyToClipboard}
            >
              {copied ? 'Copied!' : 'Copy Code'}
            </Button>
            <pre className="bg-background/50 p-6 rounded-lg overflow-x-auto border border-border">
              <code className="text-sm text-foreground font-mono">{exampleCode}</code>
            </pre>
          </div>
        </Card>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 border-t border-border">
      <div className="container">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">VizFX</h3>
          <p className="text-muted-foreground">
            A lightweight WebGL effects library for stunning web visuals
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/examples">
              <Button variant="ghost" size="sm">
                Examples
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                document.getElementById('code-section')?.scrollIntoView({ 
                  behavior: 'smooth' 
                });
              }}
            >
              Documentation
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                window.open('https://github.com/vizfx/vizfx', '_blank');
              }}
            >
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Built with WebGL • Zero Dependencies • Open Source
          </p>
        </div>
      </div>
    </footer>
  );
}

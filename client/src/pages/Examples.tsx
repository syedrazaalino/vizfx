import { Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const examples = [
  {
    id: 'hero-section',
    title: 'Hero Section Background',
    description: 'Full-screen animated gradient with floating particles for landing pages',
    image: '/examples/hero-preview.jpg',
    path: '/examples/hero-section',
  },
  {
    id: 'login-page',
    title: 'Login Page with Effects',
    description: 'Modern login form with particle effects and smooth animations',
    image: '/examples/login-preview.jpg',
    path: '/examples/login-page',
  },
  {
    id: 'product-showcase',
    title: 'Product Showcase',
    description: 'Interactive product display with wave effects on hover',
    image: '/examples/product-preview.jpg',
    path: '/examples/product-showcase',
  },
  {
    id: 'card-hover',
    title: 'Interactive Card Hover',
    description: 'Cards with particle burst effects on mouse interaction',
    image: '/examples/card-preview.jpg',
    path: '/examples/card-hover',
  },
  {
    id: 'animated-background',
    title: 'Animated Background',
    description: 'Full-page gradient mesh background for any content',
    image: '/examples/background-preview.jpg',
    path: '/examples/animated-background',
  },
];

export default function Examples() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-foreground">VizFX Examples</h1>
            <div className="w-24" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real-World Examples
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how VizFX can enhance your projects with these practical examples
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example) => (
            <Card
              key={example.id}
              className="overflow-hidden bg-card hover:bg-card/80 transition-all hover:scale-105 border-border"
            >
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <div className="text-6xl opacity-20">🎨</div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {example.title}
                </h3>
                <p className="text-muted-foreground">{example.description}</p>
                <Link href={example.path}>
                  <Button className="w-full">
                    View Example
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto p-8 bg-card border-border">
            <h3 className="text-2xl font-bold mb-4 text-card-foreground">
              Ready to build your own?
            </h3>
            <p className="text-muted-foreground mb-6">
              Install VizFX and start creating stunning visual effects in minutes
            </p>
            <div className="bg-background/50 p-4 rounded-lg border border-border mb-6">
              <code className="text-sm text-foreground">npm install vizfx</code>
            </div>
            <Link href="/">
              <Button size="lg">
                Back to Documentation
              </Button>
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}

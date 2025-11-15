import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Examples from "./pages/Examples";
import HeroSection from "./pages/examples/HeroSection";
import LoginPage from "./pages/examples/LoginPage";
import ProductShowcase from "./pages/examples/ProductShowcase";
import CardHover from "./pages/examples/CardHover";
import AnimatedBackground from "./pages/examples/AnimatedBackground";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/examples"} component={Examples} />
      <Route path={"/examples/hero-section"} component={HeroSection} />
      <Route path={"/examples/login-page"} component={LoginPage} />
      <Route path={"/examples/product-showcase"} component={ProductShowcase} />
      <Route path={"/examples/card-hover"} component={CardHover} />
      <Route path={"/examples/animated-background"} component={AnimatedBackground} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

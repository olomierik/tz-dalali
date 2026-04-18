import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-md px-6">
        <div className="flex items-baseline gap-0.5 justify-center mb-8">
          <span className="font-bold text-3xl tracking-tight text-primary">TZ</span>
          <span className="font-serif text-3xl text-gold font-semibold">Dalali</span>
        </div>
        <h1 className="font-serif text-8xl text-gold mb-4">404</h1>
        <p className="font-serif text-2xl text-primary mb-3">Page not found</p>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
          The page you're looking for doesn't exist. It may have been moved, or the URL may be
          incorrect.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild variant="gold">
            <Link to="/">Back to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/listings">Browse Properties</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold">404</h1>
        <p className="text-muted-foreground">Page not found</p>
        <Link to="/" className="text-primary underline">Return Home</Link>
      </div>
    </main>
  );
}

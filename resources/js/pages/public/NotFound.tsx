import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4 text-center">
      <div className="w-24 h-24 rounded-full bg-brand-orange-500/10 flex items-center justify-center text-brand-orange-500 mb-8 border border-brand-orange-500/20">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
        The page you are looking for doesn't exist or has been moved. The Amrutha BharatGas portal is constantly evolving.
      </p>
      <Link to="/" className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-foreground text-background font-bold hover:scale-105 transition-transform shadow-xl">
        <ArrowLeft size={20} /> Return to Homepage
      </Link>
    </div>
  );
}

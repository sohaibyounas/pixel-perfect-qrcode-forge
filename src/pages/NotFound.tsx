import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { QRStudioLogo } from "@/components/QRStudioLogo";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7FCFA] p-4 text-hunt-dark font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center max-w-md w-full bg-white p-8 rounded-3xl border border-hunt-mint/60 shadow-xl shadow-teal-900/5 space-y-6"
      >
        <div className="flex justify-center">
          <QRStudioLogo size={64} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-hunt-sage bg-hunt-light px-3 py-1 rounded-full border border-hunt-mint">
            404 Error
          </span>
          <h1 className="text-3xl font-black text-hunt-dark tracking-tight">QR Code Not Found</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            The page you are looking for does not exist or may have been moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full h-11 bg-hunt-teal hover:bg-hunt-dark text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md shadow-hunt-teal/20 transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to QR Studio</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

import { Loader, Loader2 } from "lucide-react";
import React from "react";

function LoadingIcon() {
  return (
    <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <Loader className="animate-spin text-blue-500" />
    </div>
  );
}

export default LoadingIcon;

import { Loader2 } from "lucide-react";
import React from "react";

function loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="animate-spin text-blue-500" size={32} />
      <p className="text-blue-500 text-lg ml-2">Loading...</p>
    </div>
  );
}

export default loading;

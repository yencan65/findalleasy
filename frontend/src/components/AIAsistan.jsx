import React, { useState } from "react";
import { playSnapSound } from "../utils/sounds";
import Lottie from "lottie-react";
import snapLogo from "../assets/ai-snap-logo.json";

const AIAsistan = ({ t }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => { playSnapSound(); setOpen(v=>!v); };
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center select-none">
      <button onClick={handleClick} aria-label="Findalleasy AI Asistan"
        className="w-14 h-14 rounded-full bg-slate-800/80 backdrop-blur-sm shadow-md flex items-center justify-center hover:scale-105 transition-transform">
        <Lottie animationData={snapLogo} loop={false} />
      </button>
      <span className="mt-1 text-[11px] text-[#CDAA7D] font-semibold">AI Asistan</span>
      {open && (
        <div className="absolute bottom-20 right-0 bg-slate-900/90 text-[#CDAA7D] text-xs px-4 py-3 rounded-xl shadow-lg border border-[#CDAA7D]/30 w-56">
          <p>👋 {t ? t("welcome") : "Merhaba! Nasıl yardımcı olabilirim?"}</p>
        </div>
      )}
    </div>
  );
};
export default AIAsistan;

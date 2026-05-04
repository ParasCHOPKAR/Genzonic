"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, MessageCircle } from "lucide-react";

export default function FloatingControls() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false); // Prevents Next.js hydration errors

  useEffect(() => {
    setMounted(true);
    // Check saved theme on load
    const savedTheme = localStorage.getItem("genzonic-theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("genzonic-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("genzonic-theme", "dark");
      setIsDark(true);
    }
  };

  // Don't render until client loads to prevent UI glitches
  if (!mounted) return null; 

  return (
    <div className="floating-controls">
      {/* WhatsApp Button */}
      <a 
        href="https://wa.me/91YOURNUMBERHERE" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="float-btn whatsapp"
      >
        <MessageCircle size={24} color="white" />
      </a>

      {/* Theme Toggle Button */}
      <button onClick={toggleTheme} className="float-btn theme-toggle">
        {isDark ? <Sun size={24} color="white" /> : <Moon size={24} color="black" />}
      </button>

      <style jsx>{`
        .floating-controls {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          z-index: 9999;
        }

        .float-btn {
          width: 55px;
          height: 55px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          box-shadow: 0 10px 20px rgba(0,0,0,0.2);
          transition: transform 0.3s ease;
        }

        .float-btn:hover {
          transform: scale(1.1) translateY(-5px);
        }

        .whatsapp {
          background: #25D366;
        }

        .theme-toggle {
          background: #111111;
        }

        /* Changes button to white in Light Mode */
        :global(html:not(.dark)) .theme-toggle {
          background: #ffffff;
          border: 1px solid #e2e8f0;
        }
      `}</style>
    </div>
  );
}
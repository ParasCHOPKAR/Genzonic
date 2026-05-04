"use client"

import TextPressure from "@/components/UI/TextPressure"
import { useTheme } from "@/app/context/ThemeContext"
import Link from "next/link"

export default function Newsletter() {
  const { theme } = useTheme()

  return (
    <section className="cta-section">

      <div className="cta-container">

        {/* 🔥 TOP BRAND TEXT */}
        <div className="top-text">
          <TextPressure
            text="GenZonic"
            textColor={theme === "dark" ? "#000000" : "#ffffff"}
            minFontSize={60} 
          />
        </div>

        {/* 🔥 SUB TEXT */}
        <p className="sub-text">
          Engineered for creators, rebels, and the next generation.
        </p>

        {/* 🔥 BUTTONS (Now redirecting to Men's page) */}
        <div className="cta-actions">
          <Link href="/shop/men" className="primary">
            SHOP NOW
          </Link>
          <Link href="/shop/men" className="secondary">
            VIEW COLLECTION →
          </Link>
        </div>

      </div>

      <style jsx>{`
        .cta-section {
          background: ${
            theme === "dark"
              ? "linear-gradient(to bottom, #ffffff, #f7f7f7)"
              : "#000"
          };
          color: ${theme === "dark" ? "#000" : "#fff"};

          /* 🔥 REDUCED HEIGHT */
          padding: 80px 20px;  
          
          display: flex;
          justify-content: center;
          overflow: hidden;
        }

        .cta-container {
          max-width: 800px; 
          width: 100%;
          text-align: center;
        }

        /* 🔥 TOP TEXT */
        .top-text {
          margin-bottom: 20px; 
          opacity: 0.6;
        }

        /* 🔥 SUB TEXT */
        .sub-text {
          font-size: 14px;
          opacity: 0.7;
          margin-bottom: 30px; 
        }

        /* 🔥 BUTTON GROUP */
        .cta-actions {
          display: flex;
          justify-content: center;
          gap: 14px; 
          flex-wrap: wrap;
        }

        /* 🔥 PRIMARY BUTTON */
        .primary {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          padding: 12px 26px; 
          background: ${theme === "dark" ? "#000" : "#fff"};
          color: ${theme === "dark" ? "#fff" : "#000"};
          border: none;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          border-radius: 40px;
          transition: all 0.25s ease;
        }

        .primary:hover {
          transform: translateY(-2px);
          opacity: 0.85;
        }

        /* 🔥 SECONDARY BUTTON */
        .secondary {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          background: transparent;
          border: 1px solid ${
            theme === "dark"
              ? "rgba(0,0,0,0.2)"
              : "rgba(255,255,255,0.2)"
          };
          color: inherit;
          font-size: 12px;
          letter-spacing: 1px;
          cursor: pointer;
          padding: 12px 22px; 
          border-radius: 40px;
          transition: all 0.25s ease;
        }

        .secondary:hover {
          background: ${
            theme === "dark"
              ? "rgba(0,0,0,0.05)"
              : "rgba(255,255,255,0.08)"
          };
          transform: translateY(-2px);
        }

        /* 🔥 MOBILE RESPONSIVE OVERRIDES */
        @media (max-width: 768px) {
          .cta-section {
            padding: 60px 16px; 
          }

          .cta-actions {
            flex-direction: column;
          }

          .primary,
          .secondary {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}

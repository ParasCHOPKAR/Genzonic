"use client";

import { useEffect, useState } from "react";
import styles from "./floating.module.css";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className={styles.container}>
      
      {/* WhatsApp */}
      <a
        href="https://wa.me/917507679109"
        target="_blank"
        rel="noopener noreferrer"
        className={styles.whatsapp}
      >
        <FaWhatsapp />
      </a>

      {/* Scroll To Top */}
      {showTop && (
        <button onClick={scrollToTop} className={styles.top}>
          <FaArrowUp />
        </button>
      )}

    </div>
  );
}
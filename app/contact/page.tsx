"use client";

import styles from "./contact.module.css";
import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTheme } from "@/app/context/ThemeContext";

export default function ContactPage() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from(".contact-anim", {
        y: 80,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
        },
      });
    }, containerRef);

    ScrollTrigger.refresh(); // 🔥 important fix

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log(form);
    alert("Message sent 🚀");
  };

  return (
    <section
      ref={containerRef}
      className={styles.contact}
      style={{
        background: darkMode ? "#0a0a0a" : "#ffffff",
        color: darkMode ? "#ffffff" : "#000000",
      }}
    >
      {/* HERO */}
      <div className={`${styles.hero} contact-anim`}>
        <h1>CONTACT</h1>
        <p>Let’s build something iconic together.</p>
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {/* LEFT */}
        <div className={`${styles.info} contact-anim`}>
          <h3>GET IN TOUCH</h3>

          <p>
            Whether you have a question, collaboration idea, or just want to
            connect — we’re always open.
          </p>

          <div className={styles.details}>
            <span>📧 genzonic.store@gmail.com</span>
            <span>📍 Pune, India</span>
            <span>📞 +91 9876543210</span>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className={`${styles.form} contact-anim`}>
          <div className={styles.inputGroup}>
            <input
              type="text"
              required
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <label>Name</label>
          </div>

          <div className={styles.inputGroup}>
            <input
              type="email"
              required
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <label>Email</label>
          </div>

          <div className={styles.inputGroup}>
            <textarea
              required
              onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
            <label>Message</label>
          </div>

          <button type="submit" className={styles.btn}>
            SEND MESSAGE →
          </button>
        </form>
      </div>

    </section>
  );
}
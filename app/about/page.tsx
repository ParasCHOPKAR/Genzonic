"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./about.module.css";
import { useTheme } from "@/app/context/ThemeContext";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const { theme } = useTheme();
  const container = useRef(null);
  const isDark = theme === "dark";

  useGSAP(() => {
    const tl = gsap.timeline();

    // 1. Hero Text: Reveal from bottom
    tl.from(`.${styles.hugeText}`, {
      y: "110%",
      rotateZ: 5,
      duration: 1.5,
      ease: "power4.out",
    }).from(`.${styles.heroSub} > *`, {
      opacity: 0,
      y: 20,
      stagger: 0.1,
      duration: 0.8,
      ease: "power3.out"
    }, "-=1");

    // 2. Story Content: Reveal words on scroll
    gsap.from(`.${styles.storyContent} h2`, {
      scrollTrigger: {
        trigger: `.${styles.sectionWrapper}`,
        start: "top 80%",
      },
      y: 100,
      opacity: 0,
      skewY: 3,
      duration: 1.2,
      ease: "power4.out"
    });

    // 3. Values Card: Sequential hover effect simulation
    gsap.from(`.${styles.valueCard}`, {
      scrollTrigger: {
        trigger: `.${styles.valuesGrid}`,
        start: "top 70%",
      },
      scaleX: 0,
      transformOrigin: "left",
      stagger: 0.2,
      duration: 1,
      ease: "expo.out"
    });

    // 4. Mission: Parallax Parallelogram reveal
    gsap.from(`.${styles.missionContent}`, {
      scrollTrigger: {
        trigger: `.${styles.mission}`,
        start: "top 85%",
        scrub: 1,
      },
      x: 200,
      opacity: 0,
    });

    // 5. Outline Text: Marquee constant animation
    gsap.to(`.${styles.outlineText}`, {
      xPercent: -20,
      scrollTrigger: {
        trigger: `.${styles.mission}`,
        scrub: 1,
      }
    });

  }, { scope: container, dependencies: [isDark] });

  return (
    <section 
      ref={container} 
      className={`${styles.about} ${isDark ? styles.dark : styles.light}`}
    >
      <div className={styles.grain}></div>

      {/* HERO */}
      <div className={styles.hero}>
        <div className={styles.overflow}>
          <h1 className={styles.hugeText}>UNRESTRICTED</h1>
        </div>
        <div className={styles.heroSub}>
          <span>V.01 // CORE COLLECTION</span>
          <p>BREAK THE CYCLE. DEFINE THE FUTURE.</p>
          <span>23.95° N, 120.97° E</span>
        </div>
      </div>

      {/* STORY */}
      <div className={styles.sectionWrapper}>
        <div className={styles.sideLabel}>[ PHASING // 01 ]</div>
        <div className={styles.storyContent}>
          <div className={styles.overflow}>
            <h2>Silence the Noise. Lead the Pack.</h2>
          </div>
          <p>
            We don't manufacture apparel; we craft armor for the modern digital nomad. 
            A fusion of technical precision and raw urban energy.
          </p>
        </div>
      </div>

      {/* VALUES */}
      <div className={styles.valuesGrid}>
        {[
          { title: "ANARCHY", text: "Rules are for those without vision." },
          { title: "KINETIC", text: "Motion defines existence. Gear built to move." },
          { title: "SILENCE", text: "Minimalism is the loudest statement." }
        ].map((item, index) => (
          <div key={item.title} className={styles.valueCard}>
            <div className={styles.cardContent}>
              <span className={styles.cardNumber}>S-0{index + 1}</span>
              <div className={styles.cardIndicator}></div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>

    {/* MISSION - Balanced Layout */}
      <div className={styles.mission}>
        <div className={styles.marqueeContainer}>
          <h2 className={styles.outlineText}>VOID THE NORM // VOID THE NORM</h2>
        </div>
        
        <div className={styles.missionSplit}>
          {/* New content to fill the left void */}
          <div className={styles.missionDetails}>
            <div className={styles.detailItem}>
              <span>TYPE</span>
              <p>STREETWEAR ARTIFACTS</p>
            </div>
            <div className={styles.detailItem}>
              <span>ORIGIN</span>
              <p>UNRESTRICTED // LABS</p>
            </div>
            <div className={styles.detailItem}>
              <span>PURPOSE</span>
              <p>CREATIVE REBELLION</p>
            </div>
          </div>

          <div className={styles.missionContent}>
            <p>
              OUR BLUEPRINT IS SIMPLE: ELIMINATE THE UNNECESSARY. 
              WE EXIST TO EMPOWER THE CREATIVE REBEL WITH TOOLS THAT 
              BRIDGE THE GAP BETWEEN VIRTUAL DREAMS AND PHYSICAL REALITY.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
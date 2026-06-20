"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { 
  LockKeyhole, 
  RefreshCcw, 
  Headset, 
  PackageCheck,
  Phone,
  Mail,
  MapPin,
  ArrowRight
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// --- CUSTOM SVG SOCIAL ICONS ---
const Facebook = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const Instagram = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedIn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Youtube = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

// --- REUSABLE LINK COMPONENT ---
const FooterLink = ({ href, text }: { href: string; text: string }) => (
  <li>
    <Link 
      href={href} 
      className="text-white/70 hover:text-white text-[13px] transition-colors duration-300 relative inline-block group"
    >
      {text}
      <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ff3e00] transition-all duration-300 group-hover:w-full"></span>
    </Link>
  </li>
);

// Register GSAP Plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  // 👇 Using useGSAP safely scopes the animation
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse",
      }
    });

    // 1. Trust Bar Items Reveal
    tl.fromTo(".trust-indicator", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    )
    // 2. Main Footer Columns Fade In
    .fromTo(".footer-column", 
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power2.out" },
      "-=0.2"
    )
    // 3. Bottom Copyright Line
    .fromTo(".footer-bottom-bar",
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: "power2.inOut" }
    );
  }, { scope: footerRef });

  return (
    <footer ref={footerRef} className="bg-[#050505] text-white w-full border-t-[4px] border-[#ff3e00] relative z-50">
      
      {/* --- TOP TIER: TRUST BAR --- */}
      <div className="border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-4">
            
            <div className="trust-indicator flex items-start gap-4 opacity-0">
              <div className="text-[#ff3e00] mt-1 shrink-0"><LockKeyhole size={28} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Secure Payment</h4>
                <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">100% secure Razorpay transactions.</p>
              </div>
            </div>

            <div className="trust-indicator flex items-start gap-4 opacity-0">
              <div className="text-[#ff3e00] mt-1 shrink-0"><RefreshCcw size={28} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Easy Returns</h4>
                <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">Hassle-free exchanges within 7 days.</p>
              </div>
            </div>

            <div className="trust-indicator flex items-start gap-4 opacity-0">
              <div className="text-[#ff3e00] mt-1 shrink-0"><Headset size={28} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Customer Support</h4>
                <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">We're here to assist you via email or phone.</p>
              </div>
            </div>

            <div className="trust-indicator flex items-start gap-4 opacity-0">
              <div className="text-[#ff3e00] mt-1 shrink-0"><PackageCheck size={28} strokeWidth={1.5} /></div>
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Premium Packaging</h4>
                <p className="text-white/60 text-xs leading-relaxed max-w-[200px]">Custom utility box with every order.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* --- BOTTOM TIER: MAIN FOOTER --- */}
      <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          
          {/* Column 1: About Us */}
          <div className="footer-column lg:col-span-1 opacity-0">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">About GenZonic</h4>
            <p className="text-white/70 text-[13px] leading-relaxed mb-6">
              Premium streetwear bridging the gap between high-fashion presentation and core culture. More than just apparel — it's an experience.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="#" className="w-8 h-8 rounded-full bg-white text-[#050505] flex items-center justify-center hover:bg-[#ff3e00] hover:text-white transition-colors duration-300">
                <Facebook />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white text-[#050505] flex items-center justify-center hover:bg-[#ff3e00] hover:text-white transition-colors duration-300">
                <Instagram />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white text-[#050505] flex items-center justify-center hover:bg-[#ff3e00] hover:text-white transition-colors duration-300">
                <LinkedIn />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white text-[#050505] flex items-center justify-center hover:bg-[#ff3e00] hover:text-white transition-colors duration-300">
                <Youtube />
              </a>
            </div>
          </div>

          {/* Column 2: Legal & Policies (🔥 RAZORPAY REQUIRED) */}
          <div className="footer-column lg:col-span-1 lg:pl-8 opacity-0">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Legal & Policies</h4>
            <ul className="space-y-3">
              <FooterLink href="/about#terms" text="Terms & Conditions" />
              <FooterLink href="/about#privacy" text="Privacy Policy" />
              <FooterLink href="/about#shipping" text="Shipping & Delivery" />
              <FooterLink href="/about#returns" text="Cancellation & Refunds" />
              <FooterLink href="/contact" text="Contact Us" />
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="footer-column lg:col-span-1 opacity-0">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <FooterLink href="/profile" text="My Account" />
              <FooterLink href="/profile" text="Order Tracking" />
              <FooterLink href="/wishlist" text="Wishlist" />
              <FooterLink href="/about#about" text="The Manifesto" />
              <FooterLink href="/contact" text="Support Ticket" />
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div className="footer-column lg:col-span-1 opacity-0">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Contact HQ</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/70 text-[13px]">
                <Phone size={16} className="shrink-0 mt-0.5 text-[#ff3e00]" />
                <span>+91 8080363744</span>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-[13px]">
                <Mail size={16} className="shrink-0 mt-0.5 text-[#ff3e00]" />
                <a href="mailto:support@genzonic.store" className="hover:text-white transition-colors">support@genzonic.store</a>
              </li>
              <li className="flex items-start gap-3 text-white/70 text-[13px] leading-relaxed">
                <MapPin size={16} className="shrink-0 mt-0.5 text-[#ff3e00]" />
                <span>Pune, Maharashtra,<br />India</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="footer-column lg:col-span-1 opacity-0">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">The Vault</h4>
            <p className="text-white/70 text-[13px] mb-4 leading-relaxed">
              Subscribe to get secure access to exclusive drops, restocks & unreleased artifacts.
            </p>
            <form className="flex mb-6" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="w-full bg-white text-[#050505] px-4 py-2.5 text-[13px] outline-none placeholder:text-zinc-400"
                required
              />
              <button 
                type="submit" 
                className="bg-[#ff3e00] text-white px-4 py-2.5 flex items-center justify-center hover:bg-[#e63800] transition-colors"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} strokeWidth={2} />
              </button>
            </form>
            
            {/* Payment Icons */}
            <div className="flex items-center gap-2 bg-white px-2 py-1.5 w-max rounded-sm">
              <span className="text-[#050505] text-[10px] font-bold px-1 border-r border-zinc-200">VISA</span>
              <span className="text-red-500 text-[10px] font-bold px-1 border-r border-zinc-200">MC</span>
              <span className="text-[#00b4d8] text-[10px] font-bold px-1 border-r border-zinc-200">UPI</span>
              <span className="text-orange-500 text-[10px] font-bold px-1">RuPay</span>
            </div>
          </div>

        </div>
      </div>

      {/* --- COPYRIGHT BAR --- */}
      <div className="footer-bottom-bar bg-[#111111] py-4 opacity-0">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-white/50 text-[11px] md:text-[12px] tracking-wide">
            &copy; {currentYear} GenZonic. All Rights Reserved.
          </p>
          <p className="text-white/50 text-[11px] md:text-[12px] tracking-wide">
            Developed By <span className="text-[#ff3e00] font-bold">DW Innovation PVT LTD</span>
          </p>
        </div>
      </div>

    </footer>
  );
}
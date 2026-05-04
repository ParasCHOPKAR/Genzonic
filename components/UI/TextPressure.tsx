"use client"

import { useEffect, useRef, useState, useCallback } from "react"

// ✅ Types added
const dist = (
  a: { x: number; y: number },
  b: { x: number; y: number }
) => {
  const dx = b.x - a.x
  const dy = b.y - a.y
  return Math.sqrt(dx * dx + dy * dy)
}

const getAttr = (
  distance: number,
  maxDist: number,
  minVal: number,
  maxVal: number
) => {
  const val = maxVal - (maxVal * distance) / maxDist
  return Math.max(minVal, val)
}

export default function TextPressure({
  text = "FUTURE",
  textColor = "#fff",
  minFontSize = 60,
}) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const titleRef = useRef<HTMLHeadingElement | null>(null)
  const spansRef = useRef<HTMLSpanElement[]>([])

  const mouse = useRef({ x: 0, y: 0 })
  const cursor = useRef({ x: 0, y: 0 })

  const [fontSize, setFontSize] = useState(minFontSize)

  const chars = text.split("")

  // Mouse tracking
  useEffect(() => {
    const move = (e: MouseEvent) => {
      cursor.current.x = e.clientX
      cursor.current.y = e.clientY
    }

    window.addEventListener("mousemove", move)
    return () => window.removeEventListener("mousemove", move)
  }, [])

  // Responsive font size
  const updateSize = useCallback(() => {
    if (!containerRef.current) return

    const width = containerRef.current.offsetWidth
    const newSize = Math.max(width / (chars.length * 0.6), minFontSize)

    setFontSize(newSize)
  }, [chars.length, minFontSize])

  useEffect(() => {
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [updateSize])

  // Animation loop
  useEffect(() => {
    let raf: number

    const animate = () => {
      mouse.current.x += (cursor.current.x - mouse.current.x) * 0.1
      mouse.current.y += (cursor.current.y - mouse.current.y) * 0.1

      if (!titleRef.current) return

      const rect = titleRef.current.getBoundingClientRect()
      const maxDist = rect.width / 2

      spansRef.current.forEach((span) => {
        if (!span) return

        const r = span.getBoundingClientRect()

        const center = {
          x: r.x + r.width / 2,
          y: r.y + r.height / 2,
        }

        const d = dist(mouse.current, center)

        const wght = getAttr(d, maxDist, 300, 900)
        const scale = getAttr(d, maxDist, 0.85, 1.2)

        span.style.fontVariationSettings = `'wght' ${wght}`
        span.style.transform = `scale(${scale})`
      })

      raf = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <h1
        ref={titleRef}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "0.02em",
          fontSize,
          margin: 0,
          textTransform: "uppercase",
          fontWeight: 600,
          letterSpacing: "-0.03em",
          color: textColor,
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              if (el) spansRef.current[i] = el
            }}
            style={{
              display: "inline-block",
              transition: "transform 0.2s ease-out",
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}
"use client"

import {
  useEffect,
  useRef,
  useState,
  createElement,
  useMemo,
  useCallback
} from "react"
import gsap from "gsap"

const TextType = ({
  text,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed = false,
  onSentenceComplete,
  startOnVisible = false,
  reverseMode = false,
  ...props
}: any) => {

  const [displayedText, setDisplayedText] = useState("")
  const [currentCharIndex, setCurrentCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(!startOnVisible)

  const cursorRef = useRef<any>(null)
  const containerRef = useRef<any>(null)

  const textArray = useMemo(
    () => (Array.isArray(text) ? text : [text]),
    [text]
  )

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed
    return Math.random() * 60 + 40
  }, [variableSpeed, typingSpeed])

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return "inherit"
    return textColors[currentTextIndex % textColors.length]
  }

  /* Intersection Observer */

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [startOnVisible])

  /* Cursor animation */

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true
      })
    }
  }, [showCursor, cursorBlinkDuration])

  /* Typing logic */

  useEffect(() => {
    if (!isVisible) return

    let timeout: any

    const currentText = textArray[currentTextIndex]
    const processedText = reverseMode
      ? currentText.split("").reverse().join("")
      : currentText

    const type = () => {
      if (isDeleting) {
        if (displayedText === "") {
          setIsDeleting(false)

          if (!loop && currentTextIndex === textArray.length - 1) return

          setCurrentTextIndex(prev => (prev + 1) % textArray.length)
          setCurrentCharIndex(0)
        } else {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev.slice(0, -1))
          }, deletingSpeed)
        }
      } else {
        if (currentCharIndex < processedText.length) {
          timeout = setTimeout(() => {
            setDisplayedText(prev => prev + processedText[currentCharIndex])
            setCurrentCharIndex(prev => prev + 1)
          }, variableSpeed ? getRandomSpeed() : typingSpeed)
        } else {
          timeout = setTimeout(() => {
            setIsDeleting(true)
          }, pauseDuration)
        }
      }
    }

    type()

    return () => clearTimeout(timeout)

  }, [
    currentCharIndex,
    displayedText,
    isDeleting,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    loop,
    isVisible,
    reverseMode,
    variableSpeed,
    getRandomSpeed
  ])

  const shouldHideCursor =
    hideCursorWhileTyping &&
    (currentCharIndex < textArray[currentTextIndex].length || isDeleting)

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      style: { display: "inline-block" },
      ...props
    },
    <>
      <span style={{ color: getCurrentTextColor() }}>
        {displayedText}
      </span>

      {showCursor && (
        <span
          ref={cursorRef}
          style={{
            display: shouldHideCursor ? "none" : "inline-block",
            marginLeft: "3px",
            fontWeight: "bold"
          }}
        >
          {cursorCharacter}
        </span>
      )}
    </>
  )
}

export default TextType
"use client"
import { useTheme } from "@/app/context/ThemeContext"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle(){

  const { theme, toggleTheme } = useTheme()

  return(

    <button
      className="theme-toggle"
      onClick={toggleTheme}
    >

      {theme === "dark"
        ? <Sun size={20}/>
        : <Moon size={20}/>
      }

    </button>

  )
}
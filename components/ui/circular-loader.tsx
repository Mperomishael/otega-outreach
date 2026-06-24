"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface CircularLoaderProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl"
  color?: "primary" | "secondary" | "amber" | "white"
  thickness?: "thin" | "regular" | "thick"
  label?: string
  showPercentage?: boolean
  percentage?: number
  className?: string
}

export default function CircularLoader({
  size = "md",
  color = "amber",
  thickness = "regular",
  label,
  showPercentage = false,
  percentage = 0,
  className,
}: CircularLoaderProps) {
  const [progress, setProgress] = useState(0)

  // Animate progress for visual effect when no percentage is provided
  useEffect(() => {
    if (!showPercentage) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 10))
      }, 300)
      return () => clearInterval(interval)
    } else {
      setProgress(percentage)
    }
  }, [showPercentage, percentage])

  // Size classes
  const sizeClasses = {
    xs: "w-4 h-4 border-2",
    sm: "w-6 h-6 border-2",
    md: "w-10 h-10 border-3",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-4",
  }

  // Color classes
  const colorClasses = {
    primary: "border-gray-200 border-t-blue-600",
    secondary: "border-gray-200 border-t-purple-600",
    amber: "border-amber-200 border-t-amber-800",
    white: "border-gray-300 border-t-white",
  }

  // Thickness classes
  const thicknessClasses = {
    thin: "border-1",
    regular: "",
    thick: "border-[4px]",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "rounded-full animate-spin",
            sizeClasses[size],
            colorClasses[color],
            thicknessClasses[thickness],
          )}
        ></div>

        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className={cn("font-semibold", {
                "text-xs": size === "sm" || size === "xs",
                "text-sm": size === "md",
                "text-base": size === "lg",
                "text-lg": size === "xl",
              })}
            >
              {progress}%
            </span>
          </div>
        )}
      </div>

      {label && (
        <span
          className={cn("mt-2 text-center", {
            "text-xs": size === "sm" || size === "xs",
            "text-sm": size === "md",
            "text-base": size === "lg" || size === "xl",
          })}
        >
          {label}
        </span>
      )}
    </div>
  )
}

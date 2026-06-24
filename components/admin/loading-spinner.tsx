interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large"
}

export default function LoadingSpinner({ size = "medium" }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: "w-5 h-5",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-4 border-amber-200 border-t-amber-800 rounded-full animate-spin`}
      ></div>
    </div>
  )
}

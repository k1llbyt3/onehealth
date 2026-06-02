import React from 'react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { motion } from 'framer-motion'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const Button = React.forwardRef(({ className, variant = 'default', size = 'default', asChild = false, ...props }, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-card text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-primary text-white hover:bg-primary-hover shadow-subtle",
    destructive: "bg-danger text-white hover:bg-danger-hover shadow-subtle",
    outline: "border border-gray-200 bg-white hover:bg-gray-100 text-dark",
    secondary: "bg-accent text-white hover:bg-accent-hover shadow-subtle",
    ghost: "hover:bg-gray-100 text-dark",
    link: "text-primary underline-offset-4 hover:underline",
  }
  
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-12 rounded-card px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

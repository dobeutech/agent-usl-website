import { useRef, ReactNode } from 'react'
import { motion, useInView, Variants } from 'framer-motion'

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  duration?: number
  once?: boolean
  amount?: number
}

export function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  duration = 0.6,
  once = true,
  amount = 0.2
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount })

  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 40, x: 0 }
      case 'down': return { y: -40, x: 0 }
      case 'left': return { y: 0, x: 40 }
      case 'right': return { y: 0, x: -40 }
      case 'none': return { y: 0, x: 0 }
      default: return { y: 40, x: 0 }
    }
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      ...getInitialPosition(),
      filter: 'blur(8px)'
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      filter: 'blur(0px)',
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  )
}

// Staggered children animation wrapper
interface StaggerContainerProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  delayChildren?: number
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.1,
  delayChildren = 0.2
}: StaggerContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren
      }
    }
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {children}
    </motion.div>
  )
}

// Individual stagger child
interface StaggerItemProps {
  children: ReactNode
  className?: string
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale'
}

export function StaggerItem({
  children,
  className = '',
  direction = 'up'
}: StaggerItemProps) {
  const getVariants = (): Variants => {
    const base = {
      hidden: { opacity: 0, filter: 'blur(4px)' },
      visible: {
        opacity: 1,
        filter: 'blur(0px)',
        transition: {
          duration: 0.5,
          ease: [0.25, 0.1, 0.25, 1]
        }
      }
    }

    switch (direction) {
      case 'up':
        return {
          hidden: { ...base.hidden, y: 30 },
          visible: { ...base.visible, y: 0 }
        }
      case 'down':
        return {
          hidden: { ...base.hidden, y: -30 },
          visible: { ...base.visible, y: 0 }
        }
      case 'left':
        return {
          hidden: { ...base.hidden, x: 30 },
          visible: { ...base.visible, x: 0 }
        }
      case 'right':
        return {
          hidden: { ...base.hidden, x: -30 },
          visible: { ...base.visible, x: 0 }
        }
      case 'scale':
        return {
          hidden: { ...base.hidden, scale: 0.8 },
          visible: { ...base.visible, scale: 1 }
        }
      default:
        return base
    }
  }

  return (
    <motion.div className={className} variants={getVariants()}>
      {children}
    </motion.div>
  )
}

// Parallax wrapper for scroll effects
interface ParallaxProps {
  children: ReactNode
  className?: string
  speed?: number
}

export function Parallax({
  children,
  className = '',
  speed: _speed = 0.5
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Note: speed parameter reserved for future parallax implementation

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        willChange: 'transform'
      }}
      initial={{ y: 0 }}
      whileInView={{ y: 0 }}
      transition={{
        type: 'spring',
        stiffness: 100,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  )
}

// Hover card with 3D tilt effect
interface TiltCardProps {
  children: ReactNode
  className?: string
  glare?: boolean
}

export function TiltCard({
  children,
  className = '',
  glare = true
}: TiltCardProps) {
  return (
    <motion.div
      className={`relative group ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {children}
      {glare && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      )}
    </motion.div>
  )
}

// Text reveal animation
interface TextRevealProps {
  text: string
  className?: string
  delay?: number
}

export function TextReveal({
  text,
  className = '',
  delay = 0
}: TextRevealProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true })

  const words = text.split(' ')

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block mr-[0.25em]"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.05,
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}

import { useEffect, useRef, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  connections: number[]
}

interface AnimatedBackgroundProps {
  particleCount?: number
  connectionDistance?: number
  className?: string
}

export function AnimatedBackground({
  particleCount = 50,
  connectionDistance = 150,
  className = ''
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>()
  const mouseRef = useRef({ x: 0, y: 0 })
  
  const { scrollY } = useScroll()
  const backgroundY = useTransform(scrollY, [0, 1000], [0, -200])

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        connections: []
      })
    }
    return particles
  }, [particleCount])

  const drawParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    particles: Particle[],
    width: number,
    height: number
  ) => {
    ctx.clearRect(0, 0, width, height)

    // Get primary color from CSS variable, with a safe fallback
    const primaryColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue('--primary')
        .trim() || '#ffffff'

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.3
          ctx.save()
          ctx.beginPath()
          ctx.globalAlpha = opacity
          ctx.strokeStyle = primaryColor
          ctx.lineWidth = 1
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
          ctx.restore()
        }
      }

      // Draw connection to mouse if close
      const mdx = particles[i].x - mouseRef.current.x
      const mdy = particles[i].y - mouseRef.current.y
      const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy)

      if (mouseDistance < connectionDistance * 1.5) {
        const opacity = (1 - mouseDistance / (connectionDistance * 1.5)) * 0.5
        ctx.save()
        ctx.beginPath()
        ctx.globalAlpha = opacity
        ctx.strokeStyle = primaryColor
        ctx.lineWidth = 1.5
        ctx.moveTo(particles[i].x, particles[i].y)
        ctx.lineTo(mouseRef.current.x, mouseRef.current.y)
        ctx.stroke()
        ctx.restore()
      }
    }

    // Draw particles
    for (const particle of particles) {
      ctx.save()
      ctx.beginPath()
      ctx.globalAlpha = particle.opacity
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      ctx.fillStyle = primaryColor
      ctx.fill()
      ctx.restore()
    }
  }, [connectionDistance])

  const updateParticles = useCallback((
    particles: Particle[],
    width: number,
    height: number
  ) => {
    for (const particle of particles) {
      particle.x += particle.vx
      particle.y += particle.vy

      // Bounce off edges
      if (particle.x < 0 || particle.x > width) particle.vx *= -1
      if (particle.y < 0 || particle.y > height) particle.vy *= -1

      // Subtle attraction to mouse
      const mdx = mouseRef.current.x - particle.x
      const mdy = mouseRef.current.y - particle.y
      const mouseDistance = Math.sqrt(mdx * mdx + mdy * mdy)

      if (mouseDistance < 200 && mouseDistance > 0) {
        particle.vx += (mdx / mouseDistance) * 0.02
        particle.vy += (mdy / mouseDistance) * 0.02
      }

      // Limit velocity
      const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy)
      if (speed > 1) {
        particle.vx = (particle.vx / speed) * 1
        particle.vy = (particle.vy / speed) * 1
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particlesRef.current = initParticles(canvas.width, canvas.height)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      if (!canvas || !ctx) return
      updateParticles(particlesRef.current, canvas.width, canvas.height)
      drawParticles(ctx, particlesRef.current, canvas.width, canvas.height)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current != null) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [initParticles, updateParticles, drawParticles])

  return (
    <motion.div
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ y: backgroundY }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />
      
      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-90" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background opacity-50" />
      
      {/* Mesh gradient for visual interest */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-secondary/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
    </motion.div>
  )
}

// Floating gradient orbs for additional visual interest
export function FloatingOrbs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-accent/10 to-transparent blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ top: '50%', right: '10%' }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-gradient-to-br from-secondary/20 to-transparent blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ bottom: '20%', left: '30%' }}
      />
    </div>
  )
}

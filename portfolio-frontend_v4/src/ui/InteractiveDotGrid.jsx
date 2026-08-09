import { useEffect, useRef } from 'react'

const SPACING = 22
const BASE_RADIUS = 1
const MAX_RADIUS = 1.45
const INFLUENCE = 100
const IDLE_ALPHA = 0.12
const ACTIVE_ALPHA = 0.55

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function readThemeColor() {
  const styles = getComputedStyle(document.documentElement)
  const primary = styles.getPropertyValue('--color-primary').trim()
  const content = styles.getPropertyValue('--color-base-content').trim()
  return { primary: primary || 'oklch(0.7 0.15 250)', content: content || 'oklch(0.9 0 0)' }
}

export default function InteractiveDotGrid() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let colors = readThemeColor()
    let mx = -9999
    let my = -9999
    let active = false
    let rafId = 0
    let needsDraw = true
    const reduced = prefersReducedMotion()

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      colors = readThemeColor()
      needsDraw = true
      schedule()
    }

    const paint = () => {
      rafId = 0
      if (!needsDraw) return
      needsDraw = false

      ctx.clearRect(0, 0, width, height)

      const cols = Math.ceil(width / SPACING) + 1
      const rows = Math.ceil(height / SPACING) + 1
      const influenceSq = INFLUENCE * INFLUENCE

      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const x = col * SPACING
          const y = row * SPACING

          let radius = BASE_RADIUS
          let alpha = IDLE_ALPHA
          let fill = colors.content

          if (!reduced && active) {
            const dx = x - mx
            const dy = y - my
            const distSq = dx * dx + dy * dy

            if (distSq < influenceSq) {
              const t = 1 - Math.sqrt(distSq) / INFLUENCE
              const eased = t * t * (3 - 2 * t)
              radius = BASE_RADIUS + (MAX_RADIUS - BASE_RADIUS) * eased
              alpha = IDLE_ALPHA + (ACTIVE_ALPHA - IDLE_ALPHA) * eased
              fill = colors.primary
            }
          }

          ctx.beginPath()
          ctx.fillStyle = fill
          ctx.globalAlpha = alpha
          ctx.arc(x, y, radius, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      ctx.globalAlpha = 1
    }

    const schedule = () => {
      if (rafId) return
      rafId = requestAnimationFrame(paint)
    }

    const onMove = (event) => {
      if (reduced) return
      mx = event.clientX
      my = event.clientY
      active = true
      needsDraw = true
      schedule()
    }

    const onLeave = () => {
      active = false
      mx = -9999
      my = -9999
      needsDraw = true
      schedule()
    }

    const onThemeChange = () => {
      colors = readThemeColor()
      needsDraw = true
      schedule()
    }

    resize()

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    const themeObserver = new MutationObserver(onThemeChange)
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'class', 'style'],
    })

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      themeObserver.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
}

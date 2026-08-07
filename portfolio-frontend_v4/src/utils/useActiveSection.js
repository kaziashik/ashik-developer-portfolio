import { useEffect, useState } from 'react'

const HEADER_OFFSET = 96

function getSectionTop(el) {
  return el.getBoundingClientRect().top + window.scrollY
}

// Tracks scroll position and highlights the nav item for the section currently in view.
// `sectionIds` must be in the same order as sections appear on the page.
export function useActiveSection(sectionIds) {
  const [activeId, setActiveId] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return sectionIds.includes(hash) ? hash : sectionIds[0] ?? ''
  })

  useEffect(() => {
    if (!sectionIds.length) return

    const updateActive = () => {
      const scrollLine = window.scrollY + HEADER_OFFSET
      let next = sectionIds[0]

      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (!el) continue
        if (getSectionTop(el) <= scrollLine) next = id
      }

      const nearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 16
      if (nearBottom) {
        next = sectionIds[sectionIds.length - 1]
      }

      setActiveId((prev) => {
        if (prev === next) return prev
        if (window.location.hash !== `#${next}`) {
          window.history.replaceState(null, '', `#${next}`)
        }
        return next
      })
    }

    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        updateActive()
        ticking = false
      })
    }

    updateActive()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sectionIds])

  return activeId
}

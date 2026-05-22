'use client'

import { useEffect, useState } from 'react'

const LIGHT = 'linear-gradient(145deg, #f4f0ff 0%, #ffffff 45%, #eef4ff 100%)'
const DARK  = 'linear-gradient(145deg, #070712 0%, #0b0b1c 50%, #070712 100%)'

export function ThemeBackground() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    // Read initial state
    setDark(document.documentElement.classList.contains('dark'))

    // Watch for ANY change to <html> class — works with all toggle mechanisms
    const observer = new MutationObserver(() => {
      setDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="fixed inset-0 -z-20 transition-colors duration-300"
      style={{ background: dark ? DARK : LIGHT }}
      aria-hidden="true"
    />
  )
}

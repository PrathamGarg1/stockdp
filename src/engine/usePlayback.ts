// The step you are on. Play is a timer that does index++. Arrow keys do the same.
import { useEffect, useState } from "react"

export function usePlayback(resetKey: string, length: number) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(() => {
    setIndex(0)
    setPlaying(false)
  }, [resetKey])

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      setIndex((current) => {
        if (current >= length - 1) {
          setPlaying(false)
          return current
        }
        return current + 1
      })
    }, 720 / speed)
    return () => window.clearInterval(timer)
  }, [playing, speed, length])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) return
      if (event.code === "Space") {
        event.preventDefault()
        setPlaying((value) => !value)
      } else if (event.key === "ArrowRight") {
        setPlaying(false)
        setIndex((current) => Math.min(length - 1, current + 1))
      } else if (event.key === "ArrowLeft") {
        setPlaying(false)
        setIndex((current) => Math.max(0, current - 1))
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [length])

  const safe = length === 0 ? 0 : Math.min(index, length - 1)
  return { index: safe, setIndex, playing, setPlaying, speed, setSpeed }
}

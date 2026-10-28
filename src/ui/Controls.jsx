import { useEffect, useState } from "react"

// play / pause, prev / next, slider, speed, and the arrow keys + space.
export function Controls({ step, setStep, total }) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(400)
  const last = total - 1

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => setStep((s) => Math.min(s + 1, last)), speed)
    return () => clearInterval(t)
  }, [playing, speed, last])

  useEffect(() => {
    if (step === last) setPlaying(false)
  }, [step, last])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, last))
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0))
      if (e.key === " ") (e.preventDefault(), setPlaying((p) => !p))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [last])

  const btn = "h-9 w-9 rounded-md border bg-white text-sm hover:bg-slate-50"
  return (
    <div className="sticky bottom-0 flex flex-wrap items-center gap-2 rounded-lg border bg-white/95 p-3 shadow-sm backdrop-blur">
      <button className={btn} onClick={() => setStep(0)}>⏮</button>
      <button className={btn} onClick={() => setStep(Math.max(step - 1, 0))}>‹</button>
      <button className="h-9 w-9 rounded-md bg-violet-600 text-white" onClick={() => setPlaying(!playing)}>{playing ? "⏸" : "▶"}</button>
      <button className={btn} onClick={() => setStep(Math.min(step + 1, last))}>›</button>
      <button className={btn} onClick={() => setStep(last)}>⏭</button>
      <input className="min-w-40 flex-1 accent-violet-600" type="range" min={0} max={last} value={step} onChange={(e) => setStep(+e.target.value)} />
      <span className="w-20 text-right text-xs text-muted-foreground">{step + 1} / {total}</span>
      <select className="rounded border bg-white px-2 py-1 text-xs" value={speed} onChange={(e) => setSpeed(+e.target.value)}>
        <option value={800}>slow</option>
        <option value={400}>normal</option>
        <option value={120}>fast</option>
      </select>
    </div>
  )
}

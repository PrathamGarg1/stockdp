import { useEffect, useRef, useState } from "react"
import { cn } from "./patterns"

// The solution being run, with the line the program is on highlighted.
// "View C++" swaps in the original C++ (no highlight: its line numbers differ from the JS).
export function Code({ code, cpp, line }) {
  const [showCpp, setShowCpp] = useState(false)
  const now = useRef(null)
  useEffect(() => now.current?.scrollIntoView({ block: "nearest" }), [line, showCpp])
  const text = showCpp ? cpp : code
  return (
    <div className="relative">
      <button
        onClick={() => setShowCpp(!showCpp)}
        className="absolute right-3 top-3 z-10 rounded-md bg-white/10 px-2.5 py-1 text-xs font-medium text-slate-200 ring-1 ring-white/20 hover:bg-white/20"
      >
        {showCpp ? "View JS (running)" : "View C++"}
      </button>
      <pre className="max-h-[34rem] overflow-auto rounded-lg border bg-slate-950 py-2 text-[12px] leading-5 text-slate-100">
        {text.split("\n").map((row, k) => (
          <div key={k} ref={!showCpp && k + 1 === line ? now : undefined} className={cn("flex px-2", !showCpp && k + 1 === line && "bg-amber-400/25")}>
            <span className="w-8 shrink-0 select-none pr-3 text-right text-slate-500">{k + 1}</span>
            <code className={cn("whitespace-pre", row.trim().startsWith("//") && "text-slate-500")}>{row || " "}</code>
          </div>
        ))}
      </pre>
    </div>
  )
}

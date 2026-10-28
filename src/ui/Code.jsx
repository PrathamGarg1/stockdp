import { useEffect, useRef } from "react"
import { cn } from "./patterns"

// your code. The highlighted line is the one the debugger is stopped on.
export function Code({ code, line }) {
  const now = useRef(null)
  useEffect(() => now.current?.scrollIntoView({ block: "nearest" }), [line])
  return (
    <pre className="max-h-[34rem] overflow-auto rounded-lg border bg-slate-950 py-2 text-[12px] leading-5 text-slate-100">
      {code.split("\n").map((text, k) => (
        <div key={k} ref={k + 1 === line ? now : undefined} className={cn("flex px-2", k + 1 === line && "bg-amber-400/25")}>
          <span className="w-8 shrink-0 select-none pr-3 text-right text-slate-500">{k + 1}</span>
          <code className={cn("whitespace-pre", text.trim().startsWith("//") && "text-slate-500")}>{text || " "}</code>
        </div>
      ))}
    </pre>
  )
}

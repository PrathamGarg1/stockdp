import { cn } from "./patterns"

// My original C++ for the problem, with line numbers.
export function Code({ cpp }) {
  return (
    <pre className="max-h-[34rem] overflow-auto rounded-lg border bg-slate-950 py-2 text-[12px] leading-5 text-slate-100">
      {cpp.split("\n").map((row, k) => (
        <div key={k} className="flex px-2">
          <span className="w-8 shrink-0 select-none pr-3 text-right text-slate-500">{k + 1}</span>
          <code className={cn("whitespace-pre", row.trim().startsWith("//") && "text-slate-500")}>{row || " "}</code>
        </div>
      ))}
    </pre>
  )
}

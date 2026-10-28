import { PATTERNS, cn } from "./patterns"

export function Header({ problem }) {
  const pattern = PATTERNS[problem.pattern]
  return (
    <header>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-2xl font-bold">{problem.title}</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-border">
          <span className={cn("h-2 w-2 rounded-full", pattern.dot)} />
          {pattern.name}
        </span>
      </div>
      <p className="mt-1 text-sm">{problem.note}</p>
      <p className="mt-2 rounded-md bg-slate-50 p-3 text-sm text-muted-foreground">
        <b className="text-foreground">Spot it:</b> {pattern.spot} <b className="text-foreground">Rule:</b> {pattern.rule}
      </p>
    </header>
  )
}

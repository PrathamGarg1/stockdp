import { PATTERNS, cn } from "./patterns"

// All problems, grouped by pattern.
export function Sidebar({ problems, id }) {
  return (
    <aside className="h-full w-72 shrink-0 overflow-auto border-r bg-slate-50 p-4">
      <h1 className="text-lg font-bold">Stocks & Stones</h1>
      <p className="mb-4 text-xs text-muted-foreground">Your solutions, run line by line. Grouped by pattern.</p>
      {Object.entries(PATTERNS).map(([key, pattern]) => (
        <div key={key} className="mb-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span className={cn("h-2 w-2 rounded-full", pattern.dot)} />
            {pattern.name}
          </div>
          {problems.filter((p) => p.pattern === key).map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              className={cn("block rounded-md px-2 py-1.5 text-sm hover:bg-white", p.id === id && "bg-white font-medium shadow-sm ring-1 ring-violet-300")}
            >
              {p.title}
            </a>
          ))}
        </div>
      ))}
    </aside>
  )
}

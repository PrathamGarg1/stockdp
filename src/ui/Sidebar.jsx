import { PATTERNS, cn } from "./patterns"

const TYPES = { stocks: "Stocks", jumps: "Jumps", stones: "Stones" }

// All problems, grouped by type (the start of the id). The dot is the pattern it uses.
export function Sidebar({ problems, id }) {
  return (
    <aside className="h-full w-72 shrink-0 overflow-auto border-r bg-slate-50 p-4">
      <h1 className="text-lg font-bold">Stocks, Jumps & Stones</h1>
      <p className="mb-4 text-xs text-muted-foreground">Your solutions, run line by line. Type your own input.</p>
      {Object.entries(TYPES).map(([type, name]) => (
        <div key={type} className="mb-4">
          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{name}</div>
          {problems.filter((p) => p.id.startsWith(type)).map((p) => (
            <a
              key={p.id}
              href={`#${p.id}`}
              title={PATTERNS[p.pattern].name}
              className={cn("flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-white", p.id === id && "bg-white font-medium shadow-sm ring-1 ring-violet-300")}
            >
              <span className={cn("h-2 w-2 shrink-0 rounded-full", PATTERNS[p.pattern].dot)} />
              {p.title}
            </a>
          ))}
        </div>
      ))}
    </aside>
  )
}

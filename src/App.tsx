// Read these four files, in order. Skip src/components/ui. That folder is shadcn and Aceternity.
//
// 1. src/problems/best-time-ii.ts   the loop. Every other problem is this with a different body.
// 2. src/engine/usePlayback.ts       the step index. Play is index++.
// 3. src/player.tsx                  shows frames[index], and the C++ tabs.
// 4. src/problems/ladders.ts         the C++ text. Search for stockII. It is not executed.
//
// src/draw.tsx paints one frame. src/problems/stocks.ts, jumps.ts, and stones.ts are the other 25 loops.
import { Link, Navigate, NavLink, Route, Routes, useParams } from "react-router-dom"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Compare, Player } from "@/player"
import { comparePairs, families, problemById, problems } from "@/problems/registry"
import { cn } from "@/lib/utils"

export default function App() {
  return (
    <div className="relative flex h-full overflow-hidden bg-background">
      <BackgroundBeams className="opacity-60" />
      <div className="relative z-10 flex h-full w-full">
        <Sidebar />
        <main className="flex min-w-0 flex-1 flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/compare/:a/:b" element={<Compare />} />
            <Route path="/:family/:id" element={<ProblemRoute />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function ProblemRoute() {
  const { family, id } = useParams()
  const problem = problemById(id ?? "")
  if (!problem || problem.family !== family) return <Navigate to="/" replace />
  return <Player key={problem.id} problem={problem} />
}

function Sidebar() {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r bg-background/80">
      <NavLink to="/" className={cn(buttonVariants({ variant: "ghost" }), "h-auto justify-start rounded-none px-4 py-4 text-sm")}>
        Stocks, jumps, stones
      </NavLink>
      <Separator />
      <ScrollArea className="min-h-0 flex-1">
        <div className="py-2">
          {families.map((family) => (
            <div key={family.id} className="mb-3">
              <p className="px-4 py-1 text-xs text-muted-foreground">{family.label}</p>
              {problems
                .filter((problem) => problem.family === family.id)
                .map((problem) => (
                  <NavLink
                    key={problem.id}
                    to={`/${problem.family}/${problem.id}`}
                    className={({ isActive }) =>
                      cn(buttonVariants({ variant: isActive ? "secondary" : "ghost", size: "sm" }), "h-8 w-full justify-start rounded-none px-4 font-normal")
                    }
                  >
                    {problem.leetcode} {problem.title}
                  </NavLink>
                ))}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  )
}

function Home() {
  return (
    <ScrollArea className="min-h-0 flex-1">
      <div className="mx-auto max-w-3xl space-y-6 p-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">26 sequels</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pick a problem. The list is the decisions. The boxes are the array. The tabs under the board are the C++ writeup, from recursion down to the rolling arrays.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {comparePairs.map((pair) => (
            <Link key={pair.title} to={`/compare/${pair.a}/${pair.b}`}>
              <Card className="bg-card/80 transition-colors hover:bg-accent">
                <CardHeader>
                  <CardTitle className="text-base">{pair.title}</CardTitle>
                  <CardDescription>{pair.blurb}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

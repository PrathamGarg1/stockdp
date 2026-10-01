// The sidebar list. Each problem parses the input, runs a trace, and attaches its C++ from ladders.ts.
import type { Problem } from "../engine/types"
import { jumpProblems } from "./jumps"
import { ladders } from "./ladders"
import { stockProblems } from "./stocks"
import { stoneProblems } from "./stones"
import type { Draft } from "./types"

function finish(draft: Draft): Problem {
  const ladder = ladders[draft.id]
  if (!ladder) throw new Error(`Missing C++ ladder for ${draft.id}`)
  return { ...draft, ladder: ladder.stages, runs: ladder.runs }
}

export const problems: Problem[] = [...stockProblems, ...jumpProblems, ...stoneProblems].map(finish)

export function problemById(id: string): Problem | undefined {
  return problems.find((problem) => problem.id === id)
}

export const families = [
  { id: "stocks" as const, label: "Stocks", detail: "One state machine. A cap, a fee, a cooldown, then a short." },
  { id: "jumps" as const, label: "Jumps", detail: "What counts as an edge. A band, a window, a deque, two stacks." },
  { id: "stones" as const, label: "Stones", detail: "What the player scores. A pile, a remainder, a parity, a count." },
]

export const comparePairs = [
  {
    a: "122",
    b: "188",
    raw: "k=2; 3,2,6,5,0,3",
    title: "Cap the rises",
    blurb: "II takes every rise. IV stops at k transactions.",
  },
  {
    a: "188",
    b: "3573",
    raw: "k=2; 3,2,6,5,0,3",
    title: "Add the short",
    blurb: "Same cap. V may sell first and buy back.",
  },
  {
    a: "55",
    b: "45",
    raw: "2,3,1,1,4",
    title: "Count the windows",
    blurb: "I asks if the band covers the end. II counts the jumps.",
  },
  {
    a: "877",
    b: "1690",
    raw: "5,3,4,5",
    title: "Score the other pile",
    blurb: "Same ends. I scores the pile taken. VII scores what remains.",
  },
]

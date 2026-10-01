import type { Frame } from "../engine/types"
import { F } from "./frame"

// This file is the whole app, once. Read it before anything else.
//
// A trace is the for-loop you already write. Each pass pushes a frame
// instead of printing. A frame is one line of output: the sentence (caption),
// the array (values), and the running answer.
//
// src/player.tsx shows frames[index]. Play is index++.
// The other 25 traces are this function with a different loop.
// The C++ tabs live in ladders.ts under stockII. That text is not executed.

export function trace122(prices: number[]): Frame[] {
  let ans = 0
  const frames: Frame[] = []
  const rises: [number, number][] = []

  frames.push(
    F("No transaction yet.", "Unlimited transactions are the sum of every positive prices[i] - prices[i - 1].", {
      values: prices,
      marks: [{ kind: "index", i: 0, tone: "cursor" }],
      meters: [{ label: "ans", value: "0" }],
      answer: "0",
    }),
  )

  for (let i = 1; i < prices.length; i++) {
    const diff = prices[i] - prices[i - 1]
    if (diff > 0) {
      ans += diff
      rises.push([i - 1, i])
    }
    frames.push(
      F(
        diff > 0 ? `prices[${i}] - prices[${i - 1}] = ${diff}. Add it. ans = ${ans}` : `prices[${i}] - prices[${i - 1}] = ${diff}. Skip.`,
        "The curr/after DP in the writeup returns this same sum. The board plays the rises.",
        {
          values: prices,
          marks: [
            { kind: "index", i, tone: "cursor" },
            ...rises.map(([from, to]) => ({ kind: "range" as const, from, to, tone: "rise" as const })),
          ],
          meters: [{ label: "ans", value: String(ans) }],
          answer: String(ans),
        },
      ),
    )
  }

  return frames
}

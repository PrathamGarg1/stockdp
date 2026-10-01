// Same shape as src/problems/best-time-ii.ts. Read that file first.
import type { Draft } from "./types"
import { fmt } from "../lib/utils"
import { trace122 } from "./best-time-ii"
import { F, grid } from "./frame"
import { ints, limited, pricesOf, read, smallK } from "./parse"
import type { Frame } from "../engine/types"

const NEG = -1e12

function twoRanges(prices: number[]): [number, number][] {
  const n = prices.length
  let best = 0
  let ranges: [number, number][] = []
  for (let a = 0; a < n; a++) {
    for (let b = a + 1; b < n; b++) {
      const first = prices[b] - prices[a]
      if (first > best) {
        best = first
        ranges = [[a, b]]
      }
      for (let c = b + 1; c < n; c++) {
        for (let d = c + 1; d < n; d++) {
          const both = first + prices[d] - prices[c]
          if (both > best) {
            best = both
            ranges = [
              [a, b],
              [c, d],
            ]
          }
        }
      }
    }
  }
  return ranges
}

function trace121(prices: number[]): Frame[] {
  let mintillnow = prices[0]
  let minAt = 0
  let ans = 0
  let bestL = 0
  let bestR = 0
  const frames: Frame[] = [
    F(`mintillnow = prices[0] = ${prices[0]}`, "ans is the best prices[i] - mintillnow so far.", {
      values: prices,
      marks: [{ kind: "index", i: 0, tone: "best" }],
      guides: [{ value: mintillnow, label: "mintillnow" }],
      meters: [
        { label: "mintillnow", value: String(mintillnow) },
        { label: "ans", value: "0" },
      ],
      answer: "0",
    }),
  ]
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] > mintillnow) {
      const gain = prices[i] - mintillnow
      if (gain > ans) {
        ans = gain
        bestL = minAt
        bestR = i
      }
      frames.push(
        F(`prices[${i}] - mintillnow = ${prices[i]} - ${mintillnow} = ${gain}. ans = ${ans}`, "A higher price sells against the lowest price seen so far.", {
          values: prices,
          guides: [{ value: mintillnow, label: "mintillnow" }],
          marks: [
            { kind: "index", i, tone: "cursor" },
            { kind: "index", i: minAt, tone: "best" },
            ...(ans > 0 ? [{ kind: "range" as const, from: bestL, to: bestR, tone: "best" as const }] : []),
          ],
          meters: [
            { label: "mintillnow", value: String(mintillnow) },
            { label: "ans", value: String(ans) },
          ],
          answer: String(ans),
        }),
      )
    } else {
      mintillnow = prices[i]
      minAt = i
      frames.push(
        F(`prices[${i}] = ${prices[i]} is a new mintillnow.`, "The buy moves forward. A cheaper entry replaces the old window.", {
          values: prices,
          guides: [{ value: mintillnow, label: "mintillnow" }],
          marks: [
            { kind: "index", i, tone: "best" },
            ...(ans > 0 ? [{ kind: "range" as const, from: bestL, to: bestR, tone: "best" as const }] : []),
          ],
          meters: [
            { label: "mintillnow", value: String(mintillnow) },
            { label: "ans", value: String(ans) },
          ],
          answer: String(ans),
        }),
      )
    }
  }
  return frames
}

function trace123(prices: number[]): Frame[] {
  let buy1 = NEG
  let sell1 = 0
  let buy2 = NEG
  let sell2 = 0
  const frames: Frame[] = []
  for (let i = 0; i < prices.length; i++) {
    const p = prices[i]
    buy1 = Math.max(buy1, -p)
    sell1 = Math.max(sell1, buy1 + p)
    buy2 = Math.max(buy2, sell1 - p)
    sell2 = Math.max(sell2, buy2 + p)
    const last = i === prices.length - 1
    const ranges = last ? twoRanges(prices) : []
    frames.push(
      F(`Day ${i}, price ${p}. sell2 = ${sell2}`, "Lane 1 has to close before lane 2 can spend it.", {
        values: prices,
        marks: [
          { kind: "index", i, tone: "cursor" },
          ...ranges.map(([from, to]) => ({ kind: "range" as const, from, to, tone: "best" as const })),
        ],
        meters: [
          { label: "buy1", value: fmt(buy1) },
          { label: "sell1", value: String(sell1) },
          { label: "buy2", value: fmt(buy2) },
          { label: "sell2", value: String(sell2) },
        ],
        answer: String(sell2),
      }),
    )
  }
  return frames
}

function trace188(prices: number[], k: number): Frame[] {
  const n = prices.length
  let after = Array.from({ length: 2 }, () => Array(k + 1).fill(0))
  const frames: Frame[] = []
  const collapsed = k * 2 >= n
  for (let i = n - 1; i >= 0; i--) {
    const curr = Array.from({ length: 2 }, () => Array(k + 1).fill(0))
    for (let canbuy = 0; canbuy < 2; canbuy++) {
      for (let t = 1; t <= k; t++) {
        curr[canbuy][t] = canbuy
          ? Math.max(-prices[i] + after[0][t], after[1][t])
          : Math.max(prices[i] + after[1][t - 1], after[0][t])
      }
    }
    const bought = -prices[i] + after[0][k] >= after[1][k]
    frames.push(
      F(
        bought
          ? `i = ${i}. curr[1][${k}] = -prices[i] + after[0][${k}] = ${curr[1][k]}`
          : `i = ${i}. curr[1][${k}] = after[1][${k}] = ${curr[1][k]}`,
        i === 0 && collapsed
          ? `k = ${k} covers every rise. This has collapsed into Stock II.`
          : "after is tomorrow. t is how many transactions are still allowed.",
        {
          values: prices,
          marks: [{ kind: "index", i, tone: "cursor" }],
          table: grid(
            ["canbuy = 1", "canbuy = 0"],
            Array.from({ length: k }, (_, t) => `t = ${t + 1}`),
            [curr[1].slice(1), curr[0].slice(1)],
            [0, k - 1],
            "curr",
          ),
          meters: [
            { label: "price", value: String(prices[i]) },
            { label: `curr[1][${k}]`, value: String(curr[1][k]) },
          ],
          answer: String(curr[1][k]),
        },
      ),
    )
    after = curr.map((row) => row.slice())
  }
  return frames
}

function trace3573(prices: number[], k: number): Frame[] {
  const n = prices.length
  let after = Array.from({ length: 3 }, () => Array(k + 1).fill(0))
  for (let t = 0; t <= k; t++) {
    after[1][t] = NEG
    after[2][t] = NEG
  }
  const frames: Frame[] = []
  for (let i = n - 1; i >= 0; i--) {
    const curr = Array.from({ length: 3 }, () => Array(k + 1).fill(0))
    for (let t = 0; t <= k; t++) {
      curr[1][t] = NEG
      curr[2][t] = NEG
    }
    for (let state = 0; state <= 2; state++) {
      for (let t = 1; t <= k; t++) {
        if (state === 0) curr[0][t] = Math.max(after[0][t], after[1][t] + prices[i], after[2][t] - prices[i])
        else if (state === 1) curr[1][t] = Math.max(after[1][t], -prices[i] + after[0][t - 1])
        else curr[2][t] = Math.max(after[2][t], prices[i] + after[0][t - 1])
      }
    }
    const stay = after[0][k]
    const closeLong = after[1][k] + prices[i]
    const closeShort = after[2][k] - prices[i]
    let how = "stay flat"
    if (closeLong >= stay && closeLong >= closeShort) how = "close the long"
    else if (closeShort >= stay && closeShort >= closeLong) how = "cover the short"
    frames.push(
      F(
        `i = ${i}, price ${prices[i]}. curr[0][${k}] = ${curr[0][k]} (${how}).`,
        "Flat, long, or short. Opening a long subtracts the price. Opening a short adds it. Either spends one t.",
        {
          values: prices,
          marks: [{ kind: "index", i, tone: "cursor" }],
          table: grid(
            ["flat", "long", "short"],
            Array.from({ length: k }, (_, t) => `t = ${t + 1}`),
            [curr[0].slice(1), curr[1].slice(1), curr[2].slice(1)],
            [0, k - 1],
            "curr[state][t]",
          ),
          meters: [
            { label: "flat", value: fmt(curr[0][k]) },
            { label: "long", value: fmt(curr[1][k]) },
            { label: "short", value: fmt(curr[2][k]) },
          ],
          answer: String(curr[0][k]),
        },
      ),
    )
    after = curr.map((row) => row.slice())
  }
  return frames
}

function trace309(prices: number[]): Frame[] {
  let after = [0, 0]
  let moreafter = [0, 0]
  const frames: Frame[] = []
  for (let i = prices.length - 1; i >= 0; i--) {
    const curr = [0, 0]
    curr[1] = Math.max(-prices[i] + after[0], after[1])
    curr[0] = Math.max(prices[i] + moreafter[1], after[0])
    const sold = prices[i] + moreafter[1] >= after[0]
    frames.push(
      F(
        sold
          ? `i = ${i}. curr[0] = prices[i] + moreafter[1] = ${curr[0]}. The next buy waits a day.`
          : `i = ${i}. Selling is worse than resting. curr[0] = after[0] = ${curr[0]}`,
        "moreafter is the day after tomorrow. That gap is the cooldown.",
        {
          values: prices,
          marks: [{ kind: "index", i, tone: sold ? "lock" : "cursor" }],
          meters: [
            { label: "curr[1] buy", value: String(curr[1]) },
            { label: "curr[0] sell", value: String(curr[0]) },
            { label: "after[1]", value: String(after[1]) },
            { label: "moreafter[1]", value: String(moreafter[1]) },
          ],
          answer: String(curr[1]),
        },
      ),
    )
    moreafter = after
    after = curr
  }
  return frames
}

function trace714(prices: number[], fee: number): Frame[] {
  let after = [0, 0]
  const frames: Frame[] = []
  for (let i = prices.length - 1; i >= 0; i--) {
    const curr = [0, 0]
    curr[1] = Math.max(-prices[i] + after[0], after[1])
    curr[0] = Math.max(prices[i] - fee + after[1], after[0])
    const paid = prices[i] - fee + after[1] >= after[0]
    frames.push(
      F(
        paid
          ? `i = ${i}. curr[0] = ${prices[i]} - ${fee} + ${after[1]} = ${curr[0]}`
          : `i = ${i}. Fee makes the sell a loss. curr[0] stays ${curr[0]}`,
        "Same recurrence as unlimited trades. fee comes off the sell.",
        {
          values: prices,
          marks: [{ kind: "index", i, tone: "cursor" }],
          meters: [
            { label: "fee", value: String(fee) },
            { label: "curr[1]", value: String(curr[1]) },
            { label: "curr[0]", value: String(curr[0]) },
          ],
          answer: String(curr[1]),
        },
      ),
    )
    after = curr
  }
  return frames
}

function trace3652(prices: number[], strategy: number[], k: number): Frame[] {
  const n = prices.length
  const profitPrefix = [0]
  const pricePrefix = [0]
  for (let i = 0; i < n; i++) {
    profitPrefix.push(profitPrefix[i] + strategy[i] * prices[i])
    pricePrefix.push(pricePrefix[i] + prices[i])
  }
  const base = profitPrefix[n]
  let best = base
  const frames: Frame[] = [
    F(`Unmodified profit = ${base}.`, "At most one window of length k is rewritten.", {
      values: prices,
      labels: strategy.map(String),
      secondary: { label: "strategy", values: strategy.map(String) },
      meters: [
        { label: "base", value: String(base) },
        { label: "best", value: String(best) },
      ],
      answer: String(base),
    }),
  ]
  for (let left = 0; left + k <= n; left++) {
    const right = left + k
    const mid = left + k / 2
    const delta = -(profitPrefix[right] - profitPrefix[left]) + (pricePrefix[right] - pricePrefix[mid])
    const profit = base + delta
    if (profit > best) best = profit
    const shown = strategy.slice()
    for (let i = left; i < mid; i++) shown[i] = 0
    for (let i = mid; i < right; i++) shown[i] = 1
    frames.push(
      F(
        `Window [${left}, ${right - 1}]. delta = ${delta}. profit = ${profit}`,
        "First k/2 become hold (0). Last k/2 become sell (1). The delta is two prefix reads.",
        {
          values: prices,
          labels: shown.map(String),
          secondary: { label: "rewritten", values: shown.map(String) },
          marks: [
            { kind: "range", from: left, to: mid - 1, tone: "muted" },
            { kind: "range", from: mid, to: right - 1, tone: "rise" },
          ],
          meters: [
            { label: "base", value: String(base) },
            { label: "delta", value: String(delta) },
            { label: "best", value: String(best) },
          ],
          answer: String(best),
        },
      ),
    )
  }
  return frames
}

function kPrices(raw: string): { k: number; prices: number[] } {
  const fields = read(raw)
  return { k: smallK(fields.k), prices: pricesOf(raw) }
}

export const stockProblems: Draft[] = [
  {
    id: "121",
    leetcode: 121,
    title: "Best Time I",
    family: "stocks",
    complexity: "O(n)",
    pattern: "One pass. mintillnow is the buy, ans sells against it.",
    board: "price",
    hint: "7,1,5,3,6,4",
    presets: [{ name: "LeetCode", raw: "7,1,5,3,6,4", answer: "5" }],
    parse: (raw) => pricesOf(raw),
    trace: (input) => trace121(input as number[]),
  },
  {
    id: "122",
    leetcode: 122,
    title: "Best Time II",
    family: "stocks",
    complexity: "O(n)",
    pattern: "Unlimited sells. Every rise is taken, and the rolling DP agrees.",
    board: "price",
    hint: "7,1,5,3,6,4",
    presets: [
      { name: "LeetCode", raw: "7,1,5,3,6,4", answer: "7" },
      { name: "Compare", raw: "k=2; 3,2,6,5,0,3", answer: "7" },
    ],
    parse: (raw) => pricesOf(raw),
    trace: (input) => trace122(input as number[]),
  },
  {
    id: "123",
    leetcode: 123,
    title: "Best Time III",
    family: "stocks",
    complexity: "O(n)",
    pattern: "Two lanes. sell1 exists before buy2 spends it.",
    board: "price",
    hint: "3,3,5,0,0,3,1,4",
    presets: [{ name: "LeetCode", raw: "3,3,5,0,0,3,1,4", answer: "6" }],
    parse: (raw) => pricesOf(raw),
    trace: (input) => trace123(input as number[]),
  },
  {
    id: "188",
    leetcode: 188,
    title: "Best Time IV",
    family: "stocks",
    complexity: "O(nk)",
    pattern: "III with a cap t. A large k collapses back into II.",
    board: "price",
    hint: "k=2; 3,2,6,5,0,3",
    presets: [
      { name: "k = 2", raw: "k=2; 2,4,1", answer: "2" },
      { name: "Compare", raw: "k=2; 3,2,6,5,0,3", answer: "7" },
    ],
    parse: (raw) => kPrices(raw),
    trace: (input) => {
      const { k, prices } = input as { k: number; prices: number[] }
      return trace188(prices, k)
    },
  },
  {
    id: "3573",
    leetcode: 3573,
    title: "Best Time V",
    family: "stocks",
    complexity: "O(nk)",
    pattern: "IV plus a short. Flat, long, short. Opening either spends one t.",
    board: "price",
    hint: "k=2; 1,7,9,8,2",
    presets: [
      { name: "Long and short", raw: "k=2; 1,7,9,8,2", answer: "14" },
      { name: "Compare", raw: "k=2; 3,2,6,5,0,3", answer: "9" },
    ],
    parse: (raw) => kPrices(raw),
    trace: (input) => {
      const { k, prices } = input as { k: number; prices: number[] }
      return trace3573(prices, k)
    },
  },
  {
    id: "309",
    leetcode: 309,
    title: "Cooldown",
    family: "stocks",
    complexity: "O(n)",
    pattern: "A sell reads moreafter, the day after tomorrow.",
    board: "price",
    hint: "1,2,3,0,2",
    presets: [{ name: "LeetCode", raw: "1,2,3,0,2", answer: "3" }],
    parse: (raw) => pricesOf(raw),
    trace: (input) => trace309(input as number[]),
  },
  {
    id: "714",
    leetcode: 714,
    title: "Transaction fee",
    family: "stocks",
    complexity: "O(n)",
    pattern: "Unlimited trades. The sell subtracts fee.",
    board: "price",
    hint: "fee=2; 1,3,2,8,4,9",
    presets: [{ name: "LeetCode", raw: "fee=2; 1,3,2,8,4,9", answer: "8" }],
    parse: (raw) => {
      const fields = read(raw)
      const fee = Number(fields.fee ?? "0")
      if (!Number.isInteger(fee) || fee < 0 || fee > 100) throw new Error("Use a fee from 0 to 100.")
      return { prices: pricesOf(raw), fee }
    },
    trace: (input) => {
      const { prices, fee } = input as { prices: number[]; fee: number }
      return trace714(prices, fee)
    },
  },
  {
    id: "3652",
    leetcode: 3652,
    title: "Using strategy",
    family: "stocks",
    complexity: "O(n)",
    pattern: "One window rewrite. Prefix sums turn each candidate into a delta.",
    board: "price",
    hint: "k=2; prices=4,2,8; strategy=-1,0,1",
    presets: [
      { name: "Rewrite", raw: "k=2; prices=4,2,8; strategy=-1,0,1", answer: "10" },
      { name: "No change", raw: "k=2; prices=5,4,3; strategy=1,1,0", answer: "9" },
    ],
    parse: (raw) => {
      const fields = read(raw)
      const k = smallK(fields.k)
      if (k % 2 !== 0) throw new Error("k has to be even.")
      const prices = limited(ints(fields.prices ?? fields.values, "prices"), "prices", 10)
      const strategy = limited(ints(fields.strategy, "strategy days"), "strategy days", 10)
      if (strategy.length !== prices.length) throw new Error("prices and strategy need the same length.")
      if (strategy.some((value) => value < -1 || value > 1)) throw new Error("strategy entries are -1, 0, or 1.")
      if (k > prices.length) throw new Error("k cannot be longer than the prices.")
      return { prices, strategy, k }
    },
    trace: (input) => {
      const { prices, strategy, k } = input as { prices: number[]; strategy: number[]; k: number }
      return trace3652(prices, strategy, k)
    },
  },
]

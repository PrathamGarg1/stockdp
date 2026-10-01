// Same shape as src/problems/best-time-ii.ts. Read that file first.
import type { Frame } from "../engine/types"
import { F, grid } from "./frame"
import { ints, limited, read } from "./parse"
import type { Draft } from "./types"

const NEG = -1e12

function pilesOf(raw: string, max = 8): number[] {
  const fields = read(raw)
  return limited(ints(fields.piles ?? fields.values, "piles"), "piles", max)
}

function trace877(piles: number[]): Frame[] {
  const n = piles.length
  const dp = Array.from({ length: n }, () => Array(n).fill(0))
  for (let i = 0; i < n; i++) dp[i][i] = piles[i]
  for (let len = 2; len <= n; len++) {
    for (let l = 0; l + len - 1 < n; l++) {
      const r = l + len - 1
      dp[l][r] = Math.max(piles[l] - dp[l + 1][r], piles[r] - dp[l][r - 1])
    }
  }
  const frames: Frame[] = []
  let l = 0
  let r = n - 1
  let alice = true
  let aliceScore = 0
  let bobScore = 0
  while (l <= r) {
    const takeLeft = piles[l] - (l + 1 <= r ? dp[l + 1][r] : 0) >= piles[r] - (l <= r - 1 ? dp[l][r - 1] : 0)
    const i = takeLeft ? l : r
    if (alice) aliceScore += piles[i]
    else bobScore += piles[i]
    frames.push(
      F(
        `${alice ? "Alice" : "Bob"} takes piles[${i}] = ${piles[i]}.`,
        "The interval DP scores the pile you take. The parity shortcut is the last frame.",
        {
          values: piles,
          marks: [
            { kind: "index", i, tone: alice ? "alice" : "bob" },
            { kind: "range", from: l, to: r, tone: "active" },
          ],
          meters: [
            { label: "Alice", value: String(aliceScore) },
            { label: "Bob", value: String(bobScore) },
          ],
        },
      ),
    )
    if (takeLeft) l += 1
    else r -= 1
    alice = !alice
  }
  let even = 0
  let odd = 0
  piles.forEach((value, i) => {
    if (i % 2 === 0) even += value
    else odd += value
  })
  const aliceCan = Math.max(even, odd)
  const bobLeft = Math.min(even, odd)
  const wins = n % 2 === 0 ? aliceCan > bobLeft : dp[0][n - 1] > 0
  frames.push(
    F(
      n % 2 === 0
        ? `Even indexes sum to ${even}. Odd indexes sum to ${odd}. Alice takes the larger parity, ${aliceCan} to ${bobLeft}.`
        : `The end-to-end difference is ${dp[0][n - 1]}.`,
      "With an even count, Alice can always collect every even index or every odd index.",
      {
        values: piles,
        marks: piles.map((_, i) => ({
          kind: "index" as const,
          i,
          tone: (n % 2 === 0 && (even >= odd ? i % 2 === 0 : i % 2 === 1) ? "alice" : "bob") as "alice" | "bob",
        })),
        meters: [
          { label: "even", value: String(even) },
          { label: "odd", value: String(odd) },
        ],
        answer: wins ? "true" : "false",
      },
    ),
  )
  return frames
}

function trace1140(piles: number[]): Frame[] {
  const n = piles.length
  const suffix = Array(n + 1).fill(0)
  for (let i = n - 1; i >= 0; i--) suffix[i] = suffix[i + 1] + piles[i]
  const dp = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0))
  for (let i = n - 1; i >= 0; i--) {
    for (let m = 1; m <= n; m++) {
      for (let x = 1; x <= 2 * m && i + x <= n; x++) {
        dp[i][m] = Math.max(dp[i][m], suffix[i] - dp[i + x][Math.max(m, x)])
      }
    }
  }
  const frames: Frame[] = []
  let i = 0
  let m = 1
  let aliceTurn = true
  let alice = 0
  while (i < n) {
    let bestX = 1
    let best = -1
    const limit = Math.min(2 * m, n - i)
    for (let x = 1; x <= limit; x++) {
      const val = suffix[i] - dp[i + x][Math.max(m, x)]
      if (val > best) {
        best = val
        bestX = x
      }
    }
    const taken = piles.slice(i, i + bestX).reduce((sum, value) => sum + value, 0)
    if (aliceTurn) alice += taken
    const nextM = Math.max(m, bestX)
    frames.push(
      F(
        `${aliceTurn ? "Alice" : "Bob"} takes X = ${bestX} with M = ${m}. Suffix left for the opponent is worth ${dp[i + bestX][nextM]}.`,
        "Legal X is 1..2M. After the take, M becomes max(M, X).",
        {
          values: piles,
          marks: [
            { kind: "range", from: i, to: Math.min(n - 1, i + 2 * m - 1), tone: "muted" },
            { kind: "range", from: i, to: i + bestX - 1, tone: "best" },
          ],
          table: grid(
            ["dp[i][M]"],
            Array.from({ length: Math.min(n, 4) }, (_, index) => `M=${index + 1}`),
            [Array.from({ length: Math.min(n, 4) }, (_, index) => dp[i][index + 1])],
            [0, Math.min(m, 4) - 1],
            `row i = ${i}`,
          ),
          meters: [
            { label: "M", value: String(m) },
            { label: "X", value: String(bestX) },
            { label: "Alice", value: String(alice) },
          ],
          answer: String(alice),
        },
      ),
    )
    i += bestX
    m = nextM
    aliceTurn = !aliceTurn
  }
  frames[frames.length - 1].answer = String(dp[0][1])
  return frames
}

function trace1406(values: number[]): Frame[] {
  const n = values.length
  const dp = Array(n + 1).fill(0)
  const take = Array(n).fill(1)
  for (let i = n - 1; i >= 0; i--) {
    let best = NEG
    let sum = 0
    for (let k = 1; k <= 3 && i + k <= n; k++) {
      sum += values[i + k - 1]
      const diff = sum - dp[i + k]
      if (diff > best) {
        best = diff
        take[i] = k
      }
    }
    dp[i] = best
  }
  const frames: Frame[] = []
  let i = 0
  let aliceTurn = true
  let alice = 0
  let bob = 0
  while (i < n) {
    const k = take[i]
    const sum = values.slice(i, i + k).reduce((total, value) => total + value, 0)
    if (aliceTurn) alice += sum
    else bob += sum
    frames.push(
      F(
        `${aliceTurn ? "Alice" : "Bob"} takes ${k} from the front, sum ${sum}. Difference if we started here was ${dp[i]}.`,
        "Only the suffix remains. The choice is 1, 2, or 3 piles.",
        {
          values: values.slice(i),
          marks: [{ kind: "range", from: 0, to: k - 1, tone: "best" }],
          meters: [
            { label: "Alice", value: String(alice) },
            { label: "Bob", value: String(bob) },
            { label: "diff", value: String(alice - bob) },
          ],
        },
      ),
    )
    i += k
    aliceTurn = !aliceTurn
  }
  const result = dp[0] > 0 ? "Alice" : dp[0] < 0 ? "Bob" : "Tie"
  frames.push(
    F(
      `Final difference ${dp[0]}. ${result === "Tie" ? "The scores match." : result + " is ahead."}`,
      "The sign of the starting difference is the whole answer.",
      {
        values,
        meters: [
          { label: "Alice", value: String(alice) },
          { label: "Bob", value: String(bob) },
        ],
        answer: result,
      },
    ),
  )
  return frames
}

function trace1510(n: number): Frame[] {
  const lose = Array(n + 1).fill(false)
  lose[0] = true
  const frames: Frame[] = []
  for (let i = 1; i <= n; i++) {
    let via = 0
    for (let s = 1; s * s <= i; s++) {
      if (lose[i - s * s]) {
        via = s * s
        break
      }
    }
    lose[i] = via === 0
    frames.push(
      F(
        lose[i]
          ? `${i} is a loss. Every square leaves a winning position.`
          : `${i} takes ${via} and leaves ${i - via}, a loss for the opponent.`,
        "A position is winning when some square lands on a loss.",
        {
          values: Array.from({ length: i + 1 }, (_, index) => index),
          marks: Array.from({ length: i + 1 }, (_, index) => ({
            kind: "index" as const,
            i: index,
            tone: (lose[index] ? "loss" : "win") as "loss" | "win",
          })),
          meters: [{ label: "n", value: String(i) }],
          answer: lose[i] ? "false" : "true",
        },
      ),
    )
  }
  frames[frames.length - 1].answer = lose[n] ? "false" : "true"
  return frames
}

function trace1563(values: number[]): Frame[] {
  const n = values.length
  const prefix = [0]
  for (const value of values) prefix.push(prefix[prefix.length - 1] + value)
  const sum = (l: number, r: number) => prefix[r + 1] - prefix[l]
  const dp = Array.from({ length: n }, () => Array(n).fill(0))
  const frames: Frame[] = []
  for (let len = 2; len <= n; len++) {
    for (let l = 0; l + len - 1 < n; l++) {
      const r = l + len - 1
      let best = 0
      let at = l
      let leftSum = 0
      let rightSum = 0
      for (let k = l; k < r; k++) {
        const left = sum(l, k)
        const right = sum(k + 1, r)
        let got = 0
        if (left < right) got = left + dp[l][k]
        else if (right < left) got = right + dp[k + 1][r]
        else got = left + Math.max(dp[l][k], dp[k + 1][r])
        if (got >= best) {
          best = got
          at = k
          leftSum = left
          rightSum = right
        }
      }
      dp[l][r] = best
      frames.push(
        F(
          `Split after index ${at}. Left ${leftSum}, right ${rightSum}. Keep the lighter side. dp = ${best}.`,
          "Bob throws away the heavier half. Alice banks the lighter sum, then the game continues there.",
          {
            values,
            marks: [
              { kind: "range", from: l, to: r, tone: "active" },
              { kind: "range", from: l, to: at, tone: leftSum <= rightSum ? "best" : "muted" },
              { kind: "range", from: at + 1, to: r, tone: rightSum < leftSum ? "best" : "muted" },
            ],
            meters: [
              { label: "left", value: String(leftSum) },
              { label: "right", value: String(rightSum) },
              { label: "dp", value: String(best) },
            ],
            answer: String(dp[0][n - 1]),
          },
        ),
      )
    }
  }
  frames[frames.length - 1].answer = String(dp[0][n - 1])
  return frames
}

function trace1686(aliceValues: number[], bobValues: number[]): Frame[] {
  const order = aliceValues.map((_, i) => i).sort((a, b) => bobValues[b] + aliceValues[b] - (bobValues[a] + aliceValues[a]))
  const frames: Frame[] = [
    F(
      "Sort by alice[i] + bob[i]. Taking a stone banks yours and denies theirs.",
      "The optimal order is that sum, descending. Then the players alternate.",
      {
        values: aliceValues,
        secondary: { label: "Bob", values: bobValues.map(String) },
        labels: aliceValues.map((value, i) => String(value + bobValues[i])),
      },
    ),
  ]
  let alice = 0
  let bob = 0
  order.forEach((index, turn) => {
    const aliceTurn = turn % 2 === 0
    if (aliceTurn) alice += aliceValues[index]
    else bob += bobValues[index]
    frames.push(
      F(
        `${aliceTurn ? "Alice" : "Bob"} takes stone ${index}, value ${aliceTurn ? aliceValues[index] : bobValues[index]}. Key was ${aliceValues[index] + bobValues[index]}.`,
        "Alice adds aliceValues. Bob adds bobValues. The sort key is the sum of both.",
        {
          values: order.map((i) => aliceValues[i]),
          secondary: { label: "Bob", values: order.map((i) => String(bobValues[i])) },
          labels: order.map((i) => String(aliceValues[i] + bobValues[i])),
          marks: [{ kind: "index", i: turn, tone: aliceTurn ? "alice" : "bob" }],
          meters: [
            { label: "Alice", value: String(alice) },
            { label: "Bob", value: String(bob) },
          ],
        },
      ),
    )
  })
  const result = alice > bob ? "1" : alice < bob ? "-1" : "0"
  frames[frames.length - 1].answer = result
  return frames
}

function trace1690(values: number[]): Frame[] {
  const n = values.length
  const prefix = [0]
  for (const value of values) prefix.push(prefix[prefix.length - 1] + value)
  const sum = (l: number, r: number) => (l > r ? 0 : prefix[r + 1] - prefix[l])
  const dp = Array.from({ length: n }, () => Array(n).fill(0))
  for (let len = 2; len <= n; len++) {
    for (let l = 0; l + len - 1 < n; l++) {
      const r = l + len - 1
      dp[l][r] = Math.max(sum(l + 1, r) - dp[l + 1][r], sum(l, r - 1) - dp[l][r - 1])
    }
  }
  const frames: Frame[] = []
  let l = 0
  let r = n - 1
  let alice = true
  let diff = 0
  while (l < r) {
    const takeLeft = sum(l + 1, r) - dp[l + 1][r] >= sum(l, r - 1) - dp[l][r - 1]
    const scored = takeLeft ? sum(l + 1, r) : sum(l, r - 1)
    const i = takeLeft ? l : r
    if (alice) diff += scored
    else diff -= scored
    frames.push(
      F(
        `${alice ? "Alice" : "Bob"} takes piles[${i}] = ${values[i]} and scores the remainder ${scored}, not the pile.`,
        "Same ends as Stone I. The score is the sum of what stays on the row.",
        {
          values,
          marks: [
            { kind: "range", from: l, to: r, tone: "active" },
            { kind: "index", i, tone: alice ? "alice" : "bob" },
          ],
          meters: [
            { label: "scored now", value: String(scored) },
            { label: "difference", value: String(diff) },
          ],
          answer: String(diff),
        },
      ),
    )
    if (takeLeft) l += 1
    else r -= 1
    alice = !alice
  }
  frames[frames.length - 1].answer = String(dp[0][n - 1])
  return frames
}

function trace1872(stones: number[]): Frame[] {
  const n = stones.length
  const prefix: number[] = []
  let running = 0
  for (const value of stones) {
    running += value
    prefix.push(running)
  }
  const dp = Array(n).fill(0)
  let mx = prefix[n - 1]
  const frames: Frame[] = [
    F(`prefix = [${prefix.join(", ")}]. A move merges a prefix and banks that sum.`, "The game is a scan of prefix[j] - dp[j] from the right.", {
      values: prefix,
      labels: prefix.map(String),
      meters: [{ label: "view", value: "prefix" }],
    }),
  ]
  for (let i = n - 2; i >= 0; i--) {
    dp[i] = mx
    const candidate = prefix[i] - dp[i]
    if (i >= 1 && candidate > mx) mx = candidate
    frames.push(
      F(
        `dp[${i}] = ${dp[i]}. candidate prefix[${i}] - dp[${i}] = ${candidate}.`,
        "From the right, mx is the best prefix[j] - dp[j] still available.",
        {
          values: prefix,
          marks: [{ kind: "index", i, tone: "cursor" }],
          meters: [
            { label: "mx", value: String(i === 0 ? dp[0] : mx) },
            { label: `dp[${i}]`, value: String(dp[i]) },
          ],
          answer: String(i === 0 ? dp[0] : dp[i]),
        },
      ),
    )
    if (i >= 1) mx = Math.max(mx, candidate)
  }
  const fresh = Array(n).fill(0)
  let best = prefix[n - 1]
  let chosen = n - 1
  for (let i = n - 2; i >= 1; i--) {
    fresh[i] = best
    const candidate = prefix[i] - fresh[i]
    if (candidate >= best) {
      best = candidate
      chosen = i
    }
  }
  fresh[0] = best
  frames.push(
    F(
      `Alice merges through index ${chosen}. prefix[${chosen}] = ${prefix[chosen]}, opponent then faces dp[${chosen}] = ${fresh[chosen]}. Difference ${fresh[0]}.`,
      "The first optimal merge is the j that maximizes prefix[j] - dp[j].",
      {
        values: stones,
        marks: [{ kind: "range", from: 0, to: chosen, tone: "best" }],
        meters: [
          { label: "merge", value: String(prefix[chosen]) },
          { label: "difference", value: String(fresh[0]) },
        ],
        answer: String(fresh[0]),
      },
    ),
  )
  frames[frames.length - 1].answer = String(fresh[0])
  return frames
}

type NineNode = { win: boolean; take: number }

function formulaIX(stones: number[]): boolean {
  const count = [0, 0, 0]
  for (const stone of stones) count[stone % 3] += 1
  if (count[0] % 2 === 0) return count[1] > 0 && count[2] > 0
  return Math.abs(count[1] - count[2]) > 2
}

function trace2029(stones: number[]): Frame[] {
  const n = stones.length
  const memo = new Map<number, NineNode>()
  const key = (mask: number, sum: number) => mask * 3 + (sum % 3)
  function play(mask: number, sum: number): NineNode {
    const id = key(mask, sum)
    const hit = memo.get(id)
    if (hit) return hit
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) continue
      const next = sum + stones[i]
      if (next % 3 === 0) continue
      if (!play(mask | (1 << i), next).win) {
        const node = { win: true, take: i }
        memo.set(id, node)
        return node
      }
    }
    const node = { win: false, take: -1 }
    memo.set(id, node)
    return node
  }
  const wins = play(0, 0).win
  if (wins !== formulaIX(stones)) throw new Error("The mod-3 case does not match the game tree.")
  const frames: Frame[] = []
  const count = [0, 0, 0]
  for (const stone of stones) count[stone % 3] += 1
  frames.push(
    F(
      `Counts mod 3: 0 → ${count[0]}, 1 → ${count[1]}, 2 → ${count[2]}.`,
      "Only the remainder matters. A move that makes the removed sum divisible by 3 loses.",
      {
        values: stones,
        labels: stones.map((stone) => String(stone % 3)),
        meters: [
          { label: "mod 0", value: String(count[0]) },
          { label: "mod 1", value: String(count[1]) },
          { label: "mod 2", value: String(count[2]) },
        ],
      },
    ),
  )
  let mask = 0
  let sum = 0
  let alice = true
  for (let guard = 0; guard <= n; guard++) {
    const node = play(mask, sum)
    let take = node.take
    if (take === -1) {
      let legal = -1
      let fatal = -1
      for (let i = 0; i < n; i++) {
        if (mask & (1 << i)) continue
        if ((sum + stones[i]) % 3 === 0) fatal = i
        else legal = i
      }
      if (legal !== -1) take = legal
      else {
        frames.push(
          F(
            fatal === -1
              ? `${alice ? "Alice" : "Bob"} has no stone left.`
              : `${alice ? "Alice" : "Bob"} would take ${stones[fatal]}, and the sum becomes divisible by 3.`,
            count[0] % 2 === 0
              ? "Even number of 0s: Alice wins when both a 1 and a 2 exist."
              : "Odd number of 0s: Alice wins when |count(1) - count(2)| > 2.",
            {
              values: stones,
              labels: stones.map((stone) => String(stone % 3)),
              marks: fatal === -1 ? [] : [{ kind: "index", i: fatal, tone: "lock" }],
              answer: wins ? "true" : "false",
            },
          ),
        )
        break
      }
    }
    sum += stones[take]
    mask |= 1 << take
    frames.push(
      F(
        `${alice ? "Alice" : "Bob"} removes stones[${take}] = ${stones[take]}. Removed sum is ${sum}.`,
        "The running sum must stay off a multiple of 3.",
        {
          values: stones,
          labels: stones.map((stone) => String(stone % 3)),
          marks: stones.map((_, i) => ({
            kind: "index" as const,
            i,
            tone: (i === take ? "take" : mask & (1 << i) ? "lock" : "cursor") as "take" | "lock" | "cursor",
          })),
          meters: [{ label: "sum", value: String(sum) }],
        },
      ),
    )
    alice = !alice
  }
  frames[frames.length - 1].answer = wins ? "true" : "false"
  return frames
}

export const stoneProblems: Draft[] = [
  {
    id: "877",
    leetcode: 877,
    title: "Stone Game",
    family: "stones",
    complexity: "O(1)",
    pattern: "Even indexes against odd indexes. Alice takes the larger parity.",
    board: "stone",
    hint: "5,3,4,5",
    presets: [{ name: "LeetCode", raw: "5,3,4,5", answer: "true" }],
    parse: (raw) => pilesOf(raw),
    trace: (input) => trace877(input as number[]),
  },
  {
    id: "1140",
    leetcode: 1140,
    title: "Stone Game II",
    family: "stones",
    complexity: "O(n^3)",
    pattern: "State is (index, M). Take the first X piles, 1 <= X <= 2M, then M grows.",
    board: "stone",
    hint: "2,7,9,4,4",
    presets: [{ name: "LeetCode", raw: "2,7,9,4,4", answer: "10" }],
    parse: (raw) => pilesOf(raw),
    trace: (input) => trace1140(input as number[]),
  },
  {
    id: "1406",
    leetcode: 1406,
    title: "Stone Game III",
    family: "stones",
    complexity: "O(n)",
    pattern: "Suffix only. Take 1, 2, or 3. The sign of the difference names the winner.",
    board: "stone",
    hint: "1,2,3,7",
    presets: [
      { name: "Bob", raw: "1,2,3,7", answer: "Bob" },
      { name: "Alice", raw: "1,2,3,-9", answer: "Alice" },
      { name: "Tie", raw: "1,2,3,6", answer: "Tie" },
    ],
    parse: (raw) => pilesOf(raw),
    trace: (input) => trace1406(input as number[]),
  },
  {
    id: "1510",
    leetcode: 1510,
    title: "Stone Game IV",
    family: "stones",
    complexity: "O(n√n)",
    pattern: "Subtract a square. A position wins when it can leave a loss.",
    board: "numberline",
    hint: "n=4",
    presets: [
      { name: "Win", raw: "n=4", answer: "true" },
      { name: "Loss", raw: "n=2", answer: "false" },
    ],
    parse: (raw) => {
      const fields = read(raw)
      const n = Number(fields.n ?? fields.values ?? "")
      if (!Number.isInteger(n) || n < 1 || n > 16) throw new Error("Use n from 1 to 16.")
      return n
    },
    trace: (input) => trace1510(input as number),
  },
  {
    id: "1563",
    leetcode: 1563,
    title: "Stone Game V",
    family: "stones",
    complexity: "O(n^3)",
    pattern: "Split the interval, bank the lighter sum, throw the heavy side away.",
    board: "stone",
    hint: "6,2,3,4,5,5",
    presets: [{ name: "LeetCode", raw: "6,2,3,4,5,5", answer: "18" }],
    parse: (raw) => pilesOf(raw, 6),
    trace: (input) => trace1563(input as number[]),
  },
  {
    id: "1686",
    leetcode: 1686,
    title: "Stone Game VI",
    family: "stones",
    complexity: "O(n log n)",
    pattern: "Sort by alice[i] + bob[i]. That stone is worth yours plus the denial.",
    board: "stone",
    hint: "alice=1,3; bob=2,1",
    presets: [
      { name: "Alice", raw: "alice=1,3; bob=2,1", answer: "1" },
      { name: "Tie", raw: "alice=1,2; bob=3,1", answer: "0" },
      { name: "Bob", raw: "alice=2,4,3; bob=1,6,7", answer: "-1" },
    ],
    parse: (raw) => {
      const fields = read(raw)
      const alice = limited(ints(fields.alice, "alice"), "alice values", 8)
      const bob = limited(ints(fields.bob, "bob"), "bob values", 8)
      if (alice.length !== bob.length) throw new Error("alice and bob need the same length.")
      return { alice, bob }
    },
    trace: (input) => {
      const { alice, bob } = input as { alice: number[]; bob: number[] }
      return trace1686(alice, bob)
    },
  },
  {
    id: "1690",
    leetcode: 1690,
    title: "Stone Game VII",
    family: "stones",
    complexity: "O(n^2)",
    pattern: "Same ends as Stone I. You score the stones you leave behind.",
    board: "stone",
    hint: "5,3,1,4,2",
    presets: [
      { name: "LeetCode", raw: "5,3,1,4,2", answer: "6" },
      { name: "Compare", raw: "5,3,4,5", answer: "9" },
    ],
    parse: (raw) => pilesOf(raw),
    trace: (input) => trace1690(input as number[]),
  },
  {
    id: "1872",
    leetcode: 1872,
    title: "Stone Game VIII",
    family: "stones",
    complexity: "O(n)",
    pattern: "Merging a prefix banks the prefix sum. It collapses to a right-to-left scan.",
    board: "stone",
    hint: "-1,2,-3,4,-5",
    presets: [{ name: "LeetCode", raw: "-1,2,-3,4,-5", answer: "5" }],
    parse: (raw) => pilesOf(raw),
    trace: (input) => trace1872(input as number[]),
  },
  {
    id: "2029",
    leetcode: 2029,
    title: "Stone Game IX",
    family: "stones",
    complexity: "O(n)",
    pattern: "Color by value mod 3. The counts, and the parity of the zeros, decide the winner.",
    board: "stone",
    hint: "2,1",
    presets: [
      { name: "Alice", raw: "2,1", answer: "true" },
      { name: "Bob", raw: "2,1,3", answer: "false" },
    ],
    parse: (raw) => pilesOf(raw),
    trace: (input) => trace2029(input as number[]),
  },
]

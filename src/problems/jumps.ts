// Same shape as src/problems/best-time-ii.ts. Read that file first.
import type { Frame } from "../engine/types"
import { F } from "./frame"
import { ints, limited, read } from "./parse"
import type { Draft } from "./types"

function valuesOf(raw: string, max = 10): number[] {
  const fields = read(raw)
  return limited(ints(fields.nums ?? fields.values, "nums"), "values", max)
}

function trace55(nums: number[]): Frame[] {
  let farthest = 0
  const frames: Frame[] = []
  for (let i = 0; i < nums.length; i++) {
    if (i > farthest) {
      frames.push(
        F(`Index ${i} is past farthest = ${farthest}. The end is unreachable.`, "If i is outside the band, no earlier jump lands here.", {
          values: nums,
          marks: [
            { kind: "index", i, tone: "lock" },
            { kind: "band", from: 0, to: farthest },
          ],
          meters: [{ label: "farthest", value: String(farthest) }],
          answer: "false",
        }),
      )
      return frames
    }
    farthest = Math.max(farthest, i + nums[i])
    const done = farthest >= nums.length - 1
    frames.push(
      F(
        `From ${i}, farthest = max(farthest, ${i} + ${nums[i]}) = ${Math.min(farthest, nums.length - 1)}.`,
        "The band is every index reachable in some number of jumps.",
        {
          values: nums,
          marks: [
            { kind: "index", i, tone: "cursor" },
            { kind: "band", from: 0, to: Math.min(farthest, nums.length - 1) },
            { kind: "arc", from: i, to: Math.min(i + nums[i], nums.length - 1), tone: "legal" },
          ],
          meters: [{ label: "farthest", value: String(farthest) }],
          answer: done ? "true" : "false",
        },
      ),
    )
    if (done && i >= nums.length - 1) break
  }
  const last = frames[frames.length - 1]
  if (last) last.answer = farthest >= nums.length - 1 ? "true" : "false"
  return frames
}

function trace45(nums: number[]): Frame[] {
  let jumps = 0
  let curEnd = 0
  let farthest = 0
  const frames: Frame[] = [
    F("The first window is index 0. One window is one jump.", "Jump II counts the windows that Jump I only checks for coverage.", {
      values: nums,
      marks: [{ kind: "range", from: 0, to: 0, tone: "active" }],
      meters: [{ label: "jumps", value: "0" }],
      answer: nums.length <= 1 ? "0" : undefined,
    }),
  ]
  if (nums.length <= 1) {
    frames[0].answer = "0"
    return frames
  }
  for (let i = 0; i < nums.length - 1; i++) {
    farthest = Math.max(farthest, i + nums[i])
    const edge = i === curEnd
    if (edge) {
      jumps += 1
      curEnd = farthest
    }
    frames.push(
      F(
        edge
          ? `End of the window. Jump ${jumps} reaches ${curEnd}.`
          : `Inside the window, farthest grows to ${farthest}.`,
        "When i hits the end of this jump, open the next window at farthest.",
        {
          values: nums,
          marks: [
            { kind: "index", i, tone: "cursor" },
            { kind: "range", from: Math.max(0, i - jumps), to: Math.min(curEnd, nums.length - 1), tone: "active" },
            { kind: "band", from: 0, to: Math.min(farthest, nums.length - 1) },
          ],
          meters: [
            { label: "jumps", value: String(jumps) },
            { label: "window end", value: String(curEnd) },
          ],
          answer: String(jumps),
        },
      ),
    )
    if (curEnd >= nums.length - 1) break
  }
  frames[frames.length - 1].answer = String(jumps)
  return frames
}

function trace1306(arr: number[], start: number): Frame[] {
  const n = arr.length
  const seen = new Set<number>([start])
  const queue = [start]
  const frames: Frame[] = []
  let steps = 0
  while (queue.length) {
    const layer = queue.splice(0, queue.length)
    const next: number[] = []
    for (const i of layer) {
      if (arr[i] === 0) {
        frames.push(
          F(`Index ${i} is 0. Reached in ${steps} jumps.`, "Each step jumps exactly arr[i] to the left or the right.", {
            values: arr,
            marks: [
              { kind: "index", i, tone: "best" },
              ...[...seen].map((s) => ({ kind: "index" as const, i: s, tone: "cursor" as const })),
            ],
            meters: [{ label: "steps", value: String(steps) }],
            answer: "true",
          }),
        )
        return frames
      }
      for (const j of [i + arr[i], i - arr[i]]) {
        if (j >= 0 && j < n && !seen.has(j)) {
          seen.add(j)
          next.push(j)
        }
      }
    }
    frames.push(
      F(
        `Layer ${steps}: visit ${layer.join(", ")}. Next is ${next.join(", ") || "empty"}.`,
        "BFS. The first time a 0 is dequeued, that distance is minimal.",
        {
          values: arr,
          marks: [
            ...layer.map((i) => ({ kind: "index" as const, i, tone: "cursor" as const })),
            ...next.map((j) => ({ kind: "index" as const, i: j, tone: "take" as const })),
            ...layer.flatMap((i) =>
              [i + arr[i], i - arr[i]]
                .filter((j) => j >= 0 && j < n)
                .map((j) => ({ kind: "arc" as const, from: i, to: j, tone: "legal" as const })),
            ),
          ],
          meters: [{ label: "steps", value: String(steps) }],
          answer: "false",
        },
      ),
    )
    queue.push(...next)
    steps += 1
    if (steps > n) break
  }
  frames.push(
    F("The BFS ended without a 0.", "Every reachable index was expanded exactly once.", {
      values: arr,
      marks: [...seen].map((i) => ({ kind: "index" as const, i, tone: "lock" as const })),
      answer: "false",
    }),
  )
  return frames
}

function trace1345(arr: number[]): Frame[] {
  const n = arr.length
  const groups = new Map<number, number[]>()
  arr.forEach((value, i) => {
    const list = groups.get(value) ?? []
    list.push(i)
    groups.set(value, list)
  })
  const seen = new Set<number>([0])
  let queue = [0]
  let steps = 0
  const frames: Frame[] = []
  while (queue.length) {
    const layer = queue
    queue = []
    for (const i of layer) {
      if (i === n - 1) {
        frames.push(
          F(`Index ${n - 1} is reached in ${steps} jumps.`, "Edges are i ± 1, plus every index that still shares this value.", {
            values: arr,
            marks: [{ kind: "index", i, tone: "best" }],
            meters: [{ label: "jumps", value: String(steps) }],
            answer: String(steps),
          }),
        )
        return frames
      }
    }
    const arcs: Frame["marks"] = []
    for (const i of layer) {
      const next = new Set<number>()
      if (i + 1 < n) next.add(i + 1)
      if (i - 1 >= 0) next.add(i - 1)
      for (const j of groups.get(arr[i]) ?? []) next.add(j)
      groups.set(arr[i], [])
      for (const j of next) {
        const tone = arr[j] === arr[i] && Math.abs(j - i) > 1 ? "same" : "legal"
        arcs.push({ kind: "arc", from: i, to: j, tone })
        if (!seen.has(j)) {
          seen.add(j)
          queue.push(j)
        }
      }
    }
    frames.push(
      F(
        `Layer ${steps} expands ${layer.join(", ")}. Same values are one teleport group, then cleared.`,
        "Clearing the value group keeps the BFS linear.",
        {
          values: arr,
          marks: [...layer.map((i) => ({ kind: "index" as const, i, tone: "cursor" as const })), ...arcs],
          meters: [{ label: "jumps", value: String(steps) }],
          answer: String(steps),
        },
      ),
    )
    steps += 1
    if (steps > n) break
  }
  return frames
}

function trace1340(nums: number[], d: number): Frame[] {
  const n = nums.length
  const memo = Array(n).fill(0)
  const via = Array(n).fill(-1)
  function dfs(i: number): number {
    if (memo[i]) return memo[i]
    let best = 1
    for (const dir of [-1, 1]) {
      for (let x = 1; x <= d; x++) {
        const j = i + dir * x
        if (j < 0 || j >= n || nums[j] >= nums[i]) break
        const got = 1 + dfs(j)
        if (got > best) {
          best = got
          via[i] = j
        }
      }
    }
    memo[i] = best
    return best
  }
  let answer = 1
  const frames: Frame[] = []
  for (let i = 0; i < n; i++) {
    answer = Math.max(answer, dfs(i))
    frames.push(
      F(
        via[i] === -1
          ? `Index ${i} (height ${nums[i]}) has nowhere lower within d = ${d}. Length 1.`
          : `Index ${i} jumps to ${via[i]}. Longest path from here is ${memo[i]}.`,
        "A jump lands on a strictly lower bar, and it cannot cross a bar of equal or greater height.",
        {
          values: nums,
          skyline: true,
          labels: memo.map((value, index) => (index <= i ? String(value) : "")),
          marks: [
            { kind: "index", i, tone: "cursor" },
            ...(via[i] !== -1 ? [{ kind: "arc" as const, from: i, to: via[i], tone: "chosen" as const }] : []),
          ],
          meters: [{ label: "best", value: String(answer) }],
          answer: String(answer),
        },
      ),
    )
  }
  return frames
}

function trace1696(nums: number[], k: number): Frame[] {
  const n = nums.length
  const dp = Array(n).fill(0)
  dp[0] = nums[0]
  const dq = [0]
  const frames: Frame[] = [
    F(`dp[0] = ${nums[0]}. The deque holds index 0.`, "The front of the deque is the best score in the last k indexes.", {
      values: nums,
      deque: [0],
      marks: [{ kind: "index", i: 0, tone: "cursor" }],
      meters: [{ label: "dp[0]", value: String(dp[0]) }],
      answer: String(dp[0]),
    }),
  ]
  for (let i = 1; i < n; i++) {
    const notes: string[] = []
    while (dq.length && dq[0] < i - k) {
      notes.push(`pop front ${dq[0]}, outside the window`)
      dq.shift()
    }
    const from = dq[0]
    dp[i] = nums[i] + dp[from]
    notes.push(`dp[${i}] = ${nums[i]} + dp[${from}] = ${dp[i]}`)
    while (dq.length && dp[dq[dq.length - 1]] <= dp[i]) {
      notes.push(`pop back ${dq[dq.length - 1]}, dominated`)
      dq.pop()
    }
    dq.push(i)
    frames.push(
      F(notes.join(". ") + ".", "Indexes leave from the front. Worse scores leave from the back.", {
        values: nums,
        deque: [...dq],
        marks: [
          { kind: "index", i, tone: "cursor" },
          { kind: "band", from: Math.max(0, i - k), to: i },
          { kind: "arc", from, to: i, tone: "chosen" },
        ],
        meters: [{ label: `dp[${i}]`, value: String(dp[i]) }],
        answer: String(dp[i]),
      }),
    )
  }
  return frames
}

function trace1871(s: string, minJump: number, maxJump: number): Frame[] {
  const n = s.length
  const bits = s.split("").map(Number)
  const reach = Array(n).fill(false)
  reach[0] = true
  let count = 0
  const frames: Frame[] = []
  if (s[n - 1] !== "0") {
    return [
      F("The last cell is 1, a wall.", "You can only land on 0, inside [i + minJump, i + maxJump].", {
        values: bits,
        marks: [{ kind: "index", i: n - 1, tone: "wall" }],
        answer: "false",
      }),
    ]
  }
  for (let i = 1; i < n; i++) {
    if (i >= minJump) count += reach[i - minJump] ? 1 : 0
    if (i > maxJump) count -= reach[i - maxJump - 1] ? 1 : 0
    reach[i] = count > 0 && s[i] === "0"
    const left = Math.max(0, i - maxJump)
    const right = i - minJump
    frames.push(
      F(
        reach[i]
          ? `Index ${i} is 0 and ${count} source${count === 1 ? "" : "s"} in the window can reach it.`
          : `Index ${i} stays closed. ${s[i] === "1" ? "It is a wall." : "The window has no reachable source."}`,
        "The window of sources slides. A prefix count replaces a fresh scan.",
        {
          values: bits,
          marks: [
            ...bits.map((bit, index) =>
              bit === 1
                ? { kind: "index" as const, i: index, tone: "wall" as const }
                : { kind: "index" as const, i: index, tone: "cursor" as const },
            ).filter((mark) => mark.tone === "wall" || reach[mark.i]),
            { kind: "index", i, tone: reach[i] ? "best" : "lock" },
            ...(right >= left ? [{ kind: "band" as const, from: left, to: Math.min(right, n - 1) }] : []),
          ],
          meters: [{ label: "sources", value: String(count) }],
          answer: reach[n - 1] ? "true" : "false",
        },
      ),
    )
  }
  frames[frames.length - 1].answer = reach[n - 1] ? "true" : "false"
  return frames
}

function trace2297(nums: number[], costs: number[]): Frame[] {
  const n = nums.length
  const dp = Array(n).fill(Number.POSITIVE_INFINITY)
  dp[0] = 0
  const maxStack: number[] = []
  const minStack: number[] = []
  const frames: Frame[] = []
  for (let i = 0; i < n; i++) {
    const arcs: Frame["marks"] = []
    while (maxStack.length && nums[i] >= nums[maxStack[maxStack.length - 1]]) {
      const j = maxStack.pop()!
      dp[i] = Math.min(dp[i], dp[j] + costs[i])
      arcs.push({ kind: "arc", from: j, to: i, tone: "chosen" })
    }
    while (minStack.length && nums[i] < nums[minStack[minStack.length - 1]]) {
      const j = minStack.pop()!
      dp[i] = Math.min(dp[i], dp[j] + costs[i])
      arcs.push({ kind: "arc", from: j, to: i, tone: "legal" })
    }
    maxStack.push(i)
    minStack.push(i)
    frames.push(
      F(
        i === 0
          ? "Start pays nothing. Both stacks hold index 0."
          : `Land on ${i} for cost ${costs[i]}. dp[${i}] = ${dp[i]}.`,
        "maxStack pops the next greater-or-equal. minStack pops the next strictly smaller.",
        {
          values: nums,
          secondary: { label: "cost", values: costs.map(String) },
          stacks: [
            { name: "maxStack", values: [...maxStack] },
            { name: "minStack", values: [...minStack] },
          ],
          marks: [{ kind: "index", i, tone: "cursor" }, ...arcs],
          meters: [{ label: `dp[${i}]`, value: String(dp[i]) }],
          answer: Number.isFinite(dp[n - 1]) ? String(dp[n - 1]) : undefined,
        },
      ),
    )
  }
  frames[frames.length - 1].answer = String(dp[n - 1])
  return frames
}

function trace3660(nums: number[]): Frame[] {
  const n = nums.length
  const preMax = Array(n).fill(nums[0])
  for (let i = 1; i < n; i++) preMax[i] = Math.max(preMax[i - 1], nums[i])
  const ans = Array(n).fill(0)
  let sufMin = Number.POSITIVE_INFINITY
  const frames: Frame[] = []
  for (let i = n - 1; i >= 0; i--) {
    if (i + 1 < n && preMax[i] > sufMin) ans[i] = ans[i + 1]
    else ans[i] = preMax[i]
    const merged = i + 1 < n && preMax[i] > sufMin
    frames.push(
      F(
        merged
          ? `preMax[${i}] = ${preMax[i]} beats sufMin ${sufMin}. Copy ans[${i + 1}] = ${ans[i]}.`
          : `No bridge to the right. ans[${i}] = preMax[${i}] = ${ans[i]}.`,
        "Forward jumps land lower. Backward jumps land higher. A prefix max above the suffix min joins the component.",
        {
          values: nums,
          labels: ans.map((value, index) => (index >= i ? String(value) : "")),
          marks: [{ kind: "index", i, tone: merged ? "take" : "cursor" }],
          meters: [
            { label: "preMax", value: String(preMax[i]) },
            { label: "sufMin", value: Number.isFinite(sufMin) ? String(sufMin) : "inf" },
          ],
          answer: ans.join(","),
        },
      ),
    )
    sufMin = Math.min(sufMin, nums[i])
  }
  frames[frames.length - 1].answer = ans.join(",")
  return frames
}

export const jumpProblems: Draft[] = [
  {
    id: "55",
    leetcode: 55,
    title: "Jump Game",
    family: "jumps",
    complexity: "O(n)",
    pattern: "One farthest band. If the index walks past it, stop.",
    board: "jump",
    hint: "2,3,1,1,4",
    presets: [
      { name: "Reachable", raw: "2,3,1,1,4", answer: "true" },
      { name: "Stuck", raw: "3,2,1,0,4", answer: "false" },
    ],
    parse: (raw) => valuesOf(raw),
    trace: (input) => trace55(input as number[]),
  },
  {
    id: "45",
    leetcode: 45,
    title: "Jump Game II",
    family: "jumps",
    complexity: "O(n)",
    pattern: "Same band as I. Each window is one jump.",
    board: "jump",
    hint: "2,3,1,1,4",
    presets: [{ name: "LeetCode", raw: "2,3,1,1,4", answer: "2" }],
    parse: (raw) => valuesOf(raw),
    trace: (input) => trace45(input as number[]),
  },
  {
    id: "1306",
    leetcode: 1306,
    title: "Jump Game III",
    family: "jumps",
    complexity: "O(n)",
    pattern: "BFS. The jump length is exactly arr[i], either direction, until a 0.",
    board: "jump",
    hint: "start=5; 4,2,3,0,3,1,2",
    presets: [{ name: "LeetCode", raw: "start=5; 4,2,3,0,3,1,2", answer: "true" }],
    parse: (raw) => {
      const fields = read(raw)
      const arr = valuesOf(raw)
      const start = Number(fields.start ?? "0")
      if (!Number.isInteger(start) || start < 0 || start >= arr.length) throw new Error("start must be a valid index.")
      return { arr, start }
    },
    trace: (input) => {
      const { arr, start } = input as { arr: number[]; start: number }
      return trace1306(arr, start)
    },
  },
  {
    id: "1345",
    leetcode: 1345,
    title: "Jump Game IV",
    family: "jumps",
    complexity: "O(n)",
    pattern: "BFS again. i ± 1, or any index with the same value, used once.",
    board: "jump",
    hint: "100,-23,-23,404,100,23,23,23,3,404",
    presets: [{ name: "LeetCode", raw: "100,-23,-23,404,100,23,23,23,3,404", answer: "3" }],
    parse: (raw) => valuesOf(raw),
    trace: (input) => trace1345(input as number[]),
  },
  {
    id: "1340",
    leetcode: 1340,
    title: "Jump Game V",
    family: "jumps",
    complexity: "O(nd)",
    pattern: "Jump to a strictly lower bar within d. You cannot cross a taller or equal bar.",
    board: "jump",
    hint: "d=2; 7,6,5,4,3",
    presets: [{ name: "Decreasing", raw: "d=2; 7,6,5,4,3", answer: "5" }],
    parse: (raw) => {
      const fields = read(raw)
      const d = Number(fields.d ?? "1")
      if (!Number.isInteger(d) || d < 1 || d > 5) throw new Error("Use d from 1 to 5.")
      return { nums: valuesOf(raw), d }
    },
    trace: (input) => {
      const { nums, d } = input as { nums: number[]; d: number }
      return trace1340(nums, d)
    },
  },
  {
    id: "1696",
    leetcode: 1696,
    title: "Jump Game VI",
    family: "jumps",
    complexity: "O(n)",
    pattern: "dp[i] = nums[i] + max in the last k. The deque keeps that max.",
    board: "jump",
    hint: "k=2; 1,-1,-2,4,-7,3",
    presets: [{ name: "LeetCode", raw: "k=2; 1,-1,-2,4,-7,3", answer: "7" }],
    parse: (raw) => {
      const fields = read(raw)
      const k = Number(fields.k ?? "1")
      const nums = valuesOf(raw)
      if (!Number.isInteger(k) || k < 1 || k >= nums.length) throw new Error("k must be at least 1 and shorter than the array.")
      return { nums, k }
    },
    trace: (input) => {
      const { nums, k } = input as { nums: number[]; k: number }
      return trace1696(nums, k)
    },
  },
  {
    id: "1871",
    leetcode: 1871,
    title: "Jump Game VII",
    family: "jumps",
    complexity: "O(n)",
    pattern: "Land on 0 inside [i + minJump, i + maxJump]. A sliding count of sources.",
    board: "jump",
    hint: "min=2; max=3; s=011010",
    presets: [
      { name: "Reachable", raw: "min=2; max=3; s=011010", answer: "true" },
      { name: "Blocked", raw: "min=2; max=3; s=01101110", answer: "false" },
    ],
    parse: (raw) => {
      const fields = read(raw)
      const minJump = Number(fields.min ?? "1")
      const maxJump = Number(fields.max ?? "1")
      const s = fields.s ?? ""
      if (!/^[01]+$/.test(s)) throw new Error("s is a binary string, for example 011010.")
      if (s.length > 12) throw new Error("Use a string of at most 12 bits.")
      if (!Number.isInteger(minJump) || !Number.isInteger(maxJump) || minJump < 1 || maxJump < minJump) {
        throw new Error("Need 1 <= min <= max.")
      }
      return { s, minJump, maxJump }
    },
    trace: (input) => {
      const { s, minJump, maxJump } = input as { s: string; minJump: number; maxJump: number }
      return trace1871(s, minJump, maxJump)
    },
  },
  {
    id: "2297",
    leetcode: 2297,
    title: "Jump Game VIII",
    family: "jumps",
    complexity: "O(n)",
    pattern: "Two monotonic stacks build the only edges. Then dp takes the cheaper one.",
    board: "jump",
    hint: "nums=3,2,4,4,1; costs=3,7,6,4,2",
    presets: [{ name: "LeetCode", raw: "nums=3,2,4,4,1; costs=3,7,6,4,2", answer: "8" }],
    parse: (raw) => {
      const fields = read(raw)
      const nums = limited(ints(fields.nums ?? fields.values, "nums"), "nums", 10)
      const costs = limited(ints(fields.costs, "costs"), "costs", 10)
      if (nums.length !== costs.length) throw new Error("nums and costs need the same length.")
      return { nums, costs }
    },
    trace: (input) => {
      const { nums, costs } = input as { nums: number[]; costs: number[] }
      return trace2297(nums, costs)
    },
  },
  {
    id: "3660",
    leetcode: 3660,
    title: "Jump Game IX",
    family: "jumps",
    complexity: "O(n)",
    pattern: "Forward only to a smaller value, backward only to a larger one. Prefix max vs suffix min merges a component.",
    board: "jump",
    hint: "2,1,3",
    presets: [
      { name: "Split", raw: "2,1,3", answer: "2,2,3" },
      { name: "One component", raw: "2,3,1", answer: "3,3,3" },
    ],
    parse: (raw) => valuesOf(raw),
    trace: (input) => trace3660(input as number[]),
  },
]

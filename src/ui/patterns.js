// The classification: every problem belongs to one of these.
export const PATTERNS = {
  greedy: {
    name: "Greedy scan",
    dot: "bg-emerald-500",
    spot: "One pass is enough. A single best-so-far (cheapest price, farthest reach) decides everything.",
    rule: "Carry one or two variables. Update them on every element.",
  },
  statedp: {
    name: "DP over (i, state)",
    dot: "bg-violet-500",
    spot: "At each element you act or skip, and what you may do depends on a tiny state (holding? trades left?).",
    rule: "dp[i][state] = best of skip / buy / sell. Memo, then table, then only the last row or two (before / after).",
  },
  memo: {
    name: "Memoized recursion",
    dot: "bg-sky-500",
    spot: "The answer at a position needs answers at smaller positions, and the same arguments keep coming back.",
    rule: "rec(args) combines its children. dp[args] caches so each state is computed once.",
  },
  game: {
    name: "Two-player game",
    dot: "bg-rose-500",
    spot: "Two players alternate and both play perfectly. One maximises, the other minimises.",
    rule: "rec(state, turn): Alice takes max(gain + rec(next)), Bob takes min(rec(next)).",
  },
  mono: {
    name: "Monotonic stack / deque",
    dot: "bg-amber-500",
    spot: "You need the next or previous greater element, or the max over a sliding window.",
    rule: "Keep candidates in order. Pop the ones that can never win again.",
  },
  search: {
    name: "Reachability (BFS / DFS)",
    dot: "bg-cyan-500",
    spot: "Can I reach the end, or in how few jumps? Positions are nodes, jumps are edges.",
    rule: "Visited set plus a frontier (queue, deque, stack). A sliding window helps when a jump is a range.",
  },
}

export const cn = (...parts) => parts.filter(Boolean).join(" ")

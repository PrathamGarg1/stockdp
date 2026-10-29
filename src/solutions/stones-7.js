import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let dp = grid([n, n, 2], -1)
  let pre = Array(n).fill(arr[0])
  for (let i = 1; i < n; i++) pre[i] = pre[i - 1] + arr[i]

  // sum of arr[l..r] without the stone at idx
  function val(idx, l, r) {
    return pre[r] - (l > 0 ? pre[l - 1] : 0) - arr[idx]
  }

  function rec(l, r, turn) {
    if (l > r) return 0
    if (dp[l][r][turn] != -1) return dp[l][r][turn]
    let ans
    if (turn == 1) ans = Math.max(val(l, l, r) + rec(l + 1, r, +!turn), val(r, l, r) + rec(l, r - 1, +!turn))
    else ans = Math.min(rec(l + 1, r, +!turn) - val(l, l, r), rec(l, r - 1, +!turn) - val(r, l, r))
    dp[l][r][turn] = ans
    steps.push(structuredClone({ l, r, turn, ans, dp }))
    return ans
  }

  return { answer: rec(0, n - 1, 1), steps }
}

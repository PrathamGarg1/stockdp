import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let dp = grid([n + 1, 3, 2], -1)

  function rec(i, remk, state) {
    if (i == n) return 0
    if (dp[i][remk][state] != -1) return dp[i][remk][state]
    let ans = rec(i + 1, remk, state)
    if (state == 0 && remk) ans = Math.max(ans, -arr[i] + rec(i + 1, remk - 1, 1))
    if (state == 1) ans = Math.max(ans, arr[i] + rec(i + 1, remk, 0))
    dp[i][remk][state] = ans
    steps.push(structuredClone({ i, remk, state, ans, dp }))
    return ans
  }

  // atmost two transactions can be done
  return { answer: rec(0, 2, 0), steps }
}

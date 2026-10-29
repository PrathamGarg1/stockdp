import { grid } from "./grid.js"

export default function solve(n) {
  const steps = []
  let dp = grid([n + 1], -1)

  // can the player to move win with n stones left?
  function rec(n) {
    if (n == 0) return false
    if (dp[n] != -1) return dp[n]
    let ans = false
    for (let f = 1; f * f <= n; f++) {
      if (!rec(n - f * f)) ans = true
    }
    dp[n] = ans
    steps.push(structuredClone({ n, ans, dp }))
    return ans
  }

  return { answer: rec(n), steps }
}

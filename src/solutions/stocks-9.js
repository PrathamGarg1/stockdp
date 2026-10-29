import { grid } from "./grid.js"

export default function solve(prices, cooldown, costs) {
  const steps = []
  let n = prices.length
  let dp = grid([n + 1], -1)

  function rec(i) {
    if (i >= n) return 0
    if (dp[i] != -1) return dp[i]
    let ans = rec(i + 1)
    for (let j = i + 1; j < n; j++) {
      ans = Math.max(ans, prices[j] - prices[i] - costs[j - i] + rec(j + cooldown + 1))
    }
    dp[i] = ans
    steps.push(structuredClone({ i, ans, dp }))
    return ans
  }

  return { answer: rec(0), steps }
}

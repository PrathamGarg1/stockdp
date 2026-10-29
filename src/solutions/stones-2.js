import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let dp = grid([n + 1, n + 1, 2], -1)

  function rec(i, m, turn) {
    if (i == n) return 0
    if (dp[i][m][turn] != -1) return dp[i][m][turn]
    let ans = turn ? -1e9 : 1e9
    let profit = 0
    for (let j = i; j < i + 2 * m && j < n; j++) {
      // take all these stones
      profit += arr[j]
      let x = j - i + 1
      if (turn) ans = Math.max(ans, profit + rec(j + 1, Math.max(m, x), +!turn))
      else ans = Math.min(ans, rec(j + 1, Math.max(m, x), +!turn))
    }
    dp[i][m][turn] = ans
    steps.push(structuredClone({ i, m, turn, ans, dp }))
    return ans
  }

  return { answer: rec(0, 1, 1), steps }
}

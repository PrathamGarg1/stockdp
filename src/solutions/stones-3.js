import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let dp = grid([n + 1, 2], -1)

  function rec(i, turn) {
    if (i == n) return 0
    if (dp[i][turn] != -1) return dp[i][turn]
    let profit = 0
    let ans = turn ? -1e9 : 1e9
    for (let j = i; j < i + 3 && j < n; j++) {
      profit += arr[j]
      if (turn) ans = Math.max(ans, profit + rec(j + 1, +!turn))
      else ans = Math.min(ans, rec(j + 1, +!turn))
    }
    dp[i][turn] = ans
    steps.push(structuredClone({ i, turn, ans, dp }))
    return ans
  }

  let tot = 0
  for (let x of arr) tot += x
  let val = rec(0, 1)
  let answer = "Bob"
  if (val > tot - val) answer = "Alice"
  if (val == tot - val) answer = "Tie"
  return { answer, steps }
}

import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let dp = grid([n, n], -1)
  let pre = Array(n).fill(arr[0])
  for (let i = 1; i < n; i++) pre[i] = pre[i - 1] + arr[i]

  function rec(i, j) {
    if (i >= j) return 0
    if (dp[i][j] != -1) return dp[i][j]
    let tot = pre[j] - (i > 0 ? pre[i - 1] : 0)
    let ans = 0
    for (let k = i; k < j; k++) {
      let part1 = pre[k] - (i > 0 ? pre[i - 1] : 0)
      let part2 = tot - part1
      if (part1 > part2) ans = Math.max(ans, part2 + rec(k + 1, j))
      else if (part1 < part2) ans = Math.max(ans, part1 + rec(i, k))
      else ans = Math.max(ans, part1 + rec(i, k), part2 + rec(k + 1, j))
    }
    dp[i][j] = ans
    steps.push(structuredClone({ i, j, ans, dp }))
    return ans
  }

  return { answer: rec(0, n - 1), steps }
}

import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let pre = Array(n).fill(arr[0])
  for (let i = 1; i < n; i++) pre[i] = pre[i - 1] + arr[i]

  let dp = grid([n + 1, 2])
  dp[n][1] = 0
  dp[n][0] = 0

  let maxdp = Array(n + 1).fill(0)
  maxdp[n] = pre[n - 1]

  let mindp = Array(n + 1).fill(0)
  mindp[n] = -pre[n - 1]

  for (let i = n - 1; i >= 1; i--) {
    for (let turn = 0; turn < 2; turn++) {
      dp[i][turn] = turn ? maxdp[i + 1] : mindp[i + 1]
    }
    maxdp[i] = Math.max(maxdp[i + 1], pre[i - 1] + dp[i][0])
    mindp[i] = Math.min(mindp[i + 1], -pre[i - 1] + dp[i][1])
    steps.push(structuredClone({ i, dp, maxdp, mindp }))
  }

  return { answer: dp[1][1], steps }
}

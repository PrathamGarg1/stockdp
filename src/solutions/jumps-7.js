export default function solve(s, minj, maxj) {
  const steps = []
  let n = s.length
  let q = [] // one entry per reachable cell inside the window [i-maxj, i-minj]
  let dp = Array(n).fill(false)
  dp[0] = true
  if (minj == 1) q.push(1)
  for (let i = 1; i < n; i++) {
    dp[i] = s[i] == "0" && q.length > 0
    if (i + 1 - minj >= 0 && dp[i + 1 - minj]) q.push(1)
    if (i - maxj >= 0 && dp[i - maxj]) q.shift()
    steps.push(structuredClone({ i, dp, q }))
  }
  return { answer: dp[n - 1], steps }
}

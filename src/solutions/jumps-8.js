import { grid } from "./grid.js"

export default function solve(arr, cost) {
  const steps = []
  let n = arr.length
  let ngeIdx = Array(n).fill(n)
  let nseIdx = Array(n).fill(n)
  let dp = grid([n + 1], -1)

  let st = []
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && arr[st.at(-1)] < arr[i]) st.pop()
    if (st.length) ngeIdx[i] = st.at(-1)
    st.push(i)
    steps.push(structuredClone({ i, st, ngeIdx }))
  }
  st = []
  for (let i = n - 1; i >= 0; i--) {
    while (st.length && arr[st.at(-1)] >= arr[i]) st.pop()
    if (st.length) nseIdx[i] = st.at(-1)
    st.push(i)
    steps.push(structuredClone({ i, st, nseIdx }))
  }

  function rec(i) {
    if (i == n) return 1e11
    if (i == n - 1) return cost[i]
    if (dp[i] != -1) return dp[i]
    dp[i] = cost[i] + Math.min(rec(ngeIdx[i]), rec(nseIdx[i]))
    steps.push(structuredClone({ i, dp }))
    return dp[i]
  }

  return { answer: rec(0) - cost[0], steps }
}

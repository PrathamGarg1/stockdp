import { grid } from "./grid.js"

export default function solve(arr, d) {
  const steps = []
  let n = arr.length
  let ngeIdx = Array(n).fill(n)
  let pgeIdx = Array(n).fill(-1)

  let st = []
  for (let i = 0; i < n; i++) {
    while (st.length && arr[st.at(-1)] < arr[i]) st.pop()
    if (st.length) pgeIdx[i] = st.at(-1)
    st.push(i)
    steps.push(structuredClone({ i, st, pgeIdx }))
  }
  st = []

  for (let i = n - 1; i >= 0; i--) {
    while (st.length && arr[st.at(-1)] < arr[i]) st.pop()
    if (st.length) ngeIdx[i] = st.at(-1)
    st.push(i)
    steps.push(structuredClone({ i, st, ngeIdx }))
  }

  let dp = grid([n + 1], -1)

  // the longest walk starting at i
  function rec(i) {
    if (i < 0 || i >= n) return 0
    if (dp[i] != -1) return dp[i]
    let lo = Math.max(0, i - d, pgeIdx[i] + 1)
    let hi = Math.min(n - 1, i + d, ngeIdx[i] - 1)
    let ans = 0
    for (let j = lo; j <= hi; j++) {
      if (j != i) ans = Math.max(ans, rec(j))
    }
    dp[i] = 1 + ans
    steps.push(structuredClone({ i, lo, hi, dp }))
    return dp[i]
  }

  let ans = 0
  for (let i = 0; i < n; i++) ans = Math.max(ans, rec(i))
  return { answer: ans, steps }
}

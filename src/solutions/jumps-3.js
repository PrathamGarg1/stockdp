export default function solve(arr, start) {
  const steps = []
  let n = arr.length
  let vis = Array(n).fill(0)
  let ans = false

  function dfs(i) {
    if (i < 0 || i >= n) return
    if (vis[i]) return
    vis[i] = 1
    if (arr[i] == 0) ans = true
    steps.push(structuredClone({ i, vis, ans }))
    if (arr[i] == 0) return
    dfs(i - arr[i])
    dfs(i + arr[i])
  }

  dfs(start)
  return { answer: ans, steps }
}

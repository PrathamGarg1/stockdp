export default function solve(arr, k) {
  const steps = []
  let n = arr.length
  let dp = Array(n).fill(0)
  let dq = [] // dp values of the last k cells, biggest first

  function insert(val) {
    while (dq.length && dq.at(-1) < val) dq.pop()
    dq.push(val)
  }
  function remove(val) {
    if (dq[0] == val) dq.shift()
  }

  dp[0] = arr[0]
  insert(dp[0])
  steps.push(structuredClone({ i: 0, dp, dq }))
  for (let i = 1; i < n; i++) {
    dp[i] = arr[i] + dq[0]
    insert(dp[i])
    if (i - k >= 0) remove(dp[i - k])
    steps.push(structuredClone({ i, dp, dq }))
  }
  return { answer: dp[n - 1], steps }
}

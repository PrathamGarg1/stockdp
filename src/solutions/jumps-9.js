export default function solve(arr) {
  const steps = []
  let n = arr.length
  let pre = Array(n).fill(arr[0])
  let ans = Array(n).fill(-1)
  for (let i = 1; i < n; i++) {
    pre[i] = Math.max(pre[i - 1], arr[i])
    steps.push(structuredClone({ i, pre, ans }))
  }
  let i = n - 1
  while (i >= 0) {
    let j = i
    let val = pre[j]
    ans[j] = val
    let minv = arr[i]
    steps.push(structuredClone({ i, j, val, minv, pre, ans }))
    while (j - 1 >= 0 && pre[j - 1] > minv) {
      ans[j - 1] = val
      minv = Math.min(minv, arr[j - 1])
      j--
      steps.push(structuredClone({ i, j, val, minv, pre, ans }))
    }
    i = j - 1
  }
  return { answer: ans, steps }
}

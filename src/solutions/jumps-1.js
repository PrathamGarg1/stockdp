export default function solve(arr) {
  const steps = []
  let n = arr.length
  let i = 0
  let bandwidth = 0
  while (i < n - 1) {
    bandwidth = Math.max(bandwidth, arr[i])
    steps.push({ i, bandwidth })
    if (!bandwidth) return { answer: false, steps }
    bandwidth--
    i++
  }
  return { answer: true, steps }
}

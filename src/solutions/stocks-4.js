import { grid } from "./grid.js"

export default function solve(k, arr) {
  const steps = []
  let n = arr.length
  let before = grid([k + 1, 2])
  let after = grid([k + 1, 2])

  for (let remk = 0; remk <= k; remk++) {
    for (let state = 0; state < 2; state++) {
      after[remk][state] = 0
    }
  }

  for (let i = n - 1; i >= 0; i--) {
    for (let remk = 0; remk <= k; remk++) {
      for (let state = 0; state < 2; state++) {
        let ans = after[remk][state]
        if (state == 0 && remk) ans = Math.max(ans, -arr[i] + after[remk - 1][1])
        if (state == 1) ans = Math.max(ans, arr[i] + after[remk][0])
        before[remk][state] = ans
      }
    }
    steps.push(structuredClone({ i, before, after }))
    let tmp = after // swap(after, before)
    after = before
    before = tmp
  }

  let ans = 0
  for (let remk = 0; remk <= k; remk++) {
    ans = Math.max(ans, after[remk][0])
  }
  return { answer: ans, steps }
}

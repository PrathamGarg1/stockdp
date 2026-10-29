import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let before = grid([3, 2])
  let after = grid([3, 2])

  for (let remk = 0; remk <= 2; remk++) {
    for (let state = 0; state < 2; state++) {
      after[remk][state] = 0
    }
  }

  for (let i = n - 1; i >= 0; i--) {
    for (let remk = 0; remk <= 2; remk++) {
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

  return { answer: Math.max(after[1][0], after[2][0]), steps }
}

import { grid } from "./grid.js"

export default function solve(arr, fee) {
  const steps = []
  let n = arr.length
  let before = grid([2])
  let after = grid([2])

  for (let state = 0; state < 2; state++) {
    after[state] = 0
  }

  for (let i = n - 1; i >= 0; i--) {
    for (let state = 0; state < 2; state++) {
      let ans = after[state]
      if (state == 0) ans = Math.max(ans, -arr[i] - fee + after[1])
      if (state == 1) ans = Math.max(ans, arr[i] + after[0])
      before[state] = ans
    }
    steps.push(structuredClone({ i, before, after }))
    let tmp = after // swap(after, before)
    after = before
    before = tmp
  }

  return { answer: after[0], steps }
}

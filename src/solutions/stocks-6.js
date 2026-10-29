import { grid } from "./grid.js"

export default function solve(arr) {
  const steps = []
  let n = arr.length
  let before = grid([2])
  let after = grid([2])
  let nextafter = grid([2])

  for (let state = 0; state < 2; state++) {
    nextafter[state] = 0
    after[state] = 0
  }

  for (let i = n - 1; i >= 0; i--) {
    for (let state = 0; state < 2; state++) {
      let ans = after[state]
      if (state == 0) ans = Math.max(ans, -arr[i] + after[1])
      if (state == 1) ans = Math.max(ans, arr[i] + nextafter[0])
      before[state] = ans
    }
    steps.push(structuredClone({ i, before, after, nextafter }))
    let tmp = after // swap(after, nextafter)
    after = nextafter
    nextafter = tmp
    tmp = after // swap(after, before)
    after = before
    before = tmp
  }

  return { answer: after[0], steps }
}

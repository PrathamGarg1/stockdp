export default function solve(a, b) {
  const steps = []
  // a-b karo fir max nikalo
  let n = a.length
  let arr = []
  for (let i = 0; i < n; i++) arr.push([a[i], b[i]])
  arr.sort((x, y) => y[0] + y[1] - (x[0] + x[1]))
  let ca = 0
  let cb = 0
  for (let i = 0; i < n; i++) {
    if (i % 2 == 0) ca += arr[i][0]
    else cb += arr[i][1]
    steps.push(structuredClone({ i, ca, cb, arr }))
  }
  let answer = 0
  if (ca > cb) answer = 1
  if (ca < cb) answer = -1
  return { answer, steps }
}

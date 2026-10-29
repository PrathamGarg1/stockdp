export default function solve(arr) {
  const steps = []
  let mintillnow = 1e9
  let ans = 0
  for (let i = 0; i < arr.length; i++) {
    let x = arr[i]
    if (x > mintillnow) {
      ans += x - mintillnow
      mintillnow = x
    } else {
      mintillnow = x
    }
    steps.push({ i, x, mintillnow, ans })
  }
  return { answer: ans, steps }
}

export default function solve(piles) {
  const steps = []
  // Alice can take all the even-indexed piles or all the odd-indexed ones; one of those sums is bigger.
  let even = 0
  let odd = 0
  for (let i = 0; i < piles.length; i++) {
    if (i % 2 == 0) even += piles[i]
    else odd += piles[i]
    steps.push({ i, even, odd })
  }
  return { answer: true, steps }
}

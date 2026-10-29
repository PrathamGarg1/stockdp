export default function solve(arr) {
  const steps = []
  let n = arr.length
  let mp = {} // value -> every index with that value
  let dist = {} // key [idx,tag] turns into the text "idx,tag".  tag 0 = index, tag 1 = value
  for (let i = 0; i < n; i++) {
    if (!mp[arr[i]]) mp[arr[i]] = []
    mp[arr[i]].push(i)
  }

  let dq = [] // 0-1 BFS: cost-0 moves go to the front, cost-1 moves to the back
  dq.push([0, 0])
  dist[[0, 0]] = 0

  while (dq.length) {
    let [i, tag] = dq.shift()

    if (tag) {
      for (let idx of mp[i]) {
        if (!([idx, 0] in dist) || dist[[idx, 0]] > dist[[i, tag]]) {
          dist[[idx, 0]] = dist[[i, tag]]
          dq.unshift([idx, 0])
        }
      }
    } else {
      if (i + 1 < n && (!([i + 1, 0] in dist) || dist[[i + 1, 0]] > dist[[i, 0]] + 1)) {
        dist[[i + 1, 0]] = dist[[i, 0]] + 1
        dq.push([i + 1, 0])
      }
      if (i - 1 >= 0 && (!([i - 1, 0] in dist) || dist[[i - 1, 0]] > dist[[i, 0]] + 1)) {
        dist[[i - 1, 0]] = dist[[i, 0]] + 1
        dq.push([i - 1, 0])
      }
      let val = arr[i]
      if (!([val, 1] in dist) || dist[[val, 1]] > dist[[i, 0]] + 1) {
        dist[[val, 1]] = dist[[i, 0]] + 1
        dq.push([val, 1])
      }
    }
    steps.push(structuredClone({ node: [i, tag], dq, dist }))
  }

  return { answer: dist[[n - 1, 0]], steps }
}

# Stocks & Stones

Step-by-step visualizer for my LeetCode solutions (Stocks / Jumps / Stones). Type your own input and it re-runs.

```
src/solutions/<id>.js  ──►  { answer, steps }  ──►  src/App.jsx  ──►  src/ui/
 solve() runs my logic       steps = variables       shows            drawing only
 and pushes a step           at the moments I        steps[step]
 at key moments              chose
```

## Run

```bash
npm install
npm run dev
```

## Where to look

- `src/solutions/<id>.js`: one solution. `solve(...)` is my C++ in JS plus `steps.push({ i, ans, dp })`
  where I want a step on screen. Arrays go through `structuredClone`, since the code keeps changing them.
- `src/solutions/<id>.cpp`: the original C++ shown on the page.
- `src/App.jsx`: runs `solve(...input)` and shows `steps[step]`.
- `src/ui/`: drawing only (Bars, Variables, Controls, InputForm...).
- `src/problems.json`: title, input names, example and expected answer of each problem.

## Add a solution

Write `src/solutions/<id>.js` (`export default function solve(...)` returning `{ answer, steps }`) and `<id>.cpp`.
Add two imports and one line in `src/solutions/index.js`, and an entry in `src/problems.json`.

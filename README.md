# Stocks & Stones

A step-by-step visualizer for my LeetCode solutions, grouped by type (Stocks / Jumps / Stones). Type your own input and it re-runs.

```
src/solutions/<id>.js ──► { answer, steps } ──► src/App.jsx ──► src/ui/
 solve(...) runs my        steps = the variables    shows           all the
 solution and pushes       at each moment I chose   steps[step]     drawing
 a step at key moments
```

## Run

```bash
npm install
npm run dev     # the visualizer
npm test        # every solution must return the expected answer on its example
```

## Read in this order

1. `src/solutions/stocks-1.js`: a solution. `solve(arr)` is my C++ from `mysolutions/` in JS, plus
   `steps.push({ i, minPrice, ans })` wherever I want a step on screen. It returns `{ answer, steps }`.
   Arrays are saved with `structuredClone(...)`, because the solution keeps changing them after the push.
2. `src/App.jsx`: runs `solve(...input)` and shows `steps[step]`.
3. `src/ui/`: Code (my C++), Bars (the input array, with i / j / l / r as chips), Variables (any number, list or table),
   Controls, InputForm. Drawing only; no logic about the problems.

`src/problems.json` lists the problems (title, pattern, input names, default input, expected answer).
`mysolutions/*.txt` is the original C++, kept for reference.

## Add a solution

Write `src/solutions/<id>.js` with `export default function solve(...)` returning `{ answer, steps }`, and put the C++ in `<id>.cpp`.
Add two imports and one line in `src/solutions/index.js`, add an entry to `src/problems.json`, run `npm test`.

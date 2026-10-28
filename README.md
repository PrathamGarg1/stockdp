# Stocks & Stones

A step-by-step visualizer for my LeetCode solutions, grouped by pattern. Type your own input and it re-runs.

```
src/solutions/<id>.js ──► src/trace.js ──► frames ──► src/App.jsx ──► src/ui/
 my solution (JS)          runs it and      one per     shows          all the
                           records it       statement   frames[step]   drawing
```

## Run

```bash
npm install
npm run dev     # the visualizer
npm test        # every solution must return the expected answer on its example
```

## Read in this order

1. `src/solutions/stocks-1.js`: a solution. It is my C++ from `mysolutions/`, ported line for line
   (`let` for `int`, `Math.max` for `max`, `this.` for class members, `grid([n+1,3,2],-1)` for `int dp[..][..][..]` + `memset`).
2. `src/trace.js`: the core. `instrument()` puts a `__s(line, ...)` call before every statement,
   then the code runs for real and each call records a frame: `{ line, depth, fn, args, vars, mem, ret }`.
3. `src/App.jsx`: loads a solution, runs it on the input, and shows `frames[step]`.
4. `src/ui/`: Code, Bars, Tree, Variables, Controls, InputForm. Drawing only; no logic about the problems.

`src/problems.json` lists the problems (title, pattern, default input, expected answer).
`mysolutions/*.txt` is the original C++, kept for reference.

## Add a solution

Port the class to `src/solutions/<id>.js` (the last method is the one that runs), add a line to `src/problems.json`, run `npm test`.

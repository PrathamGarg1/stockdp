# Stocks & Stones

A visualizer for my LeetCode solutions in `mysolutions/*.txt`, grouped by pattern.
**The C++ is never rewritten.** Each solution is compiled as written and run under a debugger;
the page replays what the debugger saw, line by line.

```
mysolutions/*.txt ──scripts/trace.py──► src/traces/<id>.json ──► React UI
 (my C++, untouched)   compile + lldb       code + one frame        replays it
                                            per executed line
```

## Use it

```bash
npm install
npm run dev        # the visualizer
npm test           # every trace must return the expected answer
npm run trace      # re-run the C++ (needs clang++ and lldb); pass ids to redo a few: npm run trace -- jumps-4
```

Traces are committed, so `npm run dev` works without lldb.

## Where things are

| file | what it does |
| --- | --- |
| `src/problems.json` | one line per solution: which file/chunk, pattern, example input, expected answer |
| `src/patterns.ts` | the 6 patterns: how to spot them and the rule |
| `scripts/trace.py` | splits the txt files, builds a tiny `main` per solution, compiles, runs lldb |
| `scripts/lldb_tracer.py` | runs inside lldb: steps line by line and records variables, `this->` members, returns |
| `src/trace.ts` | trace types, recursion tree (from call depth), pointer chips |
| `src/views.tsx` | draws any value (cell / row / grid / pair), bars, tree |
| `src/App.tsx` | sidebar by pattern, code panel, player |

## Adding a solution

Paste the class into a `mysolutions/*.txt` file, add a line to `src/problems.json`, run `npm run trace`.
Nothing else: the UI draws whatever variables the debugger reports.

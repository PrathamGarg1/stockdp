# Notes

## How it works

Every solution is a plain function: `solve(arr)` runs my logic and, at the moments worth seeing,
does `steps.push({ i, ans, dp })`. It returns `{ answer, steps }` and the page shows `steps[step]`.
That's the whole system: no parser, no debugger, no server.

- Loops (greedy, rolling arrays) push one step per `i`.
- Memo recursion pushes one step each time a dp cell is filled, so you watch the table fill up.
- Arrays are pushed with `structuredClone`, because the code keeps changing them after the push.

## Why not just use the Chrome / Node debugger to read the variables?

I tried it: run the solution under `node --inspect-brk`, pause on every line over the
Chrome DevTools Protocol, and ask the debugger for the locals. It worked, but:

- **Speed.** One round trip per pause and per variable. All 28 examples took about **8.5 s**,
  compared with a few milliseconds now.
- **It needs a server.** A web page can't drive the debugger, so every run went through a backend
  (child process per request, WebSocket client, timeouts). Now everything runs in the browser.
- **Too many steps.** The debugger pauses on every line, including the loop counters and the three parts
  of a `for` header. I only want the moments that explain the algorithm: "after day i" or "dp[i][j] is filled".

## Why not instrument the code automatically (parse it and add a snapshot call before every statement)?

I did that too (acorn + a code rewriter). It worked and was fast, but it was about 150 lines of
parser code just to answer "what are the variables now?", and it was hard to explain.
Writing `steps.push(...)` by hand is one line per solution: anyone can read it,
and I pick exactly which moments and which variables appear.

**Trade-off:** the page no longer highlights the current line of code. Each step shows the variables
plus the input bars with `i`, `j`, `l`, `r` marked, which is the part that explains the DP.

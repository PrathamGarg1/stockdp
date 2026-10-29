# Notes

## Why not just use the Chrome / Node debugger to read the variables?

I tried it: run the solution under `node --inspect-brk`, pause on every line over the
Chrome DevTools Protocol, and ask the debugger for the locals. It worked, but I went back to
`src/trace.js` (add a `__s(line, ...)` call before each statement, then run the code normally). Here's why:

- **Speed.** The debugger needs a round trip per pause and per variable. All 28 examples took
  about **8.5 s** that way and about **75 ms** with instrumentation. That's roughly 100x.
- **It runs in the browser.** The debugger can't be driven from inside a web page, so it needed a server.
  Instrumentation is ordinary JavaScript, so the page traces any input on its own: no backend,
  no serverless function, nothing to host but static files.
- **Less code, fewer failure modes.** The debugger version needed a child process per request,
  a WebSocket client with request IDs, a timeout to kill it, and a delay before closing the socket
  so the process could exit. The page then needed loading states and a guard against late replies.
  Now tracing is one synchronous call: `runTrace(source, input)` returns `{ frames, result }`.
- **I control what a "step" is.** I choose which statements get a frame, and `__r` / `__in` / `__out` give me
  return values and call depth directly. With the debugger I had to filter out its internal pauses
  (arrow functions, the `for` header firing three times on one line) after the fact.
- **My code stays untouched either way.** The spy calls are added to a copy in memory, on the
  same line as the statement, so line numbers match the file and the solution files never change.

**Trade-off:** instrumentation only understands the syntax I handle (classes, methods,
`let`, `for`, `if`, `return`). The debugger would see any JavaScript. That's fine here
because every solution is a line-for-line port of my C++ in that same small style.

// grid([3, 2], -1)  ->  [[-1,-1],[-1,-1],[-1,-1]]       (the C++ `int dp[3][2]; memset(dp, -1, ...)`)
export const grid = (dims, fill = 0) => (dims.length === 1 ? Array(dims[0]).fill(fill) : Array.from({ length: dims[0] }, () => grid(dims.slice(1), fill)))

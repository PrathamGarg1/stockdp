// C++ shown in the tabs. Nothing here is executed.
// The tab that matches the running trace is `runs`. Stock II is `stockII` below.
import type { CodeStage } from "../engine/types"

function step(id: string, title: string, delta: string, code: string, badge?: string): CodeStage {
  return { id, title, delta, code: code.trim(), badge }
}

const stockII = {
  runs: "rises",
  stages: [
    step(
      "recursion",
      "Recursion",
      "State is (i, canbuy). Buying spends the price, selling banks it.",
      `
int f(int i, int canbuy, vector<int> &prices) {
    if (i == prices.size()) return 0;
    if (canbuy)
        return max(-prices[i] + f(i + 1, 0, prices),
                   0 + f(i + 1, 1, prices));
    return max(prices[i] + f(i + 1, 1, prices),
               0 + f(i + 1, 0, prices));
}`,
    ),
    step(
      "memo",
      "Memo",
      "Same state. dp[i][canbuy] stores the answer so the tree is not recomputed.",
      `
int f(int i, int canbuy, vector<int> &prices, vector<vector<int>> &dp) {
    if (i == prices.size()) return 0;
    if (dp[i][canbuy] != -1) return dp[i][canbuy];
    if (canbuy)
        return dp[i][canbuy] = max(-prices[i] + f(i + 1, 0, prices, dp),
                                   0 + f(i + 1, 1, prices, dp));
    return dp[i][canbuy] = max(prices[i] + f(i + 1, 1, prices, dp),
                               0 + f(i + 1, 0, prices, dp));
}`,
    ),
    step(
      "tabulation",
      "Tabulation",
      "The base case sits at i == n, so the loop walks from the right.",
      `
int n = prices.size();
vector<vector<int>> dp(n + 1, vector<int>(2, 0));
for (int i = n - 1; i >= 0; i--) {
    dp[i][1] = max(-prices[i] + dp[i + 1][0], dp[i + 1][1]);
    dp[i][0] = max(prices[i] + dp[i + 1][1], dp[i + 1][0]);
}
return dp[0][1];`,
    ),
    step(
      "space",
      "Space",
      "Tomorrow depends only on tomorrow. curr and after replace the n rows.",
      `
int n = prices.size();
vector<int> curr(2, 0), after(2, 0);
for (int i = n - 1; i >= 0; i--) {
    for (int canbuy = 0; canbuy < 2; canbuy++) {
        if (canbuy)
            curr[canbuy] = max(-prices[i] + after[0], after[1]);
        else
            curr[canbuy] = max(prices[i] + after[1], after[0]);
    }
    after = curr;
}
return curr[1];`,
      "stockdp",
    ),
    step(
      "rises",
      "Sum of rises",
      "With free transactions that DP equals the sum of every positive difference. The board plays this.",
      `
int maxProfit(vector<int> &prices) {
    int ans = 0;
    for (int i = 1; i < prices.size(); i++)
        if (prices[i] > prices[i - 1])
            ans += prices[i] - prices[i - 1];
    return ans;
}`,
      "on the board",
    ),
  ],
}

export const ladders: Record<string, { runs: string; stages: CodeStage[] }> = {
  "121": {
    runs: "pass",
    stages: [
      step(
        "pairs",
        "Every pair",
        "Try each buy day and each later sell. Correct, and quadratic.",
        `
int ans = 0;
for (int buy = 0; buy < n; buy++)
    for (int sell = buy + 1; sell < n; sell++)
        ans = max(ans, prices[sell] - prices[buy]);`,
      ),
      step(
        "pass",
        "One pass",
        "mintillnow is the only buy that matters. ans sells against it.",
        `
int mintillnow = prices[0], ans = 0;
for (int i = 1; i < prices.size(); i++) {
    if (prices[i] > mintillnow)
        ans = max(ans, prices[i] - mintillnow);
    else
        mintillnow = prices[i];
}
return ans;`,
        "on the board",
      ),
    ],
  },
  "122": stockII,
  "123": {
    runs: "lanes",
    stages: [
      step(
        "recursion",
        "Recursion",
        "Add a cap. Selling spends one transaction.",
        `
int f(int i, int canbuy, int cap) {
    if (i == n || cap == 0) return 0;
    if (canbuy)
        return max(-prices[i] + f(i + 1, 0, cap), f(i + 1, 1, cap));
    return max(prices[i] + f(i + 1, 1, cap - 1), f(i + 1, 0, cap));
}`,
      ),
      step(
        "space",
        "Space",
        "cap is 2. curr[canbuy][t] and after[canbuy][t] are enough. This is where stockdp stopped.",
        `
vector<vector<int>> curr(2, vector<int>(3, 0)), after(2, vector<int>(3, 0));
for (int i = n - 1; i >= 0; i--) {
    for (int canbuy = 0; canbuy < 2; canbuy++) {
        for (int t = 1; t <= 2; t++) {
            if (canbuy)
                curr[canbuy][t] = max(-prices[i] + after[0][t], after[1][t]);
            else
                curr[canbuy][t] = max(prices[i] + after[1][t - 1], after[0][t]);
        }
    }
    after = curr;
}
return curr[1][2];`,
        "stockdp",
      ),
      step(
        "lanes",
        "Two lanes",
        "Read the same state forward: buy1, sell1, buy2, sell2. The board shows these four numbers, then the two windows.",
        `
int buy1 = -1e9, sell1 = 0, buy2 = -1e9, sell2 = 0;
for (int p : prices) {
    buy1 = max(buy1, -p);
    sell1 = max(sell1, buy1 + p);
    buy2 = max(buy2, sell1 - p);
    sell2 = max(sell2, buy2 + p);
}
return sell2;`,
        "on the board",
      ),
    ],
  },
  "188": {
    runs: "space",
    stages: [
      step(
        "recursion",
        "Recursion",
        "Same triple as III. cap is the parameter k, not the constant 2.",
        `
int f(int i, int canbuy, int cap) {
    if (i == n || cap == 0) return 0;
    if (canbuy)
        return max(-prices[i] + f(i + 1, 0, cap), f(i + 1, 1, cap));
    return max(prices[i] + f(i + 1, 1, cap - 1), f(i + 1, 0, cap));
}`,
      ),
      step(
        "tabulation",
        "Tabulation",
        "dp[i][canbuy][t], filled from the right. t = 0 is a row of zeros.",
        `
vector<vector<vector<int>>> dp(n + 1, vector<vector<int>>(2, vector<int>(k + 1, 0)));
for (int i = n - 1; i >= 0; i--)
    for (int canbuy = 0; canbuy < 2; canbuy++)
        for (int t = 1; t <= k; t++)
            if (canbuy)
                dp[i][canbuy][t] = max(-prices[i] + dp[i + 1][0][t], dp[i + 1][1][t]);
            else
                dp[i][canbuy][t] = max(prices[i] + dp[i + 1][1][t - 1], dp[i + 1][0][t]);`,
      ),
      step(
        "space",
        "Space",
        "Only tomorrow is read. Two planes, curr and after, replace the day axis. The grid on the board is curr.",
        `
vector<vector<int>> curr(2, vector<int>(k + 1, 0)), after(2, vector<int>(k + 1, 0));
for (int i = n - 1; i >= 0; i--) {
    for (int canbuy = 0; canbuy < 2; canbuy++)
        for (int t = 1; t <= k; t++)
            if (canbuy)
                curr[canbuy][t] = max(-prices[i] + after[0][t], after[1][t]);
            else
                curr[canbuy][t] = max(prices[i] + after[1][t - 1], after[0][t]);
    after = curr;
}
return curr[1][k];`,
        "on the board",
      ),
    ],
  },
  "3573": {
    runs: "space",
    stages: [
      step(
        "recursion",
        "Recursion",
        "Three states now. 0 flat, 1 long, 2 short. Opening either spends a transaction.",
        `
int f(int i, int state, int t) {
    if (i == n || t == 0) return state == 0 ? 0 : -1e9;
    if (state == 0)
        return max({f(i + 1, 0, t), prices[i] + f(i + 1, 1, t), -prices[i] + f(i + 1, 2, t)});
    if (state == 1)
        return max(f(i + 1, 1, t), -prices[i] + f(i + 1, 0, t - 1));
    return max(f(i + 1, 2, t), prices[i] + f(i + 1, 0, t - 1));
}`,
      ),
      step(
        "space",
        "Space",
        "curr[3][k+1] and after[3][k+1]. Holding at the end is impossible, so those cells start at -inf.",
        `
vector<vector<int>> curr(3, vector<int>(k + 1, 0)), after(3, vector<int>(k + 1, 0));
for (int t = 0; t <= k; t++) after[1][t] = after[2][t] = -1e9;
for (int i = n - 1; i >= 0; i--) {
    for (int state = 0; state <= 2; state++)
        for (int t = 1; t <= k; t++) {
            if (state == 0)
                curr[0][t] = max({after[0][t], prices[i] + after[1][t], -prices[i] + after[2][t]});
            else if (state == 1)
                curr[1][t] = max(after[1][t], -prices[i] + after[0][t - 1]);
            else
                curr[2][t] = max(after[2][t], prices[i] + after[0][t - 1]);
        }
    after = curr;
}
return curr[0][k];`,
        "on the board",
      ),
    ],
  },
  "309": {
    runs: "space",
    stages: [
      step(
        "recursion",
        "Recursion",
        "A sell cannot buy on i + 1. The next buy is i + 2.",
        `
int f(int i, int canbuy) {
    if (i >= n) return 0;
    if (canbuy)
        return max(-prices[i] + f(i + 1, 0), f(i + 1, 1));
    return max(prices[i] + f(i + 2, 1), f(i + 1, 0));
}`,
      ),
      step(
        "space",
        "Space",
        "i + 2 is moreafter. Three rolling arrays, still O(1) extra memory.",
        `
vector<int> curr(2, 0), after(2, 0), moreafter(2, 0);
for (int i = n - 1; i >= 0; i--) {
    curr[1] = max(-prices[i] + after[0], after[1]);
    curr[0] = max(prices[i] + moreafter[1], after[0]);
    moreafter = after;
    after = curr;
}
return after[1];`,
        "on the board",
      ),
    ],
  },
  "714": {
    runs: "space",
    stages: [
      step(
        "recursion",
        "Recursion",
        "Stock II, with fee subtracted on the sell.",
        `
int f(int i, int canbuy) {
    if (i == n) return 0;
    if (canbuy)
        return max(-prices[i] + f(i + 1, 0), f(i + 1, 1));
    return max(prices[i] - fee + f(i + 1, 1), f(i + 1, 0));
}`,
      ),
      step(
        "space",
        "Space",
        "The same curr / after pair. fee lives in the sell line.",
        `
vector<int> curr(2, 0), after(2, 0);
for (int i = n - 1; i >= 0; i--) {
    curr[1] = max(-prices[i] + after[0], after[1]);
    curr[0] = max(prices[i] - fee + after[1], after[0]);
    after = curr;
}
return curr[1];`,
        "on the board",
      ),
    ],
  },
  "3652": {
    runs: "prefix",
    stages: [
      step(
        "windows",
        "Every window",
        "Rewrite each block of length k and recompute the dot product. Correct, and quadratic.",
        `
long long base = 0;
for (int i = 0; i < n; i++) base += 1LL * strategy[i] * prices[i];
long long ans = base;
for (int L = 0; L + k <= n; L++) {
    long long delta = 0;
    for (int i = L; i < L + k / 2; i++) delta -= 1LL * strategy[i] * prices[i];
    for (int i = L + k / 2; i < L + k; i++) delta += 1LL * (1 - strategy[i]) * prices[i];
    ans = max(ans, base + delta);
}`,
      ),
      step(
        "prefix",
        "Prefix delta",
        "Drop the old window profit, add the price sum of the sell half. Each window is then O(1).",
        `
// s[i] = sum of strategy[j] * prices[j]
// t[i] = sum of prices[j]
long long ans = s[n];
for (int R = k; R <= n; R++) {
    int L = R - k, mid = L + k / 2;
    long long delta = -(s[R] - s[L]) + (t[R] - t[mid]);
    ans = max(ans, s[n] + delta);
}
return ans;`,
        "on the board",
      ),
    ],
  },
  "55": {
    runs: "greedy",
    stages: [
      step("recursion", "Recursion", "canReach(i) if some jump from the left lands on i, or i is 0.", `
bool f(int i) {
    if (i == 0) return true;
    for (int j = 0; j < i; j++)
        if (j + nums[j] >= i && f(j)) return true;
    return false;
}`),
      step("greedy", "Farthest", "If the scan walks past farthest, nothing reaches here. The band on the board is that variable.", `
int farthest = 0;
for (int i = 0; i < nums.size(); i++) {
    if (i > farthest) return false;
    farthest = max(farthest, i + nums[i]);
}
return true;`, "on the board"),
    ],
  },
  "45": {
    runs: "windows",
    stages: [
      step("bfs", "BFS layers", "The same graph as Jump I. The answer is the layer of the last index.", `
// queue of indexes, dist[n - 1]`),
      step("windows", "Windows", "The current window is one jump. The next window ends at the farthest index inside it.", `
int jumps = 0, curEnd = 0, farthest = 0;
for (int i = 0; i < n - 1; i++) {
    farthest = max(farthest, i + nums[i]);
    if (i == curEnd) {
        jumps++;
        curEnd = farthest;
    }
}
return jumps;`, "on the board"),
    ],
  },
  "1306": {
    runs: "bfs",
    stages: [
      step("bfs", "BFS", "Jump exactly arr[i] left or right. The first 0 you dequeue is a yes.", `
queue<int> q; q.push(start);
vector<int> seen(n);
while (!q.empty()) {
    int i = q.front(); q.pop();
    if (arr[i] == 0) return true;
    for (int j : {i + arr[i], i - arr[i]})
        if (j >= 0 && j < n && !seen[j]) seen[j] = 1, q.push(j);
}
return false;`, "on the board"),
    ],
  },
  "1345": {
    runs: "bfs",
    stages: [
      step("bfs", "BFS", "Edges are neighbors and every index with the same value. Clear a value after its group is used once.", `
unordered_map<int, vector<int>> pos;
// BFS from 0
// from i, try i-1, i+1, and pos[arr[i]]
// then pos[arr[i]].clear()`, "on the board"),
    ],
  },
  "1340": {
    runs: "memo",
    stages: [
      step("memo", "Memo", "From i, walk at most d steps each way and stop at the first bar that is not strictly lower.", `
int f(int i) {
    if (dp[i]) return dp[i];
    int best = 1;
    for (int dir : {-1, 1})
        for (int x = 1; x <= d; x++) {
            int j = i + dir * x;
            if (j < 0 || j >= n || arr[j] >= arr[i]) break;
            best = max(best, 1 + f(j));
        }
    return dp[i] = best;
}`, "on the board"),
    ],
  },
  "1696": {
    runs: "deque",
    stages: [
      step("dp", "Plain DP", "dp[i] = nums[i] + max(dp[j]) for j in [i - k, i). The max is a scan.", `
dp[0] = nums[0];
for (int i = 1; i < n; i++)
    for (int j = max(0, i - k); j < i; j++)
        dp[i] = max(dp[i], nums[i] + dp[j]);`),
      step("deque", "Deque", "Front leaves the window. Back leaves when a newer score is at least as good. The board draws that deque.", `
deque<int> dq; dq.push_back(0); dp[0] = nums[0];
for (int i = 1; i < n; i++) {
    while (!dq.empty() && dq.front() < i - k) dq.pop_front();
    dp[i] = nums[i] + dp[dq.front()];
    while (!dq.empty() && dp[dq.back()] <= dp[i]) dq.pop_back();
    dq.push_back(i);
}`, "on the board"),
    ],
  },
  "1871": {
    runs: "window",
    stages: [
      step("window", "Sliding count", "Sources that can land on i sit in [i - maxJump, i - minJump]. A running count replaces the scan. 1s are walls.", `
int cnt = 0; reach[0] = 1;
for (int i = 1; i < n; i++) {
    if (i >= minJump) cnt += reach[i - minJump];
    if (i > maxJump) cnt -= reach[i - maxJump - 1];
    reach[i] = cnt > 0 && s[i] == '0';
}
return reach[n - 1];`, "on the board"),
    ],
  },
  "2297": {
    runs: "stacks",
    stages: [
      step("stacks", "Two stacks", "maxStack yields the next greater-or-equal. minStack yields the next smaller. Each pop is an edge, then pay costs[i].", `
vector<long> dp(n, LONG_MAX); dp[0] = 0;
vector<int> maxStack, minStack;
for (int i = 0; i < n; i++) {
    while (!maxStack.empty() && nums[i] >= nums[maxStack.back()]) {
        dp[i] = min(dp[i], dp[maxStack.back()] + costs[i]);
        maxStack.pop_back();
    }
    while (!minStack.empty() && nums[i] < nums[minStack.back()]) {
        dp[i] = min(dp[i], dp[minStack.back()] + costs[i]);
        minStack.pop_back();
    }
    maxStack.push_back(i);
    minStack.push_back(i);
}`, "on the board"),
    ],
  },
  "3660": {
    runs: "scan",
    stages: [
      step("scan", "Prefix max, suffix min", "Forward jumps go to a smaller value, backward jumps to a larger one. Where preMax beats sufMin, this index joins the component on its right.", `
vector<int> pre(n), ans(n);
pre[0] = nums[0];
for (int i = 1; i < n; i++) pre[i] = max(pre[i - 1], nums[i]);
int suf = INT_MAX;
for (int i = n - 1; i >= 0; i--) {
    ans[i] = (i + 1 < n && pre[i] > suf) ? ans[i + 1] : pre[i];
    suf = min(suf, nums[i]);
}`, "on the board"),
    ],
  },
  "877": {
    runs: "parity",
    stages: [
      step("recursion", "Interval DP", "Take an end. The opponent's best difference is subtracted.", `
int f(int l, int r) {
    if (l == r) return piles[l];
    return max(piles[l] - f(l + 1, r), piles[r] - f(l, r - 1));
}`),
      step("parity", "Parity", "Alice can take every even index or every odd index. With an even length she takes the larger group. The DP is the long way around.", `
int even = 0, odd = 0;
for (int i = 0; i < n; i++)
    (i % 2 == 0 ? even : odd) += piles[i];
return even != odd;`, "on the board"),
    ],
  },
  "1140": {
    runs: "dp",
    stages: [
      step("recursion", "Recursion", "State (i, M). Try every legal prefix, then M = max(M, X).", `
int f(int i, int M) {
    if (i == n) return 0;
    int best = 0;
    for (int x = 1; x <= 2 * M && i + x <= n; x++)
        best = max(best, suffix[i] - f(i + x, max(M, x)));
    return best;
}`),
      step("dp", "Table", "Fill i from the right, M from 1 to n. The board highlights the X the current player actually chooses.", `
for (int i = n - 1; i >= 0; i--)
    for (int m = 1; m <= n; m++)
        for (int x = 1; x <= 2 * m && i + x <= n; x++)
            dp[i][m] = max(dp[i][m], suffix[i] - dp[i + x][max(m, x)]);
return dp[0][1];`, "on the board"),
    ],
  },
  "1406": {
    runs: "suffix",
    stages: [
      step("suffix", "Suffix", "dp[i] is the best difference for the player about to move on the suffix. Take 1, 2, or 3.", `
for (int i = n - 1; i >= 0; i--) {
    int sum = 0;
    for (int k = 1; k <= 3 && i + k <= n; k++) {
        sum += stoneValue[i + k - 1];
        dp[i] = max(dp[i], sum - dp[i + k]);
    }
}
return dp[0] == 0 ? "Tie" : dp[0] > 0 ? "Alice" : "Bob";`, "on the board"),
    ],
  },
  "1510": {
    runs: "winloss",
    stages: [
      step("winloss", "Win / loss", "lose[0] is true. i wins when some square s*s leaves a losing position.", `
vector<int> lose(n + 1, 0); lose[0] = 1;
for (int i = 1; i <= n; i++) {
    bool win = false;
    for (int s = 1; s * s <= i; s++)
        if (lose[i - s * s]) win = true;
    lose[i] = !win;
}
return !lose[n];`, "on the board"),
    ],
  },
  "1563": {
    runs: "interval",
    stages: [
      step("interval", "Interval", "Every split. Bank the lighter sum and add the dp of the side you keep.", `
for (int len = 2; len <= n; len++)
    for (int l = 0; l + len - 1 < n; l++) {
        int r = l + len - 1;
        for (int k = l; k < r; k++) {
            int L = sum(l, k), R = sum(k + 1, r);
            if (L < R) dp[l][r] = max(dp[l][r], L + dp[l][k]);
            else if (R < L) dp[l][r] = max(dp[l][r], R + dp[k + 1][r]);
            else dp[l][r] = max(dp[l][r], L + max(dp[l][k], dp[k + 1][r]));
        }
    }`, "on the board"),
    ],
  },
  "1686": {
    runs: "sort",
    stages: [
      step("sort", "Sort key", "a[i] + b[i] is the value of taking it and denying it. Sort descending, then alternate.", `
vector<int> id(n);
iota(id.begin(), id.end(), 0);
sort(id.begin(), id.end(), [&](int i, int j) {
    return alice[i] + bob[i] > alice[j] + bob[j];
});
int A = 0, B = 0;
for (int t = 0; t < n; t++)
    if (t % 2 == 0) A += alice[id[t]];
    else B += bob[id[t]];
return A == B ? 0 : A > B ? 1 : -1;`, "on the board"),
    ],
  },
  "1690": {
    runs: "ends",
    stages: [
      step("ends", "Score the remainder", "Same ends as Stone I. The points are sum(l+1, r) or sum(l, r-1), then subtract the opponent's difference.", `
for (int len = 2; len <= n; len++)
    for (int l = 0; l + len - 1 < n; l++) {
        int r = l + len - 1;
        dp[l][r] = max(sum(l + 1, r) - dp[l + 1][r],
                       sum(l, r - 1) - dp[l][r - 1]);
    }
return dp[0][n - 1];`, "on the board"),
    ],
  },
  "1872": {
    runs: "scan",
    stages: [
      step("merge", "Prefix merge", "A move replaces a prefix by its sum and adds that sum to the score. The array after the move starts at that prefix.", `
// take j > i, score prefix[j], opponent plays from j`),
      step("scan", "Right to left", "dp[i] = max over j > i of prefix[j] - dp[j]. One running maximum computes every i.", `
vector<long> prefix(n), dp(n);
for (int i = 0; i < n; i++) prefix[i] = stones[i] + (i ? prefix[i - 1] : 0);
long mx = prefix[n - 1];
for (int i = n - 2; i >= 0; i--) {
    dp[i] = mx;
    mx = max(mx, prefix[i] - dp[i]);
}
return dp[0];`, "on the board"),
    ],
  },
  "2029": {
    runs: "counts",
    stages: [
      step(
        "tree",
        "Game tree",
        "A move that makes the removed sum divisible by 3 is an instant loss. With n small, minimax on the mask checks the closed form.",
        `
bool win(int mask, int sum) {
    for (int i = 0; i < n; i++) if (!(mask >> i & 1)) {
        int nxt = sum + stones[i];
        if (nxt % 3 == 0) continue;
        if (!win(mask | 1 << i, nxt)) return true;
    }
    return false;
}`,
      ),
      step("counts", "Counts mod 3", "Zeros do not change the residue. Their parity, and the gap between ones and twos, is the whole game.", `
int c[3] = {};
for (int x : stones) c[x % 3]++;
if (c[0] % 2 == 0) return c[1] && c[2];
return abs(c[1] - c[2]) > 2;`, "on the board"),
    ],
  },
}

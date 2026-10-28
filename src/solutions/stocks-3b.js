class Solution {
    maxProfit(arr) {
        let n = arr.length;
        let dp = grid([n+1,3,2]);

        for (let remk = 0; remk <= 2; remk++) {
            for (let state = 0; state < 2; state++) {
                dp[n][remk][state] = 0;
            }
        }

        for (let i = n - 1; i >= 0; i--) {
            for (let remk = 0; remk <= 2; remk++) {
                for (let state = 0; state < 2; state++) {
                    let ans = dp[i + 1][remk][state];
                    if (state == 0 && remk)
                        ans = Math.max(ans, -arr[i] + dp[i + 1][remk - 1][1]);
                    if (state == 1)
                        ans = Math.max(ans, arr[i] + dp[i + 1][remk][0]);
                    dp[i][remk][state] = ans;
                }
            }
        }

        return Math.max(dp[0][1][0],dp[0][2][0]);
    }
}

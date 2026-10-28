class Solution {
public:
    int maxProfit(vector<int>& arr) {
        int n = arr.size();
        int dp[100005][3][2];

        for (int remk = 0; remk <= 2; remk++) {
            for (int state = 0; state < 2; state++) {
                dp[n][remk][state] = 0;
            }
        }

        for (int i = n - 1; i >= 0; i--) {
            for (int remk = 0; remk <= 2; remk++) {
                for (int state = 0; state < 2; state++) {
                    int ans = dp[i + 1][remk][state];
                    if (state == 0 && remk)
                        ans = max(ans, -arr[i] + dp[i + 1][remk - 1][1]);
                    if (state == 1)
                        ans = max(ans, arr[i] + dp[i + 1][remk][0]);
                    dp[i][remk][state] = ans;
                }
            }
        }

        return max(dp[0][1][0],dp[0][2][0]);
    }
};

class Solution {
public:
    int maxProfit(vector<int>& arr) {
        int n = arr.size();
        int before[3][2];
        int after[3][2];

        for (int remk = 0; remk <= 2; remk++) {
            for (int state = 0; state < 2; state++) {
                after[remk][state] = 0;
            }
        }

        for (int i = n - 1; i >= 0; i--) {
            for (int remk = 0; remk <= 2; remk++) {
                for (int state = 0; state < 2; state++) {
                    int ans = after[remk][state];
                    if (state == 0 && remk)
                        ans = max(ans, -arr[i] + after[remk - 1][1]);
                    if (state == 1)
                        ans = max(ans, arr[i] + after[remk][0]);
                    before[remk][state] = ans;
                }
            }
            swap(after,before);
        }

        return max(after[1][0],after[2][0]);
    }
};

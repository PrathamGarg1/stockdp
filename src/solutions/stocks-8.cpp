class Solution {
public:
    int maxProfit(vector<int>& arr, int fee) {
        int n = arr.size();
        int before[2];
        int after[2];

        for (int state = 0; state < 2; state++) {
            after[state] = 0;
        }

        for (int i = n - 1; i >= 0; i--) {
            for (int state = 0; state < 2; state++) {
                int ans = after[state];
                if (state == 0 ) ans = max(ans, -arr[i]-fee + after[1]);
                if (state == 1) ans = max(ans, arr[i] + after[0]);
                before[state] = ans;
            }
            swap(after,before);
        }

        return after[0];
    }
};

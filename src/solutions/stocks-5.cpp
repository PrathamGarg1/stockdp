class Solution {
public:
    long long maximumProfit(vector<int>& arr, int k) {
        int n = arr.size();
        long long before[503][3];
        long long after[503][3];

        for (int remk = 0; remk <= k; remk++) {
            after[remk][0] = 0;
            after[remk][1] = 0;
            after[remk][2] = -1e11; // nuksan 
        }

        for (int i = n - 1; i >= 0; i--) {
            for (int remk = 0; remk <= k; remk++) {
                for (int state = 0; state <= 2; state++) {
                    long long ans = after[remk][state];
                    if (state == 0 && remk)
                        ans = max({ans, -arr[i] + after[remk - 1][1],+arr[i] + after[remk-1][2]});
                    if (state == 1)    ans = max(ans, arr[i] + after[remk][0]);
                    if (state == 2)    ans = max(ans, -arr[i] + after[remk][0]);
                    before[remk][state] = ans;
                }
            }
            swap(after,before);
        }


        long long ans=0;
        for(int remk=0;remk<=k;remk++){
            ans=max(ans,after[remk][0]);
        }
        return ans;
    }
};

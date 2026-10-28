class Solution {
public:
    bool canReach(string s, int minj, int maxj) {
        int n=s.size();
        queue<int>q;
        vector<bool>dp(n,0);
        dp[0]=1;
        if(minj==1) q.push(1);
        for(int i=1;i<n;i++){
            dp[i] =( s[i]=='0') &&  !q.empty();
            if(i+1-minj>=0 && dp[i+1-minj]) q.push(1);
            if(i-maxj>=0 && dp[i-maxj]) q.pop();
        }
        return dp[n-1];
    }
};

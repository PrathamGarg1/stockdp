class Solution {
public:

    int stoneGameVIII(vector<int>& arr) {

        int n=arr.size();
        vector<int>pre;
        pre.assign(n,arr[0]);
        for(int i=1;i<n;i++){
            pre[i]=pre[i-1]+arr[i];
        }


        vector<vector<int>>dp(n+1,vector<int>(2,0));
        dp[n][1]=0;
        dp[n][0]=0;

        vector<int>maxdp(n+1,0);
        maxdp[n]=pre[n-1];

        vector<int>mindp(n+1,0);
        mindp[n]=-pre[n-1];

        for(int i=n-1;i>=1;i--){
            for(int turn=0;turn<2;turn++){
                dp[i][turn]= turn ? (maxdp[i+1]) :( mindp[i+1]);
            }
            maxdp[i] = max(maxdp[i+1],pre[i-1]+dp[i][0]);
            mindp[i] = min(mindp[i+1],-pre[i-1]+dp[i][1]);
        }


        return dp[1][1];
    }
};

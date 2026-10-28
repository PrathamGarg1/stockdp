class Solution {
public:

    int dp[100005];

    int rec(int n){
        if(n==0) return 0;
        if(dp[n]!=-1) return dp[n];
        bool ans=false;
        for(int f=1;f*f<=n;f++){
            if(!rec(n-f*f)) ans=1;
        }
        return dp[n]=ans;
    }
    bool winnerSquareGame(int n) {
        memset(dp,-1,sizeof(dp));
        return rec(n);
    }
};

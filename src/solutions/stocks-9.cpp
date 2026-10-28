class Solution {
public:
    int dp[1505];
   int n;
   int cooldown;
   vector<int> costs,prices;
    int rec(int i){
        if(i>=n) return 0;
        if(dp[i]!=-1) return dp[i];
        int ans=rec(i+1);
        for(int j=i+1;j<n;j++){
            ans=max(ans,prices[j] - prices[i] - costs[j - i]+ rec(j + cooldown + 1));
        }
        return dp[i]=ans;
    }



    int maxProfit(vector<int>& prices_, int cooldown_, vector<int>& costs_) {
        costs=costs_;
        prices=prices_;
        cooldown=cooldown_;
        n=prices.size();
        memset(dp, -1, sizeof(dp));
        return rec(0);
    }
};

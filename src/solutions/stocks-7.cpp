class Solution {
public:
    long long maxProfit(vector<int>& prices, vector<int>& startegy, int k) {
        // atmost one modification    
        int n=prices.size();
        vector<long long>simpleStrategy(n,prices[0]*startegy[0]);
        vector<long long>pre(n,prices[0]);
        for(int i=1;i<n;i++){
            simpleStrategy[i]  = simpleStrategy[i-1] + prices[i]*startegy[i];
            pre[i]  = pre[i-1] + prices[i];
        }
        long long normalStrategy = simpleStrategy[n-1];
        long long ans=(pre[k-1]-pre[k/2-1])-(simpleStrategy[k-1]);
        for(int i=1;k-1+i<n;i++){
            ans=max(ans,(pre[k-1+i]-pre[k/2-1+i])-(simpleStrategy[k-1+i]-simpleStrategy[i-1]));
        }
        return max(normalStrategy,normalStrategy+ans);
    }
};

class Solution {
public:
    vector<int>ngeIdx,nseIdx;

    int n;
    long long dp[100005];
    vector<int> costs;
    long long rec(int i){
        if(i==n) return 1e11;
        if(i==n-1) return costs[i];
        if(dp[i]!=-1) return dp[i];
        return dp[i]=costs[i]+min(rec(ngeIdx[i]),rec(nseIdx[i]));
    }

    long long minCost(vector<int>&arr, vector<int>& cost) {
        costs=cost;
        n=arr.size();
        ngeIdx.assign(n,n);
        nseIdx.assign(n,n);
        stack<int>st;
        memset(dp,-1,sizeof(dp));
        for(int i=n-1;i>=0;i--){
            while(!st.empty() && arr[st.top()] < arr[i]) st.pop();
            if(!st.empty()) ngeIdx[i]=st.top();
            st.push(i);
        }
        while(!st.empty()) st.pop();
        for(int i=n-1;i>=0;i--){
            while(!st.empty() && arr[st.top()] >= arr[i]) st.pop();
            if(!st.empty()) nseIdx[i]=st.top();
            st.push(i);
        }
        return rec(0)-cost[0];
    }
};

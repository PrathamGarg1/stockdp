class Solution {
public:

    int dp[100005][3][2];
    int n;
    int rec(int i,int remk,int state,vector<int>& arr){
        if(i==n) return 0;
        if(dp[i][remk][state]!=-1) return dp[i][remk][state];
        int ans = rec(i+1,remk,state,arr);
        if(state==0 && remk) ans=max(ans,-arr[i]+rec(i+1,remk-1,1,arr));
        if(state==1) ans=max(ans,arr[i]+rec(i+1,remk,0,arr));
        return dp[i][remk][state]=ans;
    }


    int maxProfit(vector<int>& arr) {
        // atmost two transactions can be done 
        n=arr.size();
        memset(dp,-1,sizeof(dp));
        return rec(0,2,0,arr);
    }
};

class Solution {
public:
    int n;
    int dp[50005][2];
    int rec(int i,bool turn,vector<int>& arr){
        if(i==n) return 0;
        if(dp[i][turn]!=-1) return dp[i][turn];
        int profit=0;
        int ans =  turn ? -1e9 : 1e9;
        for(int j=i;j<i+3 && j<n;j++){
            profit += arr[j];
            if(turn) ans=max(ans,profit + rec(j+1,!turn,arr));
            else ans=min(ans,rec(j+1,!turn,arr));
        }
        return dp[i][turn]=ans;
    }


    string stoneGameIII(vector<int>& arr) {
        n=arr.size();
        memset(dp,-1,sizeof(dp));
        int tot=0;
        for(auto x:arr) tot +=x;
        int val = rec(0,1,arr);
        if(val > tot-val) return "Alice";
        if(val == tot-val) return "Tie";
        return "Bob";
        
    }
};

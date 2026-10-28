class Solution {
public:
    int n;
    int dp[102][102][2];
    int rec(int i,int m,int turn,vector<int>& arr){
        if(i==n) return 0;
        if(dp[i][m][turn]!=-1) return dp[i][m][turn];
        int ans =  turn ? -1e9 : 1e9;
        int profit=0;
        for(int j=i;j<i+2*m && j<n;j++){
            // take all these stones 
            profit += arr[j];
            int x = j-i+1;
            if(turn) ans=max(ans,profit + rec(j+1,max(m,x),!turn,arr));
            else ans=min(ans,rec(j+1,max(m,x),!turn,arr));
        }
        return dp[i][m][turn]=ans;
    }

    int stoneGameII(vector<int>& arr) {
        n=arr.size();
        memset(dp,-1,sizeof(dp));
        return rec(0,1,1,arr);
    }
};

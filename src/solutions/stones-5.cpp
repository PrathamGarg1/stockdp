class Solution {
public:
    int n;
    int dp[505][505];
    vector<int>pre;

    int rec(int i,int j,vector<int>&arr){
        if(i>=j) return 0;
        if(dp[i][j]!=-1) return dp[i][j];
        int tot = pre[j] - (i>0 ? pre[i-1] : 0);
        int ans = 0;
        for(int k=i;k<j;k++){
            int part1 = pre[k]- (i>0 ? pre[i-1] : 0);
            int part2 = tot - part1;
            if(part1 > part2){
                ans=max(ans,part2 + rec(k+1,j,arr));
            }
            else if(part1<part2){
                ans=max(ans,part1 + rec(i,k,arr));
            }
            else{
                ans=max({ans,part1 + rec(i,k,arr),part2 + rec(k+1,j,arr)});
            }
        }
        return dp[i][j] = ans;

    }

    int stoneGameV(vector<int>& arr) {
        n=arr.size();
        memset(dp,-1,sizeof(dp));
        pre.assign(n,arr[0]);
        for(int i=1;i<n;i++) pre[i]=pre[i-1]+arr[i];
        return rec(0,n-1,arr);
    }
};

class Solution {
public:

    long long dp[1505][1505][2];
    vector<int> arr;
    vector<long long>pre;

    long long val(int idx,int l,int r){
        return pre[r]-(l>0 ? pre[l-1] : 0)-arr[idx];
    }


    long long rec(int l,int r,bool turn){
        if(l>r) return 0;
        if(dp[l][r][turn]!=-1) return dp[l][r][turn];
        if(turn==1){
            return dp[l][r][turn] = max(val(l,l,r) + rec(l+1,r,!turn),val(r,l,r)+rec(l,r-1,!turn));
        }
        return dp[l][r][turn] = min(rec(l+1,r,!turn)-val(l,l,r),rec(l,r-1,!turn)-val(r,l,r));
    }


    int stoneGameVII(vector<int>& ar) {
        arr=ar;
        memset(dp,-1,sizeof(dp));
        int n=arr.size();
        pre.assign(n,arr[0]);
        for(int i=1;i<n;i++) pre[i]=pre[i-1]+arr[i];

        return rec(0,n-1,1);
    }
};

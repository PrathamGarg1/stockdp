class Solution {
public:
    vector<int>vis;
    int n;
    bool ans=0;
    void dfs(int i,vector<int>& arr){
        if(i<0 || i>=n) return;
        if(vis[i]) return;
        vis[i]=1;
        if(arr[i]==0){
            ans=1;
            return;
        }
        dfs(i-arr[i],arr);
        dfs(i+arr[i],arr);
    }

    bool canReach(vector<int>& arr, int start) {
        n=arr.size();
        vis.assign(n,0);
        dfs(start,arr);
        return ans;
    }
};

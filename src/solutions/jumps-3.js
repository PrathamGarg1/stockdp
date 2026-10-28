class Solution {
    vis;
    n;
    ans=false;
    dfs(i,arr){
        if(i<0 || i>=this.n) return;
        if(this.vis[i]) return;
        this.vis[i]=1;
        if(arr[i]==0){
            this.ans=true;
            return;
        }
        this.dfs(i-arr[i],arr);
        this.dfs(i+arr[i],arr);
    }

    canReach(arr, start) {
        this.n=arr.length;
        this.vis=Array(this.n).fill(0);
        this.dfs(start,arr);
        return this.ans;
    }
}

class Solution {
    n;
    dp;
    pre;

    rec(i,j,arr){
        if(i>=j) return 0;
        if(this.dp[i][j]!=-1) return this.dp[i][j];
        let tot = this.pre[j] - (i>0 ? this.pre[i-1] : 0);
        let ans = 0;
        for(let k=i;k<j;k++){
            let part1 = this.pre[k]- (i>0 ? this.pre[i-1] : 0);
            let part2 = tot - part1;
            if(part1 > part2){
                ans=Math.max(ans,part2 + this.rec(k+1,j,arr));
            }
            else if(part1<part2){
                ans=Math.max(ans,part1 + this.rec(i,k,arr));
            }
            else{
                ans=Math.max(ans,part1 + this.rec(i,k,arr),part2 + this.rec(k+1,j,arr));
            }
        }
        return this.dp[i][j] = ans;

    }

    stoneGameV(arr) {
        this.n=arr.length;
        this.dp=grid([this.n,this.n],-1);
        this.pre=Array(this.n).fill(arr[0]);
        for(let i=1;i<this.n;i++) this.pre[i]=this.pre[i-1]+arr[i];
        return this.rec(0,this.n-1,arr);
    }
}

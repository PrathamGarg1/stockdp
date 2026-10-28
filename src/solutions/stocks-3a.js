class Solution {

    dp;
    n;
    rec(i,remk,state,arr){
        if(i==this.n) return 0;
        if(this.dp[i][remk][state]!=-1) return this.dp[i][remk][state];
        let ans = this.rec(i+1,remk,state,arr);
        if(state==0 && remk) ans=Math.max(ans,-arr[i]+this.rec(i+1,remk-1,1,arr));
        if(state==1) ans=Math.max(ans,arr[i]+this.rec(i+1,remk,0,arr));
        return this.dp[i][remk][state]=ans;
    }


    maxProfit(arr) {
        // atmost two transactions can be done 
        this.n=arr.length;
        this.dp=grid([this.n+1,3,2],-1);
        return this.rec(0,2,0,arr);
    }
}

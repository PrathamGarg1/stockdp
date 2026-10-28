class Solution {

    dp;

    rec(n){
        if(n==0) return 0;
        if(this.dp[n]!=-1) return this.dp[n];
        let ans=false;
        for(let f=1;f*f<=n;f++){
            if(!this.rec(n-f*f)) ans=true;
        }
        return this.dp[n]=ans;
    }
    winnerSquareGame(n) {
        this.dp=grid([n+1],-1);
        return this.rec(n);
    }
}

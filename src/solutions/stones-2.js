class Solution {
    n;
    dp;
    rec(i,m,turn,arr){
        if(i==this.n) return 0;
        if(this.dp[i][m][turn]!=-1) return this.dp[i][m][turn];
        let ans =  turn ? -1e9 : 1e9;
        let profit=0;
        for(let j=i;j<i+2*m && j<this.n;j++){
            // take all these stones 
            profit += arr[j];
            let x = j-i+1;
            if(turn) ans=Math.max(ans,profit + this.rec(j+1,Math.max(m,x),+!turn,arr));
            else ans=Math.min(ans,this.rec(j+1,Math.max(m,x),+!turn,arr));
        }
        return this.dp[i][m][turn]=ans;
    }

    stoneGameII(arr) {
        this.n=arr.length;
        this.dp=grid([this.n+1,this.n+1,2],-1);
        return this.rec(0,1,1,arr);
    }
}

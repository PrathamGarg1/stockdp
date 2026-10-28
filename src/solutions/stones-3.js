class Solution {
    n;
    dp;
    rec(i,turn,arr){
        if(i==this.n) return 0;
        if(this.dp[i][turn]!=-1) return this.dp[i][turn];
        let profit=0;
        let ans =  turn ? -1e9 : 1e9;
        for(let j=i;j<i+3 && j<this.n;j++){
            profit += arr[j];
            if(turn) ans=Math.max(ans,profit + this.rec(j+1,+!turn,arr));
            else ans=Math.min(ans,this.rec(j+1,+!turn,arr));
        }
        return this.dp[i][turn]=ans;
    }


    stoneGameIII(arr) {
        this.n=arr.length;
        this.dp=grid([this.n+1,2],-1);
        let tot=0;
        for(let x of arr) tot +=x;
        let val = this.rec(0,1,arr);
        if(val > tot-val) return "Alice";
        if(val == tot-val) return "Tie";
        return "Bob";
        
    }
}

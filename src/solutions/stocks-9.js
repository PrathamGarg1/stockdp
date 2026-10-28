class Solution {
    dp;
    n;
    cooldown;
    costs; prices;
    rec(i){
        if(i>=this.n) return 0;
        if(this.dp[i]!=-1) return this.dp[i];
        let ans=this.rec(i+1);
        for(let j=i+1;j<this.n;j++){
            ans=Math.max(ans,this.prices[j] - this.prices[i] - this.costs[j - i]+ this.rec(j + this.cooldown + 1));
        }
        return this.dp[i]=ans;
    }



    maxProfit(prices_, cooldown_, costs_) {
        this.costs=costs_;
        this.prices=prices_;
        this.cooldown=cooldown_;
        this.n=this.prices.length;
        this.dp=grid([this.n+1],-1);
        return this.rec(0);
    }
}

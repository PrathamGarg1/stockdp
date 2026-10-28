class Solution {
    maxProfit(prices, startegy, k) {
        // atmost one modification    
        let n=prices.length;
        let simpleStrategy=Array(n).fill(prices[0]*startegy[0]);
        let pre=Array(n).fill(prices[0]);
        for(let i=1;i<n;i++){
            simpleStrategy[i]  = simpleStrategy[i-1] + prices[i]*startegy[i];
            pre[i]  = pre[i-1] + prices[i];
        }
        let normalStrategy = simpleStrategy[n-1];
        let ans=(pre[k-1]-pre[Math.floor(k/2)-1])-(simpleStrategy[k-1]);
        for(let i=1;k-1+i<n;i++){
            ans=Math.max(ans,(pre[k-1+i]-pre[Math.floor(k/2)-1+i])-(simpleStrategy[k-1+i]-simpleStrategy[i-1]));
        }
        return Math.max(normalStrategy,normalStrategy+ans);
    }
}

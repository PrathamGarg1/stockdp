class Solution {
    ngeIdx; nseIdx;

    n;
    dp;
    costs;
    rec(i){
        if(i==this.n) return 1e11;
        if(i==this.n-1) return this.costs[i];
        if(this.dp[i]!=-1) return this.dp[i];
        return this.dp[i]=this.costs[i]+Math.min(this.rec(this.ngeIdx[i]),this.rec(this.nseIdx[i]));
    }

    minCost(arr, cost) {
        this.costs=cost;
        this.n=arr.length;
        this.ngeIdx=Array(this.n).fill(this.n);
        this.nseIdx=Array(this.n).fill(this.n);
        let st=[];
        this.dp=grid([this.n+1],-1);
        for(let i=this.n-1;i>=0;i--){
            while(st.length && arr[st.at(-1)] < arr[i]) st.pop();
            if(st.length) this.ngeIdx[i]=st.at(-1);
            st.push(i);
        }
        while(st.length) st.pop();
        for(let i=this.n-1;i>=0;i--){
            while(st.length && arr[st.at(-1)] >= arr[i]) st.pop();
            if(st.length) this.nseIdx[i]=st.at(-1);
            st.push(i);
        }
        return this.rec(0)-cost[0];
    }
}

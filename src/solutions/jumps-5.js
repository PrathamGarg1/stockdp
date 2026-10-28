class Solution {

    n;
    ngeIdx;
    pgeIdx;
    d;
    dp;
    rec(i){
        // returns  the max len 
        if(i<0 || i>=this.n) return 0;
        if(this.dp[i]!=-1) return this.dp[i];
        let st = Math.max(0,i-this.d,this.pgeIdx[i]+1);
        let ed = Math.min(this.n-1,i+this.d,this.ngeIdx[i]-1);
        let ans=0;
        for(let j=st;j<=ed;j++){
            if(j!=i){
                ans=Math.max(ans,this.rec(j));
            }
        }
        return this.dp[i]=1+ans;
    }

    maxJumps(arr, d_){
        this.d=d_;
        this.n=arr.length;
        this.ngeIdx=Array(this.n).fill(this.n);
        this.pgeIdx=Array(this.n).fill(-1);


        let st=[];
        for(let i=0;i<this.n;i++){
            while(st.length && arr[st.at(-1)] < arr[i]){
                st.pop();
            }
            if(st.length) this.pgeIdx[i]=st.at(-1);
            st.push(i);
        }
        while(st.length) st.pop();

        for(let i=this.n-1;i>=0;i--){
            while(st.length && arr[st.at(-1)] < arr[i]){
                st.pop();
            }
            if(st.length) this.ngeIdx[i]=st.at(-1);
            st.push(i);
        }

        this.dp=grid([this.n+1],-1);
        let ans=0;
        for(let i=0;i<this.n;i++){
            ans=Math.max(ans,this.rec(i));
        }
        return ans;
        
    }
}

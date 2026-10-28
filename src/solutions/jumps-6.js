class mdq{
    dq=[];
    insert(val){
        while(this.dq.length && this.dq.at(-1) < val) this.dq.pop();
        this.dq.push(val);
    }

    maxv(){
        return this.dq[0];
    }

    remove(val){
        if(this.dq[0] == val) this.dq.shift();
    }

}

class Solution {
    maxResult(arr, k) {
        let n=arr.length;
        let dp=Array(n).fill(0);
        let md = new mdq();
        dp[0]=arr[0];
        md.insert(dp[0]);
        for(let i=1;i<n;i++){
            dp[i]  = arr[i]  + md.maxv();
            md.insert(dp[i]);
            if(i-k>=0) md.remove(dp[i-k]);
        }
        return dp[n-1];
    }
}

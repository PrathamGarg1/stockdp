class Solution {
    canReach(s, minj, maxj) {
        let n=s.length;
        let q=[];
        let dp=Array(n).fill(false);
        dp[0]=true;
        if(minj==1) q.push(1);
        for(let i=1;i<n;i++){
            dp[i] =( s[i]=='0') &&  q.length>0;
            if(i+1-minj>=0 && dp[i+1-minj]) q.push(1);
            if(i-maxj>=0 && dp[i-maxj]) q.shift();
        }
        return dp[n-1];
    }
}

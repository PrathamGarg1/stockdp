class Solution {

    dp;
    arr;
    pre;

    val(idx,l,r){
        return this.pre[r]-(l>0 ? this.pre[l-1] : 0)-this.arr[idx];
    }


    rec(l,r,turn){
        if(l>r) return 0;
        if(this.dp[l][r][turn]!=-1) return this.dp[l][r][turn];
        if(turn==1){
            return this.dp[l][r][turn] = Math.max(this.val(l,l,r) + this.rec(l+1,r,+!turn),this.val(r,l,r)+this.rec(l,r-1,+!turn));
        }
        return this.dp[l][r][turn] = Math.min(this.rec(l+1,r,+!turn)-this.val(l,l,r),this.rec(l,r-1,+!turn)-this.val(r,l,r));
    }


    stoneGameVII(ar) {
        this.arr=ar;
        let n=this.arr.length;
        this.dp=grid([n,n,2],-1);
        this.pre=Array(n).fill(this.arr[0]);
        for(let i=1;i<n;i++) this.pre[i]=this.pre[i-1]+this.arr[i];

        return this.rec(0,n-1,1);
    }
}

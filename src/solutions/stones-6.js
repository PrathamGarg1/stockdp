class Solution {
    stoneGameVI(a, b) {
        // a-b karo fir max nikalo 
        let n=a.length;
        let arr=[];
        for(let i=0;i<n;i++) arr.push([a[i],b[i]]);
        arr.sort((a,b)=>(b[0]+b[1])-(a[0]+a[1]));
        let ca=0;
        let cb=0;
        for(let i=0;i<n;i++){
            if(i%2==0) ca += arr[i][0];
            else cb += arr[i][1];
        }
        if(ca>cb) return 1;
        if(ca<cb) return -1;
        return 0;
    }
}

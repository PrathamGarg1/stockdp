class Solution {
    jump(arr) {
        let n=arr.length;
        // jitni baar paisa khatm hoga utne paisa chahiye 
        if(n==1) return 0;
        let i=0;
        let ans=0;
        let currpower=0;
        let maxpowergathered=0;
        while(i<n-1){ // assumes ki i par to ham aa skte hai
            maxpowergathered=Math.max(maxpowergathered-1,arr[i]);
            if(currpower==0){
                currpower = maxpowergathered;
                ans++;
            }
            currpower--;
            i++;
        }
        return ans;
    }
}

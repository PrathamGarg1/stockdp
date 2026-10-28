class Solution {
    canJump(arr) {
        let n=arr.length;
        let i=0;
        let bandwidth = 0;
        while(i<n-1){
            bandwidth=Math.max(bandwidth,arr[i]);
            if(!bandwidth) return false;
            bandwidth--;
            i++;
        }
        return true;
    }
}

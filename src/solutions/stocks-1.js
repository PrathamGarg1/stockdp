class Solution {
    maxProfit(arr) {
        let n=arr.length;
        let minPrice = 1e9;
        let ans=0;
        for(let i=0;i<n;i++){
            ans=Math.max(ans,arr[i]-minPrice);
            minPrice = Math.min(minPrice,arr[i]);
        }
        return ans;
    }
}

class Solution {
    maxProfit(arr) {
        let mintillnow = 1e9;
        let ans=0;
        for(let x of arr){
            if(x > mintillnow){
                ans += x-mintillnow;
                mintillnow=x;
            }
            else{
                mintillnow = x;
            }
        }
        return ans;
    }
}

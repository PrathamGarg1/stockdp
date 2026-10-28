class Solution {
public:
    int maxProfit(vector<int>& arr) {
        int mintillnow = 1e9;
        int ans=0;
        for(auto x:arr){
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
};

class Solution {
public:
    int maxProfit(vector<int>& arr) {
        int n=arr.size();
        int minPrice = 1e9;
        int ans=0;
        for(int i=0;i<n;i++){
            ans=max(ans,arr[i]-minPrice);
            minPrice = min(minPrice,arr[i]);
        }
        return ans;
    }
};

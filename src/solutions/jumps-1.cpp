class Solution {
public:
    bool canJump(vector<int>& arr) {
        int n=arr.size();
        int i=0;
        int bandwidth = 0;
        while(i<n-1){
            bandwidth=max(bandwidth,arr[i]);
            if(!bandwidth) return 0;
            bandwidth--;
            i++;
        }
        return true;
    }
};

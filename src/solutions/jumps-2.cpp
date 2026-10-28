class Solution {
public:
    int jump(vector<int>& arr) {
        int n=arr.size();
        // jitni baar paisa khatm hoga utne paisa chahiye 
        if(n==1) return 0;
        int i=0;
        int ans=0;
        int currpower=0;
        int maxpowergathered=0;
        while(i<n-1){ // assumes ki i par to ham aa skte hai
            maxpowergathered=max(maxpowergathered-1,arr[i]);
            if(currpower==0){
                currpower = maxpowergathered;
                ans++;
            }
            currpower--;
            i++;
        }
        return ans;
    }
};

class Solution {
public:
    vector<int> maxValue(vector<int>& arr) {
        int n=arr.size();
        vector<int>pre(n,arr[0]);
        vector<int>ans(n,-1);
        for(int i=1;i<n;i++){
            pre[i]=max(pre[i-1],arr[i]);
        }
        int i=n-1;
        while(i>=0){
            int j=i;
            int val = pre[j];
            ans[j]=val;
            int minv = arr[i];
            while(j-1>=0 && pre[j-1] > minv){
                ans[j-1]=val;
                minv=min(minv,arr[j-1]);
                j--;
            }
            i=j-1;
        }
        return ans;

    
    
    
    }
};

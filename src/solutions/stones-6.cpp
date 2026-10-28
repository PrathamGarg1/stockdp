class Solution {
public:
    int stoneGameVI(vector<int>& a, vector<int>& b) {
        // a-b karo fir max nikalo 
        int n=a.size();
        vector<pair<int,int>>arr;
        for(int i=0;i<n;i++) arr.push_back({a[i],b[i]});
        sort(arr.begin(),arr.end(),[&](pair<int,int>&a,pair<int,int>&b){
            return a.first+a.second>b.first+b.second;
        });
        int ca=0;
        int cb=0;
        for(int i=0;i<n;i++){
            if(i%2==0) ca += arr[i].first;
            else cb += arr[i].second;
        }
        if(ca>cb) return 1;
        if(ca<cb) return -1;
        return 0;
    }
};

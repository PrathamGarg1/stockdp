class mdq{
public:
    deque<int>dq;
    void insert(int val){
        while(!dq.empty() && dq.back() < val) dq.pop_back();
        dq.push_back(val);
    }

    int maxv(){
        return dq.front();
    }

    void remove(int val){
        if(dq.front() == val) dq.pop_front();
    }

};

class Solution {
public:
    int maxResult(vector<int>& arr, int k) {
        int n=arr.size();
        vector<int>dp(n,0);
        mdq md;
        dp[0]=arr[0];
        md.insert(dp[0]);
        for(int i=1;i<n;i++){
            dp[i]  = arr[i]  + md.maxv();
            md.insert(dp[i]);
            if(i-k>=0) md.remove(dp[i-k]);
        }
        return dp[n-1];
    }
};

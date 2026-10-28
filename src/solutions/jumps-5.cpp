class Solution {
public:

    int n;
    vector<int>ngeIdx;
    vector<int>pgeIdx;
    int d;
    int dp[1002];
    int rec(int i){
        // returns  the max len 
        if(i<0 || i>=n) return 0;
        if(dp[i]!=-1) return dp[i];
        int st = max({0,i-d,pgeIdx[i]+1});
        int ed = min({n-1,i+d,ngeIdx[i]-1});
        int ans=0;
        for(int j=st;j<=ed;j++){
            if(j!=i){
                ans=max(ans,rec(j));
            }
        }
        return dp[i]=1+ans;
    }

    int maxJumps(vector<int>& arr, int d_){
        d=d_;
        n=arr.size();
        ngeIdx.assign(n,n);
        pgeIdx.assign(n,-1);


        stack<int>st;
        for(int i=0;i<n;i++){
            while(!st.empty() && arr[st.top()] < arr[i]){
                st.pop();
            }
            if(!st.empty()) pgeIdx[i]=st.top();
            st.push(i);
        }
        while(!st.empty()) st.pop();

        for(int i=n-1;i>=0;i--){
            while(!st.empty() && arr[st.top()] < arr[i]){
                st.pop();
            }
            if(!st.empty()) ngeIdx[i]=st.top();
            st.push(i);
        }


        for(auto x:pgeIdx) cout<<x<<" ";
        cout<<endl;


        for(auto x:ngeIdx) cout<<x<<" ";
        cout<<endl;

        memset(dp,-1,sizeof(dp));
        int ans=0;
        for(int i=0;i<n;i++){
            ans=max(ans,rec(i));
        }
        return ans;
        
    }
};

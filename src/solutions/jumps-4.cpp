class Solution {
public:
    map<int,vector<int>>mp; // val, {idx,1}
    map<pair<int,int>,int>dist;
    int n;
    void bfs01(vector<int>& arr){
        deque<pair<int,int>>dq; // 0->idx, 1->value
        dq.push_back({0,0});

        dist[{0,0}]=0;

        while(!dq.empty()){
            auto [i,tag] = dq.front(); dq.pop_front();
            
            if(tag){
                for(auto idx:mp[i]){
                    if(!dist.count({idx,0}) ||  dist[{idx,0}]>dist[{i,tag}]){
                        dist[{idx,0}] = dist[{i,tag}];
                        dq.push_front({idx,0});
                    }
                }
            }


            else{

                if(i+1<n &&(!dist.count({i+1,0}) ||  dist[{i+1,0}]>dist[{i,0}]+1)){
                    dist[{i+1,0}] = dist[{i,0}]+1;
                    dq.push_back({i+1,0});
                }
                if(i-1>=0 &&(!dist.count({i-1,0}) ||  dist[{i-1,0}]>dist[{i,0}]+1)){
                    dist[{i-1,0}] = dist[{i,0}]+1;
                    dq.push_back({i-1,0});
                }
                int val = arr[i];
                if(!dist.count({val,1}) ||  dist[{val,1}]>dist[{i,0}]+1){
                    dist[{val,1}]=dist[{i,0}]+1;
                    dq.push_back({val,1});
                }

            }

        }


    }

    int minJumps(vector<int>& arr) {
        /// number of unique values 
        n=arr.size();
        for(int i = 0; i < n; i++) {
            mp[arr[i]].push_back(i);
        }
        bfs01(arr);
        return dist[{n-1,0}];
    }
};

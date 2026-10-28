class Solution {
    mp={}; // val, {idx,1}
    dist={};  // key [idx,tag] turns into the text "idx,tag"
    n;
    bfs01(arr){
        let dq=[]; // 0->idx, 1->value
        dq.push([0,0]);

        this.dist[[0,0]]=0;

        while(dq.length){
            let [i,tag] = dq[0]; dq.shift();
            
            if(tag){
                for(let idx of this.mp[i]){
                    if(!([idx,0] in this.dist) ||  this.dist[[idx,0]]>this.dist[[i,tag]]){
                        this.dist[[idx,0]] = this.dist[[i,tag]];
                        dq.unshift([idx,0]);
                    }
                }
            }


            else{

                if(i+1<this.n &&(!([i+1,0] in this.dist) ||  this.dist[[i+1,0]]>this.dist[[i,0]]+1)){
                    this.dist[[i+1,0]] = this.dist[[i,0]]+1;
                    dq.push([i+1,0]);
                }
                if(i-1>=0 &&(!([i-1,0] in this.dist) ||  this.dist[[i-1,0]]>this.dist[[i,0]]+1)){
                    this.dist[[i-1,0]] = this.dist[[i,0]]+1;
                    dq.push([i-1,0]);
                }
                let val = arr[i];
                if(!([val,1] in this.dist) ||  this.dist[[val,1]]>this.dist[[i,0]]+1){
                    this.dist[[val,1]]=this.dist[[i,0]]+1;
                    dq.push([val,1]);
                }

            }

        }


    }

    minJumps(arr) {
        /// number of unique values 
        this.n=arr.length;
        for(let i = 0; i < this.n; i++) {
            (this.mp[arr[i]] ??= []).push(i);
        }
        this.bfs01(arr);
        return this.dist[[this.n-1,0]];
    }
}

class Solution {
    maxProfit(arr) {
        let n = arr.length;
        let before = grid([2]);
        let after = grid([2]);
        let nextafter = grid([2]);

        for (let state = 0; state < 2; state++) {
            nextafter[state] = 0;
            after[state] = 0;
        }

        for (let i = n - 1; i >= 0; i--) {
            for (let state = 0; state < 2; state++) {
                let ans = after[state];
                if (state == 0 ) ans = Math.max(ans, -arr[i] + after[1]);
                if (state == 1) ans = Math.max(ans, arr[i] + nextafter[0]);
                before[state] = ans;
            }
            [after,nextafter] = [nextafter,after];
            [after,before] = [before,after];
        }

        return after[0];
    }
}

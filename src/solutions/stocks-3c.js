class Solution {
    maxProfit(arr) {
        let n = arr.length;
        let before = grid([3,2]);
        let after = grid([3,2]);

        for (let remk = 0; remk <= 2; remk++) {
            for (let state = 0; state < 2; state++) {
                after[remk][state] = 0;
            }
        }

        for (let i = n - 1; i >= 0; i--) {
            for (let remk = 0; remk <= 2; remk++) {
                for (let state = 0; state < 2; state++) {
                    let ans = after[remk][state];
                    if (state == 0 && remk)
                        ans = Math.max(ans, -arr[i] + after[remk - 1][1]);
                    if (state == 1)
                        ans = Math.max(ans, arr[i] + after[remk][0]);
                    before[remk][state] = ans;
                }
            }
            [after,before] = [before,after];
        }

        return Math.max(after[1][0],after[2][0]);
    }
}

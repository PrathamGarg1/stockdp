import React, { useState } from 'react';
import { Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const algorithms = {
  'Best Time to Buy and Sell Stock': {
    id: 'stock1',
    description: 'Single transaction - Time: O(n), Space: O(1)',
    cppCode: `int maxProfit(vector<int>& prices) {
    int mintillnow = prices[0];
    int ans = 0;
    
    for(int i = 1; i < prices.size(); i++) {
        if(prices[i] > mintillnow) 
            ans = max(ans, prices[i] - mintillnow);
        else 
            mintillnow = prices[i];
    }
    return ans;
}`,
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 7,1,5,3,6,4)',
        required: true
      }
    ],
    solve: (arr) => {
      const n = arr.length;
      if (n <= 1) return { maxProfit: 0, steps: [] };
      
      const steps = [];
      let mintillnow = arr[0];
      let ans = 0;
      
      steps.push({
        i: 0,
        price: arr[0],
        mintillnow,
        ans
      });
      
      for (let i = 1; i < n; i++) {
        if (arr[i] > mintillnow) {
          ans = Math.max(ans, arr[i] - mintillnow);
        } else {
          mintillnow = arr[i];
        }
        
        steps.push({
          i,
          price: arr[i],
          mintillnow,
          ans
        });
      }
      
      return { maxProfit: ans, steps };
    }
  },
  
  'Best Time to Buy and Sell Stock II': {
    id: 'stock2',
    description: 'Unlimited transactions - Time: O(n), Space: O(1)',
    cppCode: `int maxProfit(vector<int>& prices) {
    int n = prices.size();
    vector<int> curr(2, 0), after(2, 0);
    
    for(int i = n-1; i >= 0; i--) {
        for(int canbuy = 0; canbuy < 2; canbuy++) {
            if(canbuy) 
                curr[canbuy] = max(-prices[i] + after[0], after[1]);
            else 
                curr[canbuy] = max(prices[i] + after[1], after[0]);
        }
        after = curr;
    }
    return curr[1];
}`,
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 7,1,5,3,6,4)',
        required: true
      }
    ],
    solve: (arr) => {
      const n = arr.length;
      if (n <= 1) return { maxProfit: 0, steps: [] };
      
      const steps = [];
      let curr = [0, 0];
      let after = [0, 0];
      
      for (let i = n - 1; i >= 0; i--) {
        for (let canbuy = 0; canbuy < 2; canbuy++) {
          if (canbuy) {
            curr[canbuy] = Math.max(-arr[i] + after[0], after[1]);
          } else {
            curr[canbuy] = Math.max(arr[i] + after[1], after[0]);
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          curr: [...curr],
          after: [...after]
        });
        
        after = [...curr];
      }
      
      return { maxProfit: curr[1], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock III': {
    id: 'stock3',
    description: 'At most 2 transactions - Time: O(n), Space: O(1)',
    cppCode: `int maxProfit(vector<int>& prices) {
    int n = prices.size();
    int k = 2;
    vector<vector<int>> curr(2, vector<int>(k+1, 0));
    vector<vector<int>> after(2, vector<int>(k+1, 0));
    
    for(int i = n-1; i >= 0; i--) {
        for(int canbuy = 0; canbuy < 2; canbuy++) {
            for(int t = 1; t <= k; t++) {
                if(canbuy) 
                    curr[canbuy][t] = max(-prices[i] + after[0][t], after[1][t]);
                else 
                    curr[canbuy][t] = max(prices[i] + after[1][t-1], after[0][t]);
            }
        }
        after = curr;
    }
    return curr[1][k];
}`,
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 3,3,5,0,0,3,1,4)',
        required: true
      }
    ],
    solve: (arr) => {
      const n = arr.length;
      if (n <= 1) return { maxProfit: 0, steps: [] };
      
      const k = 2;
      const steps = [];
      let curr = Array(2).fill(0).map(() => Array(k + 1).fill(0));
      let after = Array(2).fill(0).map(() => Array(k + 1).fill(0));
      
      for (let i = n - 1; i >= 0; i--) {
        for (let canbuy = 0; canbuy < 2; canbuy++) {
          for (let t = 1; t <= k; t++) {
            if (canbuy) {
              curr[canbuy][t] = Math.max(-arr[i] + after[0][t], after[1][t]);
            } else {
              curr[canbuy][t] = Math.max(arr[i] + after[1][t - 1], after[0][t]);
            }
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          curr: curr.map(row => [...row]),
          after: after.map(row => [...row])
        });
        
        after = curr.map(row => [...row]);
      }
      
      return { maxProfit: curr[1][k], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock IV': {
    id: 'stock4',
    description: 'At most k transactions - Time: O(n*k), Space: O(k)',
    cppCode: `int maxProfit(int k, vector<int>& prices) {
    int n = prices.size();
    vector<vector<int>> curr(2, vector<int>(k+1, 0));
    vector<vector<int>> after(2, vector<int>(k+1, 0));
    
    for(int i = n-1; i >= 0; i--) {
        for(int canbuy = 0; canbuy < 2; canbuy++) {
            for(int t = 1; t <= k; t++) {
                if(canbuy) 
                    curr[canbuy][t] = max(-prices[i] + after[0][t], after[1][t]);
                else 
                    curr[canbuy][t] = max(prices[i] + after[1][t-1], after[0][t]);
            }
        }
        after = curr;
    }
    return curr[1][k];
}`,
    inputs: [
      {
        name: 'k',
        type: 'number',
        label: 'Max Transactions (k)',
        placeholder: 'Enter k (e.g., 2)',
        required: true
      },
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 2,4,1)',
        required: true
      }
    ],
    solve: (k, arr) => {
      const n = arr.length;
      if (n <= 1 || k === 0) return { maxProfit: 0, steps: [] };
      
      const steps = [];
      let curr = Array(2).fill(0).map(() => Array(k + 1).fill(0));
      let after = Array(2).fill(0).map(() => Array(k + 1).fill(0));
      
      for (let i = n - 1; i >= 0; i--) {
        for (let canbuy = 0; canbuy < 2; canbuy++) {
          for (let t = 1; t <= k; t++) {
            if (canbuy) {
              curr[canbuy][t] = Math.max(-arr[i] + after[0][t], after[1][t]);
            } else {
              curr[canbuy][t] = Math.max(arr[i] + after[1][t - 1], after[0][t]);
            }
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          k,
          curr: curr.map(row => [...row]),
          after: after.map(row => [...row])
        });
        
        after = curr.map(row => [...row]);
      }
      
      return { maxProfit: curr[1][k], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock with Cooldown': {
    id: 'cooldown',
    description: 'With cooldown - Time: O(n), Space: O(1)',
    cppCode: `int maxProfit(vector<int>& prices) {
    int n = prices.size();
    vector<int> curr(2, 0), after(2, 0), moreafter(2, 0);
    
    for(int i = n-1; i >= 0; i--) {
        for(int canbuy = 0; canbuy < 2; canbuy++) {
            if(canbuy) 
                curr[canbuy] = max(-prices[i] + after[0], after[1]);
            else 
                curr[canbuy] = max(prices[i] + moreafter[1], after[0]);
        }
        moreafter = after;
        after = curr;
    }
    return curr[1];
}`,
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 1,2,3,0,2)',
        required: true
      }
    ],
    solve: (arr) => {
      const n = arr.length;
      if (n <= 1) return { maxProfit: 0, steps: [] };
      
      const steps = [];
      let curr = [0, 0];
      let after = [0, 0];
      let moreafter = [0, 0];
      
      for (let i = n - 1; i >= 0; i--) {
        for (let canbuy = 0; canbuy < 2; canbuy++) {
          if (canbuy) {
            curr[canbuy] = Math.max(-arr[i] + after[0], after[1]);
          } else {
            curr[canbuy] = Math.max(arr[i] + moreafter[1], after[0]);
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          curr: [...curr],
          after: [...after],
          moreafter: [...moreafter]
        });
        
        moreafter = [...after];
        after = [...curr];
      }
      
      return { maxProfit: curr[1], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock with Transaction Fee': {
    id: 'fee',
    description: 'With transaction fee - Time: O(n), Space: O(1)',
    cppCode: `int maxProfit(vector<int>& prices, int fee) {
    int n = prices.size();
    vector<int> curr(2, 0), after(2, 0);
    
    for(int i = n-1; i >= 0; i--) {
        for(int canbuy = 0; canbuy < 2; canbuy++) {
            if(canbuy) 
                curr[canbuy] = max(-prices[i] + after[0], after[1]);
            else 
                curr[canbuy] = max(prices[i] - fee + after[1], after[0]);
        }
        after = curr;
    }
    return curr[1];
}`,
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 1,3,2,8,4,9)',
        required: true
      },
      {
        name: 'fee',
        type: 'number',
        label: 'Transaction Fee',
        placeholder: 'Enter fee (e.g., 2)',
        required: true
      }
    ],
    solve: (arr, fee) => {
      const n = arr.length;
      if (n <= 1) return { maxProfit: 0, steps: [] };
      
      const steps = [];
      let curr = [0, 0];
      let after = [0, 0];
      
      for (let i = n - 1; i >= 0; i--) {
        for (let canbuy = 0; canbuy < 2; canbuy++) {
          if (canbuy) {
            curr[canbuy] = Math.max(-arr[i] + after[0], after[1]);
          } else {
            curr[canbuy] = Math.max(arr[i] - fee + after[1], after[0]);
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          fee,
          curr: [...curr],
          after: [...after]
        });
        
        after = [...curr];
      }
      
      return { maxProfit: curr[1], steps };
    }
  },

  'Best Time to Buy and Sell Stock V': {
    id: 'three_state',
    description: '3-state DP - Time: O(n*k), Space: O(k)',
    cppCode: `int maxProfit(int k, vector<int>& prices) {
    int n = prices.size();
    vector<vector<int>> curr(3, vector<int>(k+1, 0));
    vector<vector<int>> after(3, vector<int>(k+1, 0));
    
    for(int t = 0; t <= k; t++) {
        after[1][t] = after[2][t] = -1e9;
    }
    
    for(int i = n-1; i >= 0; i--) {
        for(int state = 0; state <= 2; state++) {
            for(int t = 1; t <= k; t++) {
                if(state == 0) 
                    curr[state][t] = max({after[0][t], prices[i] + after[1][t], -prices[i] + after[2][t]});
                else if(state == 1) 
                    curr[state][t] = max(after[1][t], -prices[i] + after[0][t-1]);
                else 
                    curr[state][t] = max(after[2][t], prices[i] + after[0][t-1]);
            }
        }
        after = curr;
    }
    return curr[0][k];
}`,
    inputs: [
      {
        name: 'k',
        type: 'number',
        label: 'Max Transactions (k)',
        placeholder: 'Enter k (e.g., 2)',
        required: true
      },
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 1,3,2,8,4,9)',
        required: true
      }
    ],
    solve: (k, arr) => {
      const n = arr.length;
      if (n <= 1 || k === 0) return { maxProfit: 0, steps: [] };
      
      const steps = [];
      let curr = Array(3).fill(0).map(() => Array(k + 1).fill(0));
      let after = Array(3).fill(0).map(() => Array(k + 1).fill(0));
      
      for (let t = 0; t <= k; t++) {
        after[1][t] = -1e9;
        after[2][t] = -1e9;
      }
      
      for (let i = n - 1; i >= 0; i--) {
        for (let state = 0; state <= 2; state++) {
          for (let t = 1; t <= k; t++) {
            if (state === 0) {
              curr[state][t] = Math.max(
                after[0][t],
                arr[i] + after[1][t],
                -arr[i] + after[2][t]
              );
            } else if (state === 1) {
              curr[state][t] = Math.max(
                after[1][t],
                -arr[i] + after[0][t - 1]
              );
            } else {
              curr[state][t] = Math.max(
                after[2][t],
                arr[i] + after[0][t - 1]
              );
            }
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          k,
          curr: curr.map(row => [...row]),
          after: after.map(row => [...row])
        });
        
        after = curr.map(row => [...row]);
      }
      
      return { maxProfit: curr[0][k], steps };
    }
  }
};

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Best Time to Buy and Sell Stock');
  const [inputValues, setInputValues] = useState({});
  const [result, setResult] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const algorithm = algorithms[selectedAlgorithm];

  const handleInputChange = (name, value) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  const parseInput = (value, type) => {
    if (type === 'array') {
      return value.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    }
    if (type === 'number') {
      const num = parseInt(value);
      return isNaN(num) ? 0 : num;
    }
    return value;
  };

  const runAlgorithm = () => {
    const inputs = [];
    let isValid = true;

    algorithm.inputs.forEach(input => {
      const value = inputValues[input.name];
      if (input.required && (!value || value.trim() === '')) {
        isValid = false;
        return;
      }
      const parsedValue = parseInput(value, input.type);
      if (input.type === 'array' && parsedValue.length === 0) {
        isValid = false;
        return;
      }
      inputs.push(parsedValue);
    });

    if (!isValid) {
      alert('Please fill in all required fields with valid values');
      return;
    }

    try {
      const result = algorithm.solve(...inputs);
      setResult(result);
      setCurrentStep(0);
    } catch (error) {
      console.error('Algorithm execution error:', error);
      alert('Error running algorithm: ' + error.message);
    }
  };

  const reset = () => {
    setResult(null);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = result?.steps[currentStep];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Stock Trading DP Visualizer</h1>
        
        {/* Algorithm Selection */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Algorithm</h2>
          <select 
            value={selectedAlgorithm}
            onChange={(e) => {
              setSelectedAlgorithm(e.target.value);
              setResult(null);
              setInputValues({});
            }}
            className="w-full p-3 border border-gray-300 rounded-md mb-4"
          >
            {Object.keys(algorithms).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <p className="text-gray-600 mb-4">{algorithm.description}</p>
          
          {/* C++ Code Display */}
          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold mb-2">C++ Code:</h3>
            <pre className="text-xs font-mono overflow-x-auto">{algorithm.cppCode}</pre>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Input</h2>
          {algorithm.inputs.map(input => (
            <div key={input.name} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {input.label} {input.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={inputValues[input.name] || ''}
                onChange={(e) => handleInputChange(input.name, e.target.value)}
                placeholder={input.placeholder}
                className="w-full p-3 border border-gray-300 rounded-md"
              />
            </div>
          ))}
          <div className="flex gap-4 mt-4">
            <button
              onClick={runAlgorithm}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
            >
              <Play size={16} />
              Run Algorithm
            </button>
            <button
              onClick={reset}
              className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {result && (
          <>
            {/* Result Summary */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Result</h2>
              <p className="text-lg"><strong>Maximum Profit:</strong> ${result.maxProfit}</p>
            </div>

            {/* Step Controls */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Step Navigation</h2>
              <div className="flex items-center gap-4 mb-4">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep >= result.steps.length - 1}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50 flex items-center gap-2"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
                <span className="text-gray-600">
                  Step {currentStep + 1} of {result.steps.length}
                </span>
              </div>
            </div>

            {/* Arrays Visualization */}
            {currentStepData && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Current Step: i={currentStepData.i}, price={currentStepData.price}</h2>
                
                {/* Stock I */}
                {selectedAlgorithm === 'Best Time to Buy and Sell Stock' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-100 rounded">
                      <div className="text-sm font-bold">mintillnow</div>
                      <div className="text-2xl font-mono">{currentStepData.mintillnow}</div>
                    </div>
                    <div className="p-3 bg-green-100 rounded">
                      <div className="text-sm font-bold">ans</div>
                      <div className="text-2xl font-mono">{currentStepData.ans}</div>
                    </div>
                  </div>
                )}

                {/* Stock II, Fee */}
                {(selectedAlgorithm.includes('Stock II') || selectedAlgorithm.includes('Fee')) && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">curr:</span>
                      {currentStepData.curr.map((val, idx) => (
                        <div key={idx} className="bg-purple-200 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">after:</span>
                      {currentStepData.after.map((val, idx) => (
                        <div key={idx} className="bg-purple-100 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cooldown */}
                {selectedAlgorithm.includes('Cooldown') && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">curr:</span>
                      {currentStepData.curr.map((val, idx) => (
                        <div key={idx} className="bg-purple-200 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">after:</span>
                      {currentStepData.after.map((val, idx) => (
                        <div key={idx} className="bg-purple-100 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">moreafter:</span>
                      {currentStepData.moreafter.map((val, idx) => (
                        <div key={idx} className="bg-yellow-100 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock III, IV, V - 2D arrays */}
                {(selectedAlgorithm.includes('Stock III') || selectedAlgorithm.includes('Stock IV') || selectedAlgorithm.includes('Stock V')) && (
                  <div className="space-y-4">
                    <div>
                      <div className="font-bold text-sm mb-2">curr array:</div>
                      <div className="space-y-1">
                        {currentStepData.curr.map((row, rowIdx) => (
                          <div key={rowIdx} className="flex gap-1">
                            <span className="font-mono text-xs">[{rowIdx}]:</span>
                            {row.map((val, colIdx) => (
                              <div key={colIdx} className="bg-green-200 px-2 py-1 rounded font-mono text-xs">
                                [{colIdx}]:{val}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-bold text-sm mb-2">after array:</div>
                      <div className="space-y-1">
                        {currentStepData.after.map((row, rowIdx) => (
                          <div key={rowIdx} className="flex gap-1">
                            <span className="font-mono text-xs">[{rowIdx}]:</span>
                            {row.map((val, colIdx) => (
                              <div key={colIdx} className="bg-green-100 px-2 py-1 rounded font-mono text-xs">
                                [{colIdx}]:{val === -1e9 ? '-∞' : val}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Final Result</h2>
              <div className="text-3xl font-bold text-green-600">Maximum Profit: ${result.maxProfit}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
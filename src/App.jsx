import React, { useState } from 'react';
import { Play, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

const algorithms = {
  'Best Time to Buy and Sell Stock': {
    id: 'stock1',
    description: 'Single transaction with mintillnow tracking',
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
        arrays: { mintillnow, ans },
        explanation: `i=0, arr[0]=${arr[0]}, Initialize`,
        logic: 'int mintillnow=arr[0]; int ans=0;'
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
          arrays: { mintillnow, ans },
          explanation: `i=${i}, arr[i]=${arr[i]}`,
          logic: arr[i] > mintillnow ? 
            'if(arr[i]>mintillnow) ans=max(ans,arr[i]-mintillnow);' : 
            'else mintillnow=arr[i];'
        });
      }
      
      return { maxProfit: ans, steps };
    }
  },
  
  'Best Time to Buy and Sell Stock II': {
    id: 'stock2',
    description: 'Unlimited transactions with curr[2] and after[2] arrays',
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
      let curr = [0, 0]; // [canbuy=0, canbuy=1]
      let after = [0, 0];
      
      for (let i = n - 1; i >= 0; i--) {
        const oldCurr = [...curr];
        const oldAfter = [...after];
        
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
          arrays: {
            curr: [...curr],
            after: [...oldAfter]
          },
          explanation: `i=${i}, price=${arr[i]}`,
          logic: 'if(canbuy) curr[canbuy]=max(-arr[i]+after[0],after[1]); else curr[canbuy]=max(arr[i]+after[1],after[0]);'
        });
        
        after = [...curr];
      }
      
      return { maxProfit: curr[1], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock III': {
    id: 'stock3',
    description: 'At most 2 transactions with curr[2][3] and after[2][3] arrays',
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
      
      const k = 2; // exactly 2 transactions
      const steps = [];
      let curr = Array(2).fill(0).map(() => Array(k + 1).fill(0));
      let after = Array(2).fill(0).map(() => Array(k + 1).fill(0));
      
      for (let i = n - 1; i >= 0; i--) {
        const oldAfter = after.map(row => [...row]);
        
        for (let canbuy = 0; canbuy < 2; canbuy++) {
          for (let transactionsleft = 1; transactionsleft <= k; transactionsleft++) {
            if (canbuy) {
              curr[canbuy][transactionsleft] = Math.max(
                -arr[i] + after[0][transactionsleft],
                after[1][transactionsleft]
              );
            } else {
              curr[canbuy][transactionsleft] = Math.max(
                arr[i] + after[1][transactionsleft - 1],
                after[0][transactionsleft]
              );
            }
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          arrays: {
            curr: curr.map(row => [...row]),
            after: oldAfter
          },
          explanation: `i=${i}, price=${arr[i]}, k=2 transactions`,
          logic: 'if(canbuy) curr[canbuy][t]=max(-arr[i]+after[0][t],after[1][t]); else curr[canbuy][t]=max(arr[i]+after[1][t-1],after[0][t]);'
        });
        
        after = curr.map(row => [...row]);
      }
      
      return { maxProfit: curr[1][k], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock IV': {
    id: 'stock4',
    description: 'At most k transactions with curr[2][k+1] and after[2][k+1] arrays',
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
        const oldAfter = after.map(row => [...row]);
        
        for (let canbuy = 0; canbuy < 2; canbuy++) {
          for (let transactionsleft = 1; transactionsleft <= k; transactionsleft++) {
            if (canbuy) {
              curr[canbuy][transactionsleft] = Math.max(
                -arr[i] + after[0][transactionsleft],
                after[1][transactionsleft]
              );
            } else {
              curr[canbuy][transactionsleft] = Math.max(
                arr[i] + after[1][transactionsleft - 1],
                after[0][transactionsleft]
              );
            }
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          k,
          arrays: {
            curr: curr.map(row => [...row]),
            after: oldAfter
          },
          explanation: `i=${i}, price=${arr[i]}, k=${k} transactions`,
          logic: 'if(canbuy) curr[canbuy][t]=max(-arr[i]+after[0][t],after[1][t]); else curr[canbuy][t]=max(arr[i]+after[1][t-1],after[0][t]);'
        });
        
        after = curr.map(row => [...row]); // after=curr;
      }
      
      return { maxProfit: curr[1][k], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock with Cooldown': {
    id: 'cooldown',
    description: 'With cooldown using curr[2], after[2], and moreafter[2] arrays',
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
        const oldAfter = [...after];
        const oldMoreafter = [...moreafter];
        
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
          arrays: {
            curr: [...curr],
            after: [...oldAfter],
            moreafter: [...oldMoreafter]
          },
          explanation: `i=${i}, arr[i]=${arr[i]}`,
          logic: 'if(canbuy) curr[canbuy]=max(-arr[i]+after[0],after[1]); else curr[canbuy]=max(arr[i]+moreafter[1],after[0]);'
        });
        
        moreafter = [...after];
        after = [...curr];
      }
      
      return { maxProfit: curr[1], steps };
    }
  },
  
  'Best Time to Buy and Sell Stock with Transaction Fee': {
    id: 'fee',
    description: 'With transaction fee using curr[2] and after[2] arrays',
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
        const oldAfter = [...after];
        
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
          arrays: {
            curr: [...curr],
            after: [...oldAfter]
          },
          explanation: `i=${i}, price=${arr[i]}, fee=${fee}`,
          logic: 'if(canbuy) curr[canbuy]=max(-arr[i]+after[0],after[1]); else curr[canbuy]=max(arr[i]-fee+after[1],after[0]);'
        });
        
        after = [...curr]; // after=curr;
      }
      
      return { maxProfit: curr[1], steps };
    }
  },

  'Best Time to Buy and Sell Stock V': {
    id: 'three_state',
    description: '3-state DP with curr[3][k+1] and after[3][k+1] arrays',
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
      
      for (let transactionsleft = 0; transactionsleft <= k; transactionsleft++) {
        after[1][transactionsleft] = -1e9;
        after[2][transactionsleft] = -1e9;
      }
      
      for (let i = n - 1; i >= 0; i--) {
        const oldAfter = after.map(row => [...row]);
        
        for (let state = 0; state <= 2; state++) {
          for (let transactionsleft = 1; transactionsleft <= k; transactionsleft++) {
            if (state === 0) {
              curr[state][transactionsleft] = Math.max(
                after[0][transactionsleft],
                arr[i] + after[1][transactionsleft],
                -arr[i] + after[2][transactionsleft]
              );
            } else if (state === 1) {
              curr[state][transactionsleft] = Math.max(
                after[1][transactionsleft],
                -arr[i] + after[0][transactionsleft - 1]
              );
            } else {
              curr[state][transactionsleft] = Math.max(
                after[2][transactionsleft],
                arr[i] + after[0][transactionsleft - 1]
              );
            }
          }
        }
        
        steps.push({
          i,
          price: arr[i],
          k,
          arrays: {
            curr: curr.map(row => [...row]),
            after: oldAfter
          },
          explanation: `i=${i}, arr[i]=${arr[i]}, 3-state DP`,
          logic: 'if(state==0) max({after[0][t],arr[i]+after[1][t],-arr[i]+after[2][t]}); else if(state==1) max(after[1][t],-arr[i]+after[0][t-1]); else max(after[2][t],arr[i]+after[0][t-1]);'
        });
        
        after = curr.map(row => [...row]); // after=curr;
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
  const [isPlaying, setIsPlaying] = useState(false);

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
      setIsPlaying(false);
    } catch (error) {
      console.error('Algorithm execution error:', error);
      alert('Error running algorithm: ' + error.message);
    }
  };

  const reset = () => {
    setResult(null);
    setCurrentStep(0);
    setIsPlaying(false);
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

  const play = () => {
    setIsPlaying(true);
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= result.steps.length - 1) {
          setIsPlaying(false);
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
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
            className="w-full p-3 border border-gray-300 rounded-md"
          >
            {Object.keys(algorithms).map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <p className="mt-2 text-gray-600">{algorithm.description}</p>
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
              <h2 className="text-xl font-semibold mb-4">Step-by-Step Visualization</h2>
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
                  onClick={isPlaying ? () => setIsPlaying(false) : play}
                  disabled={currentStep >= result.steps.length - 1}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Play size={16} />
                  {isPlaying ? 'Pause' : 'Play'}
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

            {/* SIMPLE ARRAYS VISUALIZATION - Only how numbers change */}
            {currentStepData && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Arrays State - How Numbers Change</h2>
                
                <div className="mb-4 p-3 bg-gray-100 rounded">
                  <div className="font-mono text-sm">{currentStepData.explanation}</div>
                  {currentStepData.logic && <div className="font-mono text-xs text-blue-600 mt-1">{currentStepData.logic}</div>}
                </div>

                {/* Stock I - mintillnow, ans */}
                {selectedAlgorithm === 'Best Time to Buy and Sell Stock' && currentStepData.arrays && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-100 rounded">
                      <div className="text-sm font-bold">mintillnow</div>
                      <div className="text-3xl font-mono">{currentStepData.arrays.mintillnow}</div>
                    </div>
                    <div className="p-3 bg-green-100 rounded">
                      <div className="text-sm font-bold">ans</div>
                      <div className="text-3xl font-mono">{currentStepData.arrays.ans}</div>
                    </div>
                  </div>
                )}

                {/* Stock II, Fee - curr[2], after[2] */}
                {(selectedAlgorithm.includes('Stock II') || selectedAlgorithm.includes('Fee')) && currentStepData.arrays && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">curr:</span>
                      {currentStepData.arrays.curr.map((val, idx) => (
                        <div key={idx} className="bg-purple-200 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">after:</span>
                      {currentStepData.arrays.after.map((val, idx) => (
                        <div key={idx} className="bg-purple-100 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Cooldown - curr[2], after[2], moreafter[2] */}
                {selectedAlgorithm.includes('Cooldown') && currentStepData.arrays && (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">curr:</span>
                      {currentStepData.arrays.curr.map((val, idx) => (
                        <div key={idx} className="bg-purple-200 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">after:</span>
                      {currentStepData.arrays.after.map((val, idx) => (
                        <div key={idx} className="bg-purple-100 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-sm">moreafter:</span>
                      {currentStepData.arrays.moreafter.map((val, idx) => (
                        <div key={idx} className="bg-yellow-100 px-3 py-2 rounded font-mono">[{idx}]: {val}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock III, IV, V - 2D arrays curr[rows][cols], after[rows][cols] */}
                {(selectedAlgorithm.includes('Stock III') || selectedAlgorithm.includes('Stock IV') || selectedAlgorithm.includes('Stock V')) && currentStepData.arrays && (
                  <div className="space-y-4">
                    <div>
                      <div className="font-bold text-sm mb-2">curr array:</div>
                      <div className="space-y-1">
                        {currentStepData.arrays.curr.map((row, rowIdx) => (
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
                        {currentStepData.arrays.after.map((row, rowIdx) => (
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

                {/* Show the result for this step */}
                <div className="mt-4 p-2 bg-yellow-50 rounded">
                  <span className="font-bold text-sm">
                    {selectedAlgorithm === 'Best Time to Buy and Sell Stock' && `Result so far: ${currentStepData.arrays?.ans || 0}`}
                    {selectedAlgorithm.includes('Stock II') && `Current profit: curr[1] = ${currentStepData.arrays?.curr[1] || 0}`}
                    {selectedAlgorithm.includes('Stock III') && `Current profit: curr[1][2] = ${currentStepData.arrays?.curr[1]?.[2] || 0}`}
                    {selectedAlgorithm.includes('Stock IV') && `Current profit: curr[1][k] = ${currentStepData.arrays?.curr[1]?.[currentStepData.k] || 0}`}
                    {selectedAlgorithm.includes('Cooldown') && `Current profit: curr[1] = ${currentStepData.arrays?.curr[1] || 0}`}
                    {selectedAlgorithm.includes('Fee') && `Current profit: curr[1] = ${currentStepData.arrays?.curr[1] || 0}`}
                    {selectedAlgorithm.includes('Stock V') && `Current profit: curr[0][k] = ${currentStepData.arrays?.curr[0]?.[currentStepData.k] || 0}`}
                  </span>
                </div>
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
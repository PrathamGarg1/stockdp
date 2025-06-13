import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Download, AlertCircle, Plus, X } from 'lucide-react';

const algorithms= {
  'Best Time to Buy and Sell Stock': {
    id: 'stock1',
    description: 'Single transaction allowed - find maximum profit',
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 7,1,5,3,6,4)',
        required: true
      }
    ],
    solve: (prices) => {
      const n = prices.length;
      const dp = Array(n).fill(0).map(() => [0, 0]); // [hold, sold]
      const steps = [];
      const transactions = [];
      
      dp[0][0] = -prices[0];
      dp[0][1] = 0;
      
      steps.push({
        day: 0,
        dp: JSON.parse(JSON.stringify(dp)),
        explanation: `Day 0: Initialize - Buy stock for $${prices[0]}`,
        action: 'BUY',
        price: prices[0],
        formula: 'dp[0][0] = -prices[0], dp[0][1] = 0',
        calculation: `dp[0][0] = -${prices[0]} = ${dp[0][0]}, dp[0][1] = 0`
      });
      
      let buyDay = 0;
      
      for (let i = 1; i < n; i++) {
        const prevHold = dp[i-1][0];
        const prevSold = dp[i-1][1];
        
        dp[i][0] = Math.max(prevHold, -prices[i]);
        dp[i][1] = Math.max(prevSold, prevHold + prices[i]);
        
        let action = 'HOLD';
        let formula = `dp[${i}][0] = max(dp[${i-1}][0], -prices[${i}]), dp[${i}][1] = max(dp[${i-1}][1], dp[${i-1}][0] + prices[${i}])`;
        let calculation = `dp[${i}][0] = max(${prevHold}, -${prices[i]}) = ${dp[i][0]}, dp[${i}][1] = max(${prevSold}, ${prevHold} + ${prices[i]}) = ${dp[i][1]}`;
        
        if (dp[i][0] > prevHold) {
          action = 'BUY';
          buyDay = i;
        } else if (dp[i][1] > prevSold) {
          action = 'SELL';
          if (buyDay !== -1) {
            transactions.push({
              buyDay,
              sellDay: i,
              profit: prices[i] - prices[buyDay]
            });
          }
        }
        
        steps.push({
          day: i,
          dp: JSON.parse(JSON.stringify(dp)),
          explanation: `Day ${i}: Price $${prices[i]} - ${action}. Max profit: $${dp[i][1]}`,
          action,
          price: prices[i],
          formula,
          calculation
        });
      }
      
      return { maxProfit: dp[n-1][1], steps, transactions };
    }
  },
  'Best Time to Buy and Sell Stock II': {
    id: 'stock2',
    description: 'Unlimited transactions allowed',
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 7,1,5,3,6,4)',
        required: true
      }
    ],
    solve: (prices) => {
      const n = prices.length;
      const dp = Array(n).fill(0).map(() => [0, 0]);
      const steps = [];
      const transactions = [];
      
      dp[0][0] = -prices[0];
      dp[0][1] = 0;
      
      steps.push({
        day: 0,
        dp: JSON.parse(JSON.stringify(dp)),
        explanation: `Day 0: Initialize - Buy stock for $${prices[0]}`,
        action: 'BUY',
        price: prices[0],
        formula: 'dp[0][0] = -prices[0], dp[0][1] = 0',
        calculation: `dp[0][0] = -${prices[0]} = ${dp[0][0]}, dp[0][1] = 0`
      });
      
      let lastBuyDay = 0;
      
      for (let i = 1; i < n; i++) {
        const prevHold = dp[i-1][0];
        const prevSold = dp[i-1][1];
        
        dp[i][0] = Math.max(prevHold, prevSold - prices[i]);
        dp[i][1] = Math.max(prevSold, prevHold + prices[i]);
        
        let action = 'HOLD';
        let formula = `dp[${i}][0] = max(dp[${i-1}][0], dp[${i-1}][1] - prices[${i}]), dp[${i}][1] = max(dp[${i-1}][1], dp[${i-1}][0] + prices[${i}])`;
        let calculation = `dp[${i}][0] = max(${prevHold}, ${prevSold} - ${prices[i]}) = ${dp[i][0]}, dp[${i}][1] = max(${prevSold}, ${prevHold} + ${prices[i]}) = ${dp[i][1]}`;
        
        if (dp[i][0] > prevHold && dp[i][0] === prevSold - prices[i]) {
          action = 'BUY';
          lastBuyDay = i;
        } else if (dp[i][1] > prevSold) {
          action = 'SELL';
          transactions.push({
            buyDay: lastBuyDay,
            sellDay: i,
            profit: prices[i] - prices[lastBuyDay]
          });
        }
        
        steps.push({
          day: i,
          dp: JSON.parse(JSON.stringify(dp)),
          explanation: `Day ${i}: Price $${prices[i]} - ${action}. Max profit: $${dp[i][1]}`,
          action,
          price: prices[i],
          formula,
          calculation
        });
      }
      
      return { maxProfit: dp[n-1][1], steps, transactions };
    }
  },
  'Best Time to Buy and Sell Stock III': {
    id: 'stock3',
    description: 'At most 2 transactions allowed',
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 3,3,5,0,0,3,1,4)',
        required: true
      }
    ],
    solve: (prices) => {
      const n = prices.length;
      const dp = Array(n).fill(0).map(() => [0, 0, 0, 0]); // [buy1, sell1, buy2, sell2]
      const steps = [];
      const transactions = [];
      
      dp[0][0] = -prices[0]; // First buy
      dp[0][1] = 0;          // First sell
      dp[0][2] = -prices[0]; // Second buy
      dp[0][3] = 0;          // Second sell
      
      steps.push({
        day: 0,
        dp: JSON.parse(JSON.stringify(dp)),
        explanation: `Day 0: Initialize - First buy for $${prices[0]}`,
        action: 'BUY',
        price: prices[0],
        formula: 'dp[0] = [-prices[0], 0, -prices[0], 0]',
        calculation: `dp[0] = [${dp[0][0]}, ${dp[0][1]}, ${dp[0][2]}, ${dp[0][3]}]`
      });
      
      let buy1Day = 0, buy2Day = 0;
      
      for (let i = 1; i < n; i++) {
        const prev = dp[i-1];
        
        dp[i][0] = Math.max(prev[0], -prices[i]);
        dp[i][1] = Math.max(prev[1], prev[0] + prices[i]);
        dp[i][2] = Math.max(prev[2], prev[1] - prices[i]);
        dp[i][3] = Math.max(prev[3], prev[2] + prices[i]);
        
        let action = 'HOLD';
        let formula = `buy1=${Math.max(prev[0], -prices[i])}, sell1=${Math.max(prev[1], prev[0] + prices[i])}, buy2=${Math.max(prev[2], prev[1] - prices[i])}, sell2=${Math.max(prev[3], prev[2] + prices[i])}`;
        let calculation = `dp[${i}] = [${dp[i][0]}, ${dp[i][1]}, ${dp[i][2]}, ${dp[i][3]}]`;
        
        if (dp[i][0] > prev[0]) {
          action = 'BUY1';
          buy1Day = i;
        } else if (dp[i][1] > prev[1]) {
          action = 'SELL1';
          transactions.push({
            buyDay: buy1Day,
            sellDay: i,
            profit: prices[i] - prices[buy1Day]
          });
        } else if (dp[i][2] > prev[2]) {
          action = 'BUY2';
          buy2Day = i;
        } else if (dp[i][3] > prev[3]) {
          action = 'SELL2';
          transactions.push({
            buyDay: buy2Day,
            sellDay: i,
            profit: prices[i] - prices[buy2Day]
          });
        }
        
        steps.push({
          day: i,
          dp: JSON.parse(JSON.stringify(dp)),
          explanation: `Day ${i}: Price $${prices[i]} - ${action}. Max profit: $${dp[i][3]}`,
          action,
          price: prices[i],
          formula,
          calculation
        });
      }
      
      return { maxProfit: dp[n-1][3], steps, transactions };
    }
  },
  'Best Time to Buy and Sell Stock IV': {
    id: 'stock4',
    description: 'At most k transactions allowed',
    inputs: [
      {
        name: 'k',
        type: 'number',
        label: 'Maximum Transactions (k)',
        placeholder: 'Enter number of transactions (e.g., 2)',
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
    solve: (prices, k = 2) => {
      const n = prices.length;
      if (k >= n / 2) {
        // If k is large enough, it's equivalent to unlimited transactions
        return algorithms['Best Time to Buy and Sell Stock II'].solve(prices);
      }
      
      const dp = Array(n).fill(0).map(() => Array(k + 1).fill(0).map(() => [0, 0])); // [k][hold, sold]
      const steps = [];
      const transactions = [];
      
      // Initialize
      for (let j = 1; j <= k; j++) {
        dp[0][j][0] = -prices[0];
        dp[0][j][1] = 0;
      }
      
      steps.push({
        day: 0,
        dp: JSON.parse(JSON.stringify(dp)),
        explanation: `Day 0: Initialize - Buy stock for $${prices[0]} for all k transactions`,
        action: 'BUY',
        price: prices[0],
        formula: `dp[0][j][0] = -prices[0] for j=1 to ${k}`,
        calculation: `Initialize all buy states to -${prices[0]}`
      });
      
      const buyDays = Array(k + 1).fill(0);
      
      for (let i = 1; i < n; i++) {
        for (let j = 1; j <= k; j++) {
          dp[i][j][0] = Math.max(dp[i-1][j][0], dp[i-1][j-1][1] - prices[i]);
          dp[i][j][1] = Math.max(dp[i-1][j][1], dp[i-1][j][0] + prices[i]);
          
          if (dp[i][j][0] > dp[i-1][j][0]) {
            buyDays[j] = i;
          } else if (dp[i][j][1] > dp[i-1][j][1]) {
            transactions.push({
              buyDay: buyDays[j],
              sellDay: i,
              profit: prices[i] - prices[buyDays[j]]
            });
          }
        }
        
        steps.push({
          day: i,
          dp: JSON.parse(JSON.stringify(dp)),
          explanation: `Day ${i}: Price $${prices[i]} - Processing ${k} transactions. Max profit: $${dp[i][k][1]}`,
          action: 'PROCESS',
          price: prices[i],
          formula: `dp[i][j][0] = max(dp[i-1][j][0], dp[i-1][j-1][1] - prices[i])`,
          calculation: `Max profit with ${k} transactions: $${dp[i][k][1]}`
        });
      }
      
      return { maxProfit: dp[n-1][k][1], steps, transactions };
    }
  },
  'Best Time to Buy and Sell Stock with Cooldown': {
    id: 'cooldown',
    description: 'Unlimited transactions with 1-day cooldown after selling',
    inputs: [
      {
        name: 'prices',
        type: 'array',
        label: 'Stock Prices',
        placeholder: 'Enter prices separated by commas (e.g., 1,2,3,0,2)',
        required: true
      }
    ],
    solve: (prices) => {
      const n = prices.length;
      const dp = Array(n).fill(0).map(() => [0, 0, 0]); // [hold, sold, rest]
      const steps = [];
      const transactions = [];
      
      dp[0][0] = -prices[0];
      dp[0][1] = 0;
      dp[0][2] = 0;
      
      steps.push({
        day: 0,
        dp: JSON.parse(JSON.stringify(dp)),
        explanation: `Day 0: Buy stock, enter cooldown system`,
        action: 'BUY',
        price: prices[0],
        formula: 'dp[0] = [-prices[0], 0, 0]',
        calculation: `dp[0] = [${dp[0][0]}, ${dp[0][1]}, ${dp[0][2]}]`
      });
      
      let lastBuyDay = 0;
      
      for (let i = 1; i < n; i++) {
        const prevHold = dp[i-1][0];
        const prevSold = dp[i-1][1];
        const prevRest = dp[i-1][2];
        
        dp[i][0] = Math.max(prevHold, prevRest - prices[i]);
        dp[i][1] = prevHold + prices[i];
        dp[i][2] = Math.max(prevSold, prevRest);
        
        let action = 'REST';
        let formula = `dp[${i}][0] = max(${prevHold}, ${prevRest} - ${prices[i]}), dp[${i}][1] = ${prevHold} + ${prices[i]}, dp[${i}][2] = max(${prevSold}, ${prevRest})`;
        let calculation = `dp[${i}] = [${dp[i][0]}, ${dp[i][1]}, ${dp[i][2]}]`;
        
        if (dp[i][0] > prevHold) {
          action = 'BUY';
          lastBuyDay = i;
        } else if (dp[i][1] > Math.max(prevSold, prevRest)) {
          action = 'SELL';
          transactions.push({
            buyDay: lastBuyDay,
            sellDay: i,
            profit: prices[i] - prices[lastBuyDay]
          });
        }
        
        steps.push({
          day: i,
          dp: JSON.parse(JSON.stringify(dp)),
          explanation: `Day ${i}: Price $${prices[i]} - ${action} (cooldown after selling). Max profit: $${Math.max(dp[i][1], dp[i][2])}`,
          action,
          price: prices[i],
          formula,
          calculation
        });
      }
      
      return { maxProfit: Math.max(dp[n-1][1], dp[n-1][2]), steps, transactions };
    }
  },
  'Best Time to Buy and Sell Stock with Transaction Fee': {
    id: 'fee',
    description: 'Unlimited transactions with transaction fee',
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
        placeholder: 'Enter transaction fee (e.g., 2)',
        required: true
      }
    ],
    solve: (prices, fee = 2) => {
      const n = prices.length;
      const dp = Array(n).fill(0).map(() => [0, 0]); // [hold, sold]
      const steps = [];
      const transactions = [];
      
      dp[0][0] = -prices[0];
      dp[0][1] = 0;
      
      steps.push({
        day: 0,
        dp: JSON.parse(JSON.stringify(dp)),
        explanation: `Day 0: Buy stock for $${prices[0]} (fee=$${fee} on transactions)`,
        action: 'BUY',
        price: prices[0],
        formula: 'dp[0][0] = -prices[0], dp[0][1] = 0',
        calculation: `dp[0][0] = -${prices[0]} = ${dp[0][0]}, dp[0][1] = 0`
      });
      
      let lastBuyDay = 0;
      
      for (let i = 1; i < n; i++) {
        const prevHold = dp[i-1][0];
        const prevSold = dp[i-1][1];
        
        dp[i][0] = Math.max(prevHold, prevSold - prices[i]);
        dp[i][1] = Math.max(prevSold, prevHold + prices[i] - fee);
        
        let action = 'HOLD';
        let formula = `dp[${i}][0] = max(dp[${i-1}][0], dp[${i-1}][1] - prices[${i}]), dp[${i}][1] = max(dp[${i-1}][1], dp[${i-1}][0] + prices[${i}] - ${fee})`;
        let calculation = `dp[${i}][0] = max(${prevHold}, ${prevSold} - ${prices[i]}) = ${dp[i][0]}, dp[${i}][1] = max(${prevSold}, ${prevHold} + ${prices[i]} - ${fee}) = ${dp[i][1]}`;
        
        if (dp[i][0] > prevHold && dp[i][0] === prevSold - prices[i]) {
          action = 'BUY';
          lastBuyDay = i;
        } else if (dp[i][1] > prevSold) {
          action = 'SELL';
          transactions.push({
            buyDay: lastBuyDay,
            sellDay: i,
            profit: prices[i] - prices[lastBuyDay] - fee
          });
        }
        
        steps.push({
          day: i,
          dp: JSON.parse(JSON.stringify(dp)),
          explanation: `Day ${i}: Price $${prices[i]} - ${action} (fee=$${fee}). Max profit: $${dp[i][1]}`,
          action,
          price: prices[i],
          formula,
          calculation
        });
      }
      
      return { maxProfit: dp[n-1][1], steps, transactions };
    }
  }
};

const sampleStocks = {
  'AAPL': [150, 145, 155, 148, 162, 158, 170, 165, 175],
  'GOOGL': [2800, 2750, 2900, 2700, 2850, 2950, 2800, 2900, 3000],
  'TSLA': [800, 820, 780, 850, 900, 880, 920, 950, 940],
  'MSFT': [300, 310, 295, 320, 315, 330, 325, 340, 350]
};

// Custom Data Input Modal Component
function CustomDataModal({ 
  isOpen, 
  onClose, 
  algorithm, 
  onSubmit 
}) {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      const initialData = {};
      algorithm.inputs.forEach(input => {
        initialData[input.name] = '';
      });
      setFormData(initialData);
      setErrors({});
    }
  }, [isOpen, algorithm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    const processedData = {};

    // Validate and process each input
    algorithm.inputs.forEach(input => {
      const value = formData[input.name]?.trim();
      
      if (input.required && !value) {
        newErrors[input.name] = `${input.label} is required`;
        return;
      }

      if (value) {
        if (input.type === 'array') {
          try {
            const numbers = value.split(',').map(s => {
              const num = parseFloat(s.trim());
              if (isNaN(num)) throw new Error('Invalid number');
              return num;
            });
            if (numbers.length === 0) throw new Error('Array cannot be empty');
            processedData[input.name] = numbers;
          } catch {
            newErrors[input.name] = 'Please enter valid numbers separated by commas';
          }
        } else if (input.type === 'number') {
          const num = parseFloat(value);
          if (isNaN(num) || num < 0) {
            newErrors[input.name] = 'Please enter a valid positive number';
          } else {
            processedData[input.name] = num;
          }
        }
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(processedData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Custom Data Input</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900">{algorithm.description}</h4>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {algorithm.inputs.map((input) => (
            <div key={input.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {input.label} {input.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                value={formData[input.name] || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, [input.name]: e.target.value }))}
                placeholder={input.placeholder}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors[input.name] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors[input.name] && (
                <p className="text-red-500 text-xs mt-1">{errors[input.name]}</p>
              )}
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Data
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('Best Time to Buy and Sell Stock');
  const [selectedStock, setSelectedStock] = useState('AAPL');
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [result, setResult] = useState(null);
  const [useRealData, setUseRealData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [realPrices, setRealPrices] = useState([]);
  const [customData, setCustomData] = useState(null);
  const [useCustomData, setUseCustomData] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);


  const prices = useCustomData && customData?.prices ? customData.prices :
                 useRealData && realPrices.length > 0 ? realPrices : 
                 sampleStocks[selectedStock];

 

  const handleCustomDataSubmit = (data) => {
    setCustomData(data);
    setUseCustomData(true);
  };

  const runAlgorithm = useCallback(() => {
    const algo = algorithms[selectedAlgorithm];
    if (!algo) return;
    
    let res;
    
    if (useCustomData && customData) {
      // Use custom data with appropriate parameters
      if (selectedAlgorithm === 'Best Time to Buy and Sell Stock IV') {
        res = algo.solve(customData.prices, customData.k);
      } else if (selectedAlgorithm === 'Best Time to Buy and Sell Stock with Transaction Fee') {
        res = algo.solve(customData.prices, customData.fee);
      } else {
        res = algo.solve(customData.prices);
      }
    } else {
      // Use default parameters for sample/real data
      if (selectedAlgorithm === 'Best Time to Buy and Sell Stock IV') {
        res = algo.solve(prices, 2);
      } else if (selectedAlgorithm === 'Best Time to Buy and Sell Stock with Transaction Fee') {
        res = algo.solve(prices, 2);
      } else {
        res = algo.solve(prices);
      }
    }
    
    setResult(res);
    setCurrentStep(0);
  }, [selectedAlgorithm, prices, customData, useCustomData]);

  useEffect(() => {
    runAlgorithm();
  }, [runAlgorithm]);

  useEffect(() => {
    let interval
    if (isPlaying && result && currentStep < result.steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= (result?.steps.length ?? 0) - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, result, speed]);

  const handlePlay = () => setIsPlaying(!isPlaying);
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };
  const handleStepForward = () => {
    if (result && currentStep < result.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };
  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const currentStepData = result?.steps[currentStep];

  // Get profit/loss regions for shading
  const getProfitLossRegions = () => {
    if (!result || !result.transactions) return [];
    
    return result.transactions.map(transaction => ({
      ...transaction,
      isProfit: transaction.profit > 0
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Stock Trading DP Visualizer</h1>
            <div className="flex items-center gap-4">
              <select 
                value={selectedAlgorithm} 
                onChange={(e) => {
                  setSelectedAlgorithm(e.target.value);
                  setUseCustomData(false);
                  setCustomData(null);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {Object.keys(algorithms).map(algo => (
                  <option key={algo} value={algo}>{algo}</option>
                ))}
              </select>
              
              {!useCustomData && (
                <select 
                  value={selectedStock} 
                  onChange={(e) => setSelectedStock(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {Object.keys(sampleStocks).map(stock => (
                    <option key={stock} value={stock}>{stock}</option>
                  ))}
                </select>
              )}
              
              <button
                onClick={() => setShowCustomModal(true)}
                className="flex items-center gap-2 px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                Custom Data
              </button>
              
              
            </div>
          </div>
          
          {error && (
            <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
          
          {useCustomData && (
            <div className="mt-2 text-sm text-purple-600">
              Using custom data for {selectedAlgorithm}
            </div>
          )}
          
        
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleReset}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={handleStepBackward}
                disabled={currentStep === 0}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button
                onClick={handlePlay}
                className="p-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={handleStepForward}
                disabled={!result || currentStep >= result.steps.length - 1}
                className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Speed:</label>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-24"
                />
                <span className="text-sm text-gray-600">{speed}ms</span>
              </div>
              
              {result && (
                <div className="text-sm text-gray-600">
                  Step {currentStep + 1} of {result.steps.length}
                </div>
              )}
            </div>
          </div>
          
          {/* Timeline Scrubber */}
          {result && (
            <div className="mt-4">
              <input
                type="range"
                min="0"
                max={result.steps.length - 1}
                value={currentStep}
                onChange={(e) => setCurrentStep(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Enhanced Chart with Profit/Loss Shading */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">Price Chart with Profit/Loss Regions</h3>
            <div className="relative h-64 flex items-end justify-between gap-1">
              {/* Profit/Loss Background Shading */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {getProfitLossRegions().map((region, index) => {
                  const startX = (region.buyDay / (prices.length - 1)) * 100;
                  const endX = (region.sellDay / (prices.length - 1)) * 100;
                  return (
                    <rect
                      key={index}
                      x={`${startX}%`}
                      y="0"
                      width={`${endX - startX}%`}
                      height="100%"
                      fill={region.isProfit ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
                      stroke={region.isProfit ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}
                      strokeWidth="1"
                    />
                  );
                })}
              </svg>
              
              {prices.map((price, index) => (
                <motion.div
                  key={index}
                  className="flex flex-col items-center relative z-10"
                  initial={{ opacity: 0.3 }}
                  animate={{ 
                    opacity: index <= currentStep ? 1 : 0.3,
                    scale: index === currentStep ? 1.1 : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`w-8 rounded-t transition-colors ${
                      index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    style={{ height: `${(price / Math.max(...prices)) * 200}px` }}
                  />
                  <div className="text-xs mt-1 font-medium">${price.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Day {index}</div>
                  {currentStepData && index === currentStep && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-xs font-bold mt-1 px-2 py-1 rounded ${
                        currentStepData.action === 'BUY' || currentStepData.action === 'BUY1' || currentStepData.action === 'BUY2' ? 'bg-green-100 text-green-800' :
                        currentStepData.action === 'SELL' || currentStepData.action === 'SELL1' || currentStepData.action === 'SELL2' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {currentStepData.action}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
            
            {/* Transaction Summary */}
            {result && result.transactions.length > 0 && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold mb-2">Transactions:</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {result.transactions.map((transaction, index) => (
                    <div key={index} className="text-xs flex justify-between">
                      <span>Buy Day {transaction.buyDay} → Sell Day {transaction.sellDay}</span>
                      <span className={transaction.profit > 0 ? 'text-green-600' : 'text-red-600'}>
                        ${transaction.profit.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* DP Table */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold mb-4">DP State Table</h3>
            <div className="overflow-auto max-h-64">
              {currentStepData && (
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  {currentStepData.dp.map((dayStates, dayIndex) => (
                    <div key={dayIndex} className="flex items-center gap-2">
                      <div className="w-12 text-sm font-medium">Day {dayIndex}:</div>
                      <div className="flex gap-1 flex-wrap">
                        {Array.isArray(dayStates) ? dayStates.map((state, stateIndex) => (
                          <motion.div
                            key={stateIndex}
                            className={`text-xs px-2 py-1 rounded ${
                              dayIndex === currentStep ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                            }`}
                            animate={{ scale: dayIndex === currentStep ? 1.05 : 1 }}
                          >
                            ${typeof state === 'number' ? state.toFixed(2) : JSON.stringify(state)}
                          </motion.div>
                        )) : (
                          <motion.div
                            className={`text-xs px-2 py-1 rounded ${
                              dayIndex === currentStep ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                            }`}
                            animate={{ scale: dayIndex === currentStep ? 1.05 : 1 }}
                          >
                            ${typeof dayStates === 'number' ? dayStates.toFixed(2) : JSON.stringify(dayStates)}
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Enhanced Explanation with Formula Display */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border p-6 mt-6"
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-lg font-semibold mb-4">Algorithm Explanation</h3>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">{selectedAlgorithm}</h4>
              <p className="text-blue-800 text-sm">{algorithms[selectedAlgorithm].description}</p>
              
              {/* Show custom parameters if using custom data */}
              {useCustomData && customData && (
                <div className="mt-2 text-sm text-blue-700">
                  <strong>Custom Parameters:</strong>
                  {Object.entries(customData).map(([key, value]) => (
                    <span key={key} className="ml-2">
                      {key}: {Array.isArray(value) ? `[${value.join(', ')}]` : value}
                    </span>
                  ))}
                </div>
              )}
            </div>
            
            {currentStepData && (
              <>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Current Step:</h4>
                  <p className="text-gray-700 mb-2">{currentStepData.explanation}</p>
                  
                  {currentStepData.formula && (
                    <div className="mt-3 p-3 bg-white rounded border-l-4 border-blue-500">
                      <h5 className="text-sm font-semibold text-gray-700 mb-1">Formula:</h5>
                      <code className="text-sm text-blue-700 font-mono break-all">{currentStepData.formula}</code>
                    </div>
                  )}
                  
                  {currentStepData.calculation && (
                    <div className="mt-2 p-3 bg-white rounded border-l-4 border-green-500">
                      <h5 className="text-sm font-semibold text-gray-700 mb-1">Calculation:</h5>
                      <code className="text-sm text-green-700 font-mono break-all">{currentStepData.calculation}</code>
                    </div>
                  )}
                </div>
              </>
            )}
            
            {result && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Final Result:</h4>
                <p className="text-green-800">Maximum Profit: <span className="font-bold">${result.maxProfit.toFixed(2)}</span></p>
                {result.transactions.length > 0 && (
                  <p className="text-green-800 text-sm mt-1">
                    Total Transactions: {result.transactions.length}
                  </p>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Custom Data Modal */}
      <CustomDataModal
        isOpen={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        algorithm={algorithms[selectedAlgorithm]}
        onSubmit={handleCustomDataSubmit}
      />
    </div>
  );
}

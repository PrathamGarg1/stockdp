// Har problem ka solve() (jo chalta hai aur steps banata hai) aur C++ (jo page par dikhta hai).
// "?raw" ka matlab: file ko chalao mat, bas uska text de do.
// Naya solution add karna ho to: yahan 2 import + 1 line niche, aur problems.json mein ek entry.

import stocks1 from "./stocks-1.js"
import stocks1Cpp from "./stocks-1.cpp?raw"
import stocks2 from "./stocks-2.js"
import stocks2Cpp from "./stocks-2.cpp?raw"
import stocks3a from "./stocks-3a.js"
import stocks3aCpp from "./stocks-3a.cpp?raw"
import stocks3b from "./stocks-3b.js"
import stocks3bCpp from "./stocks-3b.cpp?raw"
import stocks3c from "./stocks-3c.js"
import stocks3cCpp from "./stocks-3c.cpp?raw"
import stocks4 from "./stocks-4.js"
import stocks4Cpp from "./stocks-4.cpp?raw"
import stocks5 from "./stocks-5.js"
import stocks5Cpp from "./stocks-5.cpp?raw"
import stocks6 from "./stocks-6.js"
import stocks6Cpp from "./stocks-6.cpp?raw"
import stocks7 from "./stocks-7.js"
import stocks7Cpp from "./stocks-7.cpp?raw"
import stocks8 from "./stocks-8.js"
import stocks8Cpp from "./stocks-8.cpp?raw"
import stocks9 from "./stocks-9.js"
import stocks9Cpp from "./stocks-9.cpp?raw"
import stones1 from "./stones-1.js"
import stones1Cpp from "./stones-1.cpp?raw"
import stones2 from "./stones-2.js"
import stones2Cpp from "./stones-2.cpp?raw"
import stones3 from "./stones-3.js"
import stones3Cpp from "./stones-3.cpp?raw"
import stones4 from "./stones-4.js"
import stones4Cpp from "./stones-4.cpp?raw"
import stones5 from "./stones-5.js"
import stones5Cpp from "./stones-5.cpp?raw"
import stones6 from "./stones-6.js"
import stones6Cpp from "./stones-6.cpp?raw"
import stones7 from "./stones-7.js"
import stones7Cpp from "./stones-7.cpp?raw"
import stones8 from "./stones-8.js"
import stones8Cpp from "./stones-8.cpp?raw"
import jumps1 from "./jumps-1.js"
import jumps1Cpp from "./jumps-1.cpp?raw"
import jumps2 from "./jumps-2.js"
import jumps2Cpp from "./jumps-2.cpp?raw"
import jumps3 from "./jumps-3.js"
import jumps3Cpp from "./jumps-3.cpp?raw"
import jumps4 from "./jumps-4.js"
import jumps4Cpp from "./jumps-4.cpp?raw"
import jumps5 from "./jumps-5.js"
import jumps5Cpp from "./jumps-5.cpp?raw"
import jumps6 from "./jumps-6.js"
import jumps6Cpp from "./jumps-6.cpp?raw"
import jumps7 from "./jumps-7.js"
import jumps7Cpp from "./jumps-7.cpp?raw"
import jumps8 from "./jumps-8.js"
import jumps8Cpp from "./jumps-8.cpp?raw"
import jumps9 from "./jumps-9.js"
import jumps9Cpp from "./jumps-9.cpp?raw"

export const solutions = {
  "stocks-1": { solve: stocks1, cpp: stocks1Cpp },
  "stocks-2": { solve: stocks2, cpp: stocks2Cpp },
  "stocks-3a": { solve: stocks3a, cpp: stocks3aCpp },
  "stocks-3b": { solve: stocks3b, cpp: stocks3bCpp },
  "stocks-3c": { solve: stocks3c, cpp: stocks3cCpp },
  "stocks-4": { solve: stocks4, cpp: stocks4Cpp },
  "stocks-5": { solve: stocks5, cpp: stocks5Cpp },
  "stocks-6": { solve: stocks6, cpp: stocks6Cpp },
  "stocks-7": { solve: stocks7, cpp: stocks7Cpp },
  "stocks-8": { solve: stocks8, cpp: stocks8Cpp },
  "stocks-9": { solve: stocks9, cpp: stocks9Cpp },
  "stones-1": { solve: stones1, cpp: stones1Cpp },
  "stones-2": { solve: stones2, cpp: stones2Cpp },
  "stones-3": { solve: stones3, cpp: stones3Cpp },
  "stones-4": { solve: stones4, cpp: stones4Cpp },
  "stones-5": { solve: stones5, cpp: stones5Cpp },
  "stones-6": { solve: stones6, cpp: stones6Cpp },
  "stones-7": { solve: stones7, cpp: stones7Cpp },
  "stones-8": { solve: stones8, cpp: stones8Cpp },
  "jumps-1": { solve: jumps1, cpp: jumps1Cpp },
  "jumps-2": { solve: jumps2, cpp: jumps2Cpp },
  "jumps-3": { solve: jumps3, cpp: jumps3Cpp },
  "jumps-4": { solve: jumps4, cpp: jumps4Cpp },
  "jumps-5": { solve: jumps5, cpp: jumps5Cpp },
  "jumps-6": { solve: jumps6, cpp: jumps6Cpp },
  "jumps-7": { solve: jumps7, cpp: jumps7Cpp },
  "jumps-8": { solve: jumps8, cpp: jumps8Cpp },
  "jumps-9": { solve: jumps9, cpp: jumps9Cpp },
}

// The answer as the judge prints it:  5 -> "5",  [2,2,3] -> "[2,2,3]",  true -> "true"
export const show = (answer) => (Array.isArray(answer) ? `[${answer.join(",")}]` : String(answer))

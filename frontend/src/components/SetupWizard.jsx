import React, { useState } from 'react';

const SetupWizard = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [count, setCount] = useState(6);

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border">
      {step === 1 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Configure Units</h2>
          <label className="block text-sm font-bold mb-2 uppercase">Number of Containers</label>
          <input 
            type="number" 
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-full border p-4 rounded-xl mb-6 outline-none focus:border-green-500" 
          />
          <button 
            onClick={() => setStep(2)} 
            className="w-full bg-green-600 text-white py-4 rounded-xl font-bold"
          >
            Next
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Hardware Sync</h2>
          <p className="text-gray-500 mb-6">Ready to monitor {count} containers. Node 1 detected.</p>
          <button 
            onClick={() => onComplete(count)} 
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold"
          >
            Finish Setup
          </button>
        </div>
      )}
    </div>
  );
};

export default SetupWizard; // <--- MAKE SURE THIS IS HERE
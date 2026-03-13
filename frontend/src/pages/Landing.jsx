import React from 'react';

const Landing = ({ onStart }) => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 px-8 text-center">
        <h1 className="text-5xl font-extrabold mb-6">AI Powered Food Freshness</h1>
        <p className="text-xl text-gray-600 mb-10">Reducing food waste using IoT sensors.</p>
        <button 
          onClick={onStart} 
          className="bg-green-600 text-white px-10 py-4 rounded-xl font-bold"
        >
          Get Started
        </button>
      </section>

      {/* Problem Section */}
      <section className="py-16 bg-gray-50 px-8 text-center">
        <h2 className="text-3xl font-bold mb-4">The Problem</h2>
        <p className="max-w-2xl mx-auto text-gray-600">
          Supermarkets lose billions due to food spoilage. Static expiry dates are not enough.
        </p>
      </section>
    </div>
  );
};

export default Landing; // <--- THIS LINE IS CRITICAL
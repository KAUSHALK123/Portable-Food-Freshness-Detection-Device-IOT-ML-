import React from 'react';

const Navbar = ({ onNav, onLogin, isLoggedIn }) => {
  return (
    <nav className="p-4 bg-white border-b flex justify-between items-center px-8">
      <div className="font-bold text-xl cursor-pointer" onClick={() => onNav('landing')}>
        FreshTrack <span className="text-green-600">AI</span>
      </div>
      <div className="flex gap-4">
        {!isLoggedIn && (
          <button onClick={onLogin} className="px-4 font-semibold text-gray-600">
            Login
          </button>
        )}
        <button 
          onClick={() => onNav('setup')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          Setup
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';

const Navbar = ({ onNav, onLogin, onLogout, isLoggedIn, supermarketName }) => {
  return (
    <nav className="sticky top-0 z-20 p-4 bg-white/90 backdrop-blur border-b flex justify-between items-center px-4 md:px-8 gap-3">
      <div className="font-bold text-xl cursor-pointer shrink-0" onClick={() => onNav('landing')}>
        FreshTrack <span className="text-green-600">AI</span>
      </div>

      <div className="flex gap-2 md:gap-3 items-center flex-wrap justify-end">
        <button onClick={() => onNav('landing')} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold">
          Home
        </button>
        {isLoggedIn && (
          <button onClick={() => onNav('dashboard')} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold">
            Dashboard
          </button>
        )}
        {isLoggedIn && (
          <button onClick={() => onNav('setup')} className="px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 font-semibold">
            Setup Supermarket
          </button>
        )}
        {supermarketName && <span className="hidden md:inline text-xs uppercase tracking-wider text-gray-500">{supermarketName}</span>}

        {!isLoggedIn && (
          <button onClick={onLogin} className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg">
            Login / Sign Up
          </button>
        )}

        {isLoggedIn && (
          <button onClick={onLogout} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
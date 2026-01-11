import React, { useState } from 'react';
import { Search, Coffee, Menu, Plus, User as UserIcon, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  onSearch: (query: string) => void;
  onHome: () => void;
  user: User | null;
  onLogin: () => void;
  onSignup: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onHome, user, onLogin, onSignup, onLogout }) => {
  const [searchValue, setSearchValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  return (
    <header className="bg-[#14181c] border-b border-surface sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={onHome}
          className="flex items-center gap-2 cursor-pointer group select-none"
        >
          <Coffee className="text-accent group-hover:rotate-12 transition-transform duration-300" size={28} />
          <h1 className="text-2xl font-black tracking-tighter text-white uppercase hidden sm:block">
            Latte<span className="text-text">boxd</span>
          </h1>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-text uppercase tracking-widest">
          {user ? (
            <>
              <button onClick={onHome} className="hover:text-white transition-colors">Cafes</button>
              <button onClick={() => onSearch('Trending cafes in Tokyo')} className="hover:text-white transition-colors">Lists</button>
              <button onClick={() => onSearch('Underground espresso bars')} className="hover:text-white transition-colors">Journal</button>
            </>
          ) : (
             <button onClick={onLogin} className="hover:text-white transition-colors">Sign In</button>
          )}
          {!user && (
            <button onClick={onSignup} className="hover:text-white transition-colors">Create Account</button>
          )}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <form onSubmit={handleSubmit} className="relative group hidden sm:block">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search..."
              className="bg-[#2c3440] text-white rounded-full py-1.5 pl-4 pr-10 w-48 focus:w-64 transition-all duration-300 outline-none text-sm border border-transparent focus:border-text focus:bg-white focus:text-black placeholder-gray-500"
            />
            <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black">
              <Search size={16} />
            </button>
          </form>

          {user && (
            <div className="flex items-center gap-4">
              <button 
                onClick={() => {
                    const terms = ["Best matcha in Kyoto", "Cyberpunk coffee shop", "Cozy parisian corner", "Industrial warehouse roastery"];
                    onSearch(terms[Math.floor(Math.random() * terms.length)]);
                }}
                className="bg-accent hover:bg-[#00c040] text-white rounded px-4 py-1.5 text-sm font-bold uppercase tracking-wider flex items-center gap-1 transition-colors"
              >
                <Plus size={16} /> <span className="hidden sm:inline">Log</span>
              </button>
              
              <div className="flex items-center gap-3 pl-2 border-l border-surface">
                 <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-xs font-bold text-white leading-none">{user.username}</span>
                    <button onClick={onLogout} className="text-[10px] text-gray-500 hover:text-red-400 uppercase tracking-wider mt-1">Log out</button>
                 </div>
                 <div className={`w-8 h-8 rounded-full ${user.avatarColor} flex items-center justify-center text-white font-black text-sm select-none shadow-lg border border-white/10`}>
                    {user.username.charAt(0).toUpperCase()}
                 </div>
              </div>
            </div>
          )}
          
          {!user && (
             <div className="flex items-center gap-2 sm:hidden">
                <button onClick={onLogin} className="text-xs font-bold uppercase text-white bg-[#2c3440] px-3 py-1.5 rounded">Sign In</button>
             </div>
          )}

          <button className="md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
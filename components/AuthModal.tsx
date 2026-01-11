import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  mode: 'LOGIN' | 'SIGNUP';
  onClose: () => void;
  onSubmit: (username: string, password: string) => Promise<void>;
  onSwitchMode: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, mode, onClose, onSubmit, onSwitchMode }) => {
  if (!isOpen) return null;

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    
    setError(null);
    setLoading(true);

    try {
      await onSubmit(username, password);
      // Reset form on success
      setUsername('');
      setPassword('');
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="bg-[#14181c] border border-[#456] p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-md relative z-10 animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
          <X size={24} />
        </button>

        <h2 className="text-2xl font-black text-white mb-6 uppercase tracking-tighter">
          {mode === 'LOGIN' ? 'Sign In' : 'Join Latteboxd'}
        </h2>

        {error && (
          <div className="bg-red-900/30 text-red-200 text-sm p-3 rounded mb-4 border border-red-900">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
            <input 
              type="text" 
              className="w-full bg-[#2c3440] text-white p-3 rounded border border-transparent focus:border-accent focus:bg-[#343d4a] outline-none transition-all font-sans disabled:opacity-50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoFocus
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-[#2c3440] text-white p-3 rounded border border-transparent focus:border-accent focus:bg-[#343d4a] outline-none transition-all font-sans disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="bg-accent hover:bg-white hover:text-black text-white font-bold py-3 rounded uppercase tracking-widest mt-2 transition-all duration-300 transform active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {mode === 'LOGIN' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {mode === 'LOGIN' ? "New to Latteboxd?" : "Already a member?"}
          <button 
            onClick={() => { setError(null); onSwitchMode(); }} 
            className="text-white font-bold ml-2 hover:text-accent transition-colors"
            disabled={loading}
          >
            {mode === 'LOGIN' ? 'Create Account' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
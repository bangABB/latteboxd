import React from 'react';

interface CafePosterProps {
  imageUrl?: string;
  name: string;
  loading?: boolean;
}

const CafePoster: React.FC<CafePosterProps> = ({ imageUrl, name, loading }) => {
  return (
    <div className="relative aspect-[3/4] bg-[#2c3440] rounded border border-[#456] overflow-hidden shadow-2xl group cursor-pointer transition-transform duration-300 hover:scale-[1.02]">
      {loading ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center animate-pulse">
           <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
           <p className="text-xs text-accent font-bold uppercase tracking-widest">Developing Film...</p>
        </div>
      ) : imageUrl ? (
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <span className="text-gray-700 font-bold uppercase">{name}</span>
        </div>
      )}
      
      {/* Poster Gloss Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
      
      {/* Border Highlight */}
      <div className="absolute inset-0 border border-white/10 group-hover:border-accent/50 transition-colors pointer-events-none rounded"></div>
    </div>
  );
};

export default CafePoster;
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CafePoster from './components/CafePoster';
import ReviewCard from './components/ReviewCard';
import StarRating from './components/StarRating';
import AuthModal from './components/AuthModal';
import { CafeDetails, LoadingState, User } from './types';
import { AuthService } from './services/db';
import { generateCafeData, generateCafePoster } from './services/geminiService';
import { LayoutGrid, TrendingUp, Eye, Heart, Share2, Clock } from 'lucide-react';

const MOCK_RECENTS = [
  { name: 'Monocle Cafe', image: 'https://picsum.photos/300/400?random=1', rating: 4.2 },
  { name: '% Arabica', image: 'https://picsum.photos/300/400?random=2', rating: 4.5 },
  { name: 'Blue Bottle', image: 'https://picsum.photos/300/400?random=3', rating: 3.8 },
  { name: 'Fuglen Tokyo', image: 'https://picsum.photos/300/400?random=4', rating: 4.9 },
  { name: 'Sey Coffee', image: 'https://picsum.photos/300/400?random=5', rating: 4.7 },
  { name: 'La Cabra', image: 'https://picsum.photos/300/400?random=6', rating: 4.4 },
];

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [cafeData, setCafeData] = useState<CafeDetails | null>(null);
  const [cafeImage, setCafeImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  // Initialize Session
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleAuthSubmit = async (username: string, password: string) => {
    try {
      let loggedInUser: User;
      if (authMode === 'SIGNUP') {
        loggedInUser = await AuthService.signup(username, password);
      } else {
        loggedInUser = await AuthService.login(username, password);
      }
      
      AuthService.setSession(loggedInUser);
      setUser(loggedInUser);
      setIsAuthModalOpen(false);
    } catch (e: any) {
      throw e; // Re-throw to be handled by modal
    }
  };

  const handleLogout = () => {
    AuthService.clearSession();
    setUser(null);
  };

  const openLogin = () => {
    setAuthMode('LOGIN');
    setIsAuthModalOpen(true);
  };

  const openSignup = () => {
    setAuthMode('SIGNUP');
    setIsAuthModalOpen(true);
  };

  const handleSearch = async (query: string) => {
    setLoadingState(LoadingState.GENERATING_TEXT);
    setCafeData(null);
    setCafeImage(null);
    setError(null);

    try {
      const data = await generateCafeData(query);
      setCafeData(data);
      setLoadingState(LoadingState.GENERATING_IMAGE);

      // Start image generation in background
      generateCafePoster(data.posterPrompt)
        .then(img => {
            setCafeImage(img);
            setLoadingState(LoadingState.COMPLETE);
        })
        .catch(err => {
            console.error("Image gen failed", err);
            // Fallback to picsum if AI image fails
            setCafeImage(`https://picsum.photos/800/1200?blur=2`); 
            setLoadingState(LoadingState.COMPLETE);
        });

    } catch (e) {
      console.error(e);
      setError("Failed to generate cafe reviews. Please check your API key or try again.");
      setLoadingState(LoadingState.ERROR);
    }
  };

  const resetHome = () => {
    setCafeData(null);
    setLoadingState(LoadingState.IDLE);
  };

  return (
    <div className="min-h-screen bg-background text-text font-sans selection:bg-accent selection:text-white pb-20">
      <Header 
        onSearch={handleSearch} 
        onHome={resetHome} 
        user={user}
        onLogin={openLogin}
        onSignup={openSignup}
        onLogout={handleLogout}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        mode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSubmit={handleAuthSubmit}
        onSwitchMode={() => setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
      />

      {/* ERROR STATE */}
      {loadingState === LoadingState.ERROR && (
        <div className="max-w-[950px] mx-auto mt-12 p-8 bg-red-900/20 border border-red-900 rounded text-center">
            <h2 className="text-xl text-red-500 font-bold mb-2">System Error</h2>
            <p>{error}</p>
        </div>
      )}

      {/* IDLE / HOME STATE */}
      {loadingState === LoadingState.IDLE && !cafeData && (
        <main className="max-w-[950px] mx-auto px-4 sm:px-8 py-10 animate-in fade-in duration-700">
          <div className="text-center mb-16">
             <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-4">
                Track the coffee you visit. <br/>
                <span className="text-gray-500">Save those you want to see.</span>
             </h2>
             <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
               The social network for coffee lovers. Use AI to generate reviews for any cafe in the universe, real or imagined.
             </p>
             {!user ? (
               <button 
                  onClick={openSignup}
                  className="bg-accent hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,224,84,0.3)]"
               >
                  Get Started - It's Free
               </button>
             ) : (
               <button 
                  onClick={() => handleSearch("The most aesthetic cafe in Copenhagen")}
                  className="bg-accent hover:bg-white hover:text-black text-white font-bold py-3 px-8 rounded uppercase tracking-widest transition-all duration-300 transform hover:-translate-y-1 shadow-[0_0_20px_rgba(0,224,84,0.3)]"
               >
                  Generate a Cafe
               </button>
             )}
          </div>

          <div className="border-t border-surface pt-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-white">Popular This Week</h3>
              <span className="text-xs text-gray-500 hover:text-white cursor-pointer">MORE</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
              {MOCK_RECENTS.map((cafe, i) => (
                <div key={i} onClick={() => handleSearch(cafe.name)}>
                  <CafePoster name={cafe.name} imageUrl={cafe.image} />
                  <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                     <StarRating rating={cafe.rating} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      )}

      {/* LOADING OR RESULT STATE */}
      {(cafeData || loadingState === LoadingState.GENERATING_TEXT) && (
        <main className="max-w-[950px] mx-auto px-4 sm:px-8 py-8 animate-in zoom-in-95 duration-500">
          
          {/* BANNER / BACKDROP (Blurred background effect) */}
          <div className="fixed inset-0 z-[-1] opacity-20 pointer-events-none">
             {cafeImage && <img src={cafeImage} className="w-full h-full object-cover blur-3xl" />}
          </div>

          <div className="flex flex-col md:flex-row gap-8 sm:gap-12">
            
            {/* LEFT COLUMN: POSTER & ACTIONS */}
            <div className="w-full md:w-[230px] flex-shrink-0 flex flex-col gap-4">
               <CafePoster 
                  name={cafeData?.name || "Loading..."} 
                  imageUrl={cafeImage || undefined} 
                  loading={loadingState !== LoadingState.COMPLETE && !cafeImage}
               />
               
               {cafeData && (
                 <div className="flex flex-col gap-2">
                   {user ? (
                     <>
                        <div className="bg-[#456] text-white py-2 rounded text-center font-bold text-sm tracking-widest hover:bg-[#567] cursor-pointer transition-colors shadow-lg">
                            Review or log
                        </div>
                        <div className="bg-[#456] text-white py-2 rounded text-center font-bold text-sm tracking-widest hover:bg-[#567] cursor-pointer transition-colors shadow-lg">
                            Add to watchlist
                        </div>
                     </>
                   ) : (
                      <div 
                        onClick={openLogin}
                        className="bg-accent text-white py-2 rounded text-center font-bold text-sm tracking-widest hover:bg-white hover:text-black cursor-pointer transition-colors shadow-lg"
                      >
                         Sign in to Log
                      </div>
                   )}
                   <div className="grid grid-cols-3 gap-2 mt-2 text-center text-xs text-gray-400">
                      <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white">
                        <Eye size={20} /> Watch
                      </div>
                      <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white">
                        <Heart size={20} /> Like
                      </div>
                      <div className="flex flex-col items-center gap-1 cursor-pointer hover:text-white">
                        <Share2 size={20} /> Share
                      </div>
                   </div>
                 </div>
               )}
            </div>

            {/* RIGHT COLUMN: CONTENT */}
            <div className="flex-1 min-w-0">
               {loadingState === LoadingState.GENERATING_TEXT ? (
                  <div className="space-y-6 animate-pulse mt-8">
                     <div className="h-10 bg-surface rounded w-3/4"></div>
                     <div className="h-4 bg-surface rounded w-1/4"></div>
                     <div className="h-32 bg-surface rounded w-full"></div>
                     <div className="h-20 bg-surface rounded w-full"></div>
                  </div>
               ) : cafeData ? (
                 <>
                    {/* TITLE HEADER */}
                    <div className="mb-6">
                       <h1 className="text-3xl sm:text-4xl font-serif font-black text-white mb-2 leading-tight">
                         {cafeData.name} 
                         <span className="text-xl sm:text-2xl text-gray-500 font-sans font-normal ml-3">{cafeData.yearEstablished}</span>
                       </h1>
                       
                       <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-400 uppercase tracking-widest mb-6">
                          <span>{cafeData.location}</span>
                          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                          <span>{Math.floor(Math.random() * 100) + 10} mins</span>
                       </div>

                       <div className="flex flex-col gap-4">
                          <p className="text-gray-300 font-serif text-base sm:text-lg leading-relaxed text-glow">
                             {cafeData.description}
                          </p>
                          
                          {/* TAGS */}
                          <div className="flex flex-wrap gap-2">
                             {cafeData.tags.map(tag => (
                               <span key={tag} className="bg-[#2c3440] text-gray-300 px-2 py-1 rounded text-xs hover:text-white hover:bg-gray-600 cursor-pointer transition-colors">
                                 {tag}
                               </span>
                             ))}
                          </div>
                       </div>
                    </div>

                    {/* RATINGS BAR */}
                    <div className="flex items-center justify-between border-y border-surface py-4 mb-8 bg-[#181e26]/50 backdrop-blur-sm px-4 -mx-4 sm:mx-0 sm:px-0 sm:bg-transparent">
                       <div className="flex items-center gap-4">
                          <div className="flex flex-col">
                             <span className="text-xs text-gray-500 uppercase font-bold">Average</span>
                             <StarRating rating={cafeData.averageRating} size="lg" showNumber />
                          </div>
                          <div className="w-px h-8 bg-surface mx-2"></div>
                           <div className="flex flex-col">
                             <span className="text-xs text-gray-500 uppercase font-bold">Friends</span>
                             <div className="flex -space-x-2 mt-1">
                                <div className="w-6 h-6 rounded-full bg-red-500 border border-background"></div>
                                <div className="w-6 h-6 rounded-full bg-blue-500 border border-background"></div>
                                <div className="w-6 h-6 rounded-full bg-green-500 border border-background"></div>
                             </div>
                          </div>
                       </div>
                       
                       <div className="text-right hidden sm:block">
                          <div className="text-xs text-gray-500 uppercase font-bold mb-1">Activity</div>
                          <div className="flex items-center gap-4 text-gray-400 text-sm">
                             <div className="flex items-center gap-1"><Eye size={14} /> 1.2k</div>
                             <div className="flex items-center gap-1"><LayoutGrid size={14} /> 245</div>
                             <div className="flex items-center gap-1"><Heart size={14} /> 890</div>
                          </div>
                       </div>
                    </div>

                    {/* REVIEWS SECTION */}
                    <div>
                       <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-semibold uppercase tracking-widest text-white border-b-2 border-accent pb-1">
                            Popular Reviews
                          </h3>
                          <span className="text-xs text-gray-500 hover:text-white cursor-pointer transition-colors">
                             More
                          </span>
                       </div>

                       <div className="flex flex-col">
                          {cafeData.reviews.map((review, i) => (
                             <ReviewCard key={i} review={review} />
                          ))}
                       </div>
                    </div>
                 </>
               ) : null}
            </div>
          </div>
        </main>
      )}
      
      {/* FOOTER */}
      <footer className="max-w-[950px] mx-auto px-8 py-12 text-center text-xs text-gray-600">
         <p className="mb-2">
            &copy; 2024 Latteboxd. Generated by Google Gemini.
         </p>
         <div className="flex justify-center gap-4">
            <span className="hover:text-white cursor-pointer">About</span>
            <span className="hover:text-white cursor-pointer">News</span>
            <span className="hover:text-white cursor-pointer">Pro</span>
            <span className="hover:text-white cursor-pointer">Apps</span>
            <span className="hover:text-white cursor-pointer">Podcast</span>
            <span className="hover:text-white cursor-pointer">Help</span>
         </div>
      </footer>
    </div>
  );
};

export default App;
import React, { useState } from 'react';
import { AZAM_NEWS } from '../data';
import { NewsArticle } from '../types';
import { Play, Calendar, Star, HelpCircle, ArrowRight, X, Heart, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  isOffline: boolean;
  onLikeNews: (id: string) => void;
  likedNewsIds: string[];
}

export default function Dashboard({ onNavigate, isOffline, onLikeNews, likedNewsIds }: DashboardProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  // Filter categories
  const categories = ['All', 'Match Report', 'Behind the Scenes', 'Interview', 'Training'];

  const filteredNews = AZAM_NEWS.filter((news) => {
    const matchesCategory = selectedCategory === 'All' || news.category === selectedCategory;
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8" id="dashboard-tab">
      {/* Dynamic Scrolling Breaking News Banner */}
      <div className="bg-red-600 text-white py-2 px-4 shadow-md overflow-hidden flex items-center space-x-3 rounded-lg" id="breaking-news-ticker">
        <span className="bg-white text-red-700 text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider shrink-0 animate-pulse">
          BREAKING
        </span>
        <div className="scroll-smooth whitespace-nowrap overflow-hidden text-xs md:text-sm font-semibold tracking-wide">
          <span className="inline-block animate-[marquee_25s_linear_infinite]">
            🚨 LATEST: Azam FC secures massive 2-1 Swahili Derby victory! 🔥 Custom Name Jerseys now available in the official Azam FC Store! Cap 18,000 TZS. 🏟️ Chamazi pitch upgrade fully complete with real hybrid-grass water drainage tech!
          </span>
        </div>
      </div>

      {/* Hero Spotlight Section */}
      <section className="relative rounded-2xl overflow-hidden bg-blue-950 text-white shadow-2xl border border-blue-900" id="hero-banner">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-900/40 to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200"
          alt="Azam FC Team Spotlight"
          className="w-full h-[320px] md:h-[400px] object-cover scale-105 filter brightness-75 hover:scale-100 transition-all duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20 space-y-3">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-400">
              FEATURED MATCH REPORT
            </span>
            <span className="bg-yellow-500 text-blue-950 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              DERBY DAY WIN
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-sans font-black tracking-tight leading-none text-white drop-shadow-md">
            Wanalamani Triumph over Simba SC at National Ground!
          </h1>
          <p className="text-sm md:text-base text-gray-200 max-w-2xl font-light">
            An absolute masterclass from Feisal Salum (Fei Toto) and Kipre Junior secures all three points for the Azam Football Club under the floodlights.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('matchcenter')}
              className="bg-yellow-500 hover:bg-yellow-400 text-blue-950 font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center space-x-2 text-sm shadow-lg shadow-yellow-500/10 cursor-pointer"
            >
              <Play size={16} fill="currentColor" />
              <span>Watch Match Highlights</span>
            </button>
            <button
              onClick={() => onNavigate('shop')}
              className="bg-blue-900/60 hover:bg-blue-900 text-white font-semibold px-5 py-2.5 rounded-lg border border-blue-700/80 transition-colors text-sm cursor-pointer"
            >
              Get Tickets Online
            </button>
          </div>
        </div>
      </section>

      {/* Fan Engagement & Quick Action Bento Hub */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="bento-quick-actions">
        {/* Ticket booking visual card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl p-5 border border-slate-800 text-white flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-yellow-400">
              <Calendar size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">NEXT HOME FIXTURE</span>
            </div>
            <h3 className="text-lg font-bold font-sans text-white">Azam FC Vs Coastal Union</h3>
            <p className="text-xs text-slate-300">Chamazi Sports Complex, Dar es Salaam. Secure your VIP seating now and beat the rush.</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-xs transition-colors flex items-center justify-center space-x-2 group cursor-pointer"
          >
            <span>Book Tickets Instantly</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Custom Jersey designer card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-blue-400">
              <Star size={20} className="fill-blue-400/20 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider">OFFICIAL JERSEY CUSTOMIZATION</span>
            </div>
            <h3 className="text-lg font-bold font-sans text-white">Draft Your Name on Jersey</h3>
            <p className="text-xs text-slate-450">Pick home royal blue or away pristine white. Type your squad number and claim your custom jersey. 35,000 TZS.</p>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Design My Jersey
          </button>
        </div>

        {/* AI Trivia Portal banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between shadow-xl space-y-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-amber-500">
              <HelpCircle size={20} />
              <span className="text-xs font-bold uppercase tracking-wider">AI FAN EXPERT TRIVIA</span>
            </div>
            <h3 className="text-lg font-bold font-sans text-white">Earn 100 Reward Points</h3>
            <p className="text-xs text-slate-450">Test your Azam FC loyalty questions generated live by Gemini. Level up your active Gold tier!</p>
          </div>
          <button
            onClick={() => onNavigate('media')}
            className="w-full bg-amber-600 hover:bg-amber-550 text-white py-2 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
          >
            Start Trivia Game
          </button>
        </div>
      </div>

      {/* Breaking News Feed Section */}
      <section className="space-y-6" id="news-section">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl font-sans font-black tracking-tight text-white">
              Chamazi News & Exclusive Media
            </h2>
            <p className="text-xs text-slate-400">Stay up to date with match bulletins, interviews, and pitch-side reports.</p>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white border-blue-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search tool */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search news articles, matches, training insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            id="news-search-input"
          />
        </div>

        {/* Filtered Grid list */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="news-grid-container">
          {filteredNews.map((news) => {
            const isLiked = likedNewsIds.includes(news.id);
            return (
              <article
                key={news.id}
                id={`news-card-${news.id}`}
                className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800/80 shadow-md hover:shadow-xl hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 bg-slate-950/95 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {news.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <span className="text-xs text-slate-500 font-medium font-mono">{news.date}</span>
                    <h3 className="text-lg font-bold text-white font-sans tracking-tight line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {news.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 bg-slate-950/40 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400" id={`news-actions-${news.id}`}>
                  <div className="flex items-center space-x-3.5">
                    <button
                      onClick={() => onLikeNews(news.id)}
                      className={`flex items-center space-x-1 outline-none select-none ${
                        isLiked ? 'text-rose-400 font-semibold' : 'hover:text-rose-400 text-slate-400'
                      }`}
                      title={isLiked ? "Unlike article" : "Like article"}
                    >
                      <Heart size={14} className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
                      <span>{news.likes + (isLiked ? 1 : 0)}</span>
                    </button>
                    <div className="flex items-center space-x-1 text-slate-400">
                      <Eye size={14} />
                      <span>{news.views} reads</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedArticle(news)}
                    className="text-blue-400 hover:text-blue-300 font-bold flex items-center space-x-0.5 cursor-pointer"
                  >
                    <span>Read Article</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {filteredNews.length === 0 && (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl" id="news-not-found">
            <HelpCircle size={40} className="mx-auto text-slate-600 mb-2" />
            <p className="text-sm font-semibold text-slate-400">No matching news articles found</p>
            <p className="text-xs text-slate-500">Try modifying your search or choosing a different filter.</p>
          </div>
        )}
      </section>

      {/* Article Detail Modal View */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            id="article-modal"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-slate-900 text-slate-100 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-800"
            >
              <div className="relative h-64 bg-slate-950">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button
                  onClick={() => setSelectedArticle(null)}
                  className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-colors cursor-pointer"
                  id="close-article-modal"
                >
                  <X size={18} />
                </button>
                <div className="absolute bottom-4 left-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedArticle.category}
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-4">
                <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
                  <span>Published: {selectedArticle.date}</span>
                  <span>•</span>
                  <span>Views: {selectedArticle.views + 122}</span>
                </div>

                <h2 className="text-2xl font-sans font-black text-white leading-tight">
                  {selectedArticle.title}
                </h2>

                <p className="text-sm font-semibold text-slate-300 border-l-4 border-blue-600 pl-3 leading-relaxed">
                  {selectedArticle.summary}
                </p>

                <div className="text-xs font-normal text-slate-300 leading-relaxed whitespace-pre-line border-t border-slate-800 pt-4" id="article-long-content">
                  {selectedArticle.content}
                </div>

                {isOffline && (
                  <div className="bg-amber-950/20 text-amber-300 text-xs p-3 rounded-lg border border-amber-900/30">
                    💡 <strong>Offline Mode Active:</strong> You are viewing this archived bulletin from your offline-ready lambani index. Comments are synchronized upon reconnection.
                  </div>
                )}

                <div className="flex justify-end pt-4 border-t border-slate-800">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-blue-600 hover:bg-blue-550 text-white font-bold px-6 py-2 rounded-lg text-xs tracking-wide cursor-pointer"
                  >
                    Done Reading
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

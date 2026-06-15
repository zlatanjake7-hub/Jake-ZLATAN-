import React, { useState, useEffect } from 'react';
import { AZAM_REELS, AZAM_PODCASTS } from '../data';
import { FootballReel, PodcastEpisode } from '../types';
import { Play, Pause, Heart, MessageSquare, Volume2, Sparkles, HelpCircle, RefreshCw, Trophy, CheckCircle, XCircle, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MediaHubProps {
  isOffline: boolean;
  onAwardPoints: (points: number) => void;
}

interface TriviaQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export default function MediaHub({ isOffline, onAwardPoints }: MediaHubProps) {
  // Reels state
  const [reels, setReels] = useState<FootballReel[]>(AZAM_REELS);
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [commentInput, setCommentInput] = useState<string>('');
  const [reelComments, setReelComments] = useState<Record<string, string[]>>({
    r1: ['Fei Toto is a magician!', 'Aiseee nusu uwanja amepiga goli tamu sana!', 'Best goal of the season!'],
    r2: ['Ali Ahmada is the safest hands in Tanzania', 'Double save of the match!'],
    r3: ['Huyu mchezaji asije Simba, abaki Azam tu haha', 'Kipre Junior style is incredible.']
  });

  // Podcast state
  const [playingPodId, setPlayingPodId] = useState<string | null>(null);
  const [podProgress, setPodProgress] = useState<number>(0);
  const [currentPodIndex, setCurrentPodIndex] = useState<number>(0);

  // Trivia state
  const [trivia, setTrivia] = useState<TriviaQuestion | null>(null);
  const [loadingTrivia, setLoadingTrivia] = useState<boolean>(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [scoreGranted, setScoreGranted] = useState<boolean>(false);

  // Auto-progress simulated podcast
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (playingPodId) {
      interval = setInterval(() => {
        setPodProgress((prev) => {
          if (prev >= 100) {
            setPlayingPodId(null);
            return 0;
          }
          return prev + 2;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [playingPodId]);

  // Load Gemini Trivia on load
  useEffect(() => {
    fetchTriviaQuestion();
  }, []);

  const fetchTriviaQuestion = async () => {
    setLoadingTrivia(true);
    setTrivia(null);
    setSelectedOptionIndex(null);
    setSubmitted(false);
    setScoreGranted(false);

    try {
      const response = await fetch('/api/gemini/trivia');
      if (response.ok) {
        const data = await response.json();
        setTrivia(data);
      } else {
        throw new Error('Fallback target due to API status');
      }
    } catch (e) {
      // Offline fallback / error fallback
      setTrivia({
        question: "In which year was Azam Football Club officially founded by the Bakhresa Group?",
        options: ["2005", "2007", "2010", "1998"],
        answerIndex: 1,
        explanation: "Azam FC was founded in 2007. They quickly grew to became the top challengers in East African soccer!"
      });
    } finally {
      setLoadingTrivia(false);
    }
  };

  const handleTriviaSubmit = () => {
    if (selectedOptionIndex === null || !trivia) return;
    setSubmitted(true);
    if (selectedOptionIndex === trivia.answerIndex) {
      setScoreGranted(true);
      onAwardPoints(100); // Grant 100 points
    }
  };

  const handleLikeReel = (id: string) => {
    setReels(prev => prev.map(r => r.id === id ? { ...r, likes: r.likes + 1 } : r));
  };

  const handlePostComment = (reelId: string) => {
    if (!commentInput.trim()) return;
    setReelComments(prev => ({
      ...prev,
      [reelId]: [...(prev[reelId] || []), commentInput]
    }));
    setCommentInput('');
  };

  return (
    <div className="space-y-8" id="media-tab">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Col: Reels / Videos and Podcast Audio */}
        <div className="space-y-8" id="video-and-audio-media">
          {/* Scrolling Football Reels */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1.5">
              <Play size={18} className="text-blue-500 fill-blue-500" />
              <span>Azam TV micro reels</span>
              <span className="bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase ml-2 animate-pulse">REELS</span>
            </h3>

            {/* Reel Player Simulator */}
            <div className="bg-black rounded-xl overflow-hidden aspect-[9/12] relative flex flex-col justify-end p-5" id="reel-player">
              <img
                src={reels[activeReelIndex].thumbnail}
                alt={reels[activeReelIndex].title}
                className="absolute inset-0 w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/50 to-transparent p-5 space-y-3 z-10 text-white">
                <div className="flex items-center space-x-2">
                  <span className="bg-white/25 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    @{reels[activeReelIndex].uploader}
                  </span>
                  <span className="text-[10px] text-slate-300 font-mono flex items-center">
                    <Eye size={10} className="mr-0.5" />
                    <span>{reels[activeReelIndex].views} Views</span>
                  </span>
                </div>
                <h4 className="text-sm font-bold leading-tight font-sans text-yellow-305">
                  {reels[activeReelIndex].title}
                </h4>

                {/* Micro Actions bar */}
                <div className="flex items-center justify-between border-t border-white/10 pt-2 text-xs">
                  <button
                    onClick={() => handleLikeReel(reels[activeReelIndex].id)}
                    className="flex items-center space-x-1 hover:text-rose-400 select-none outline-none"
                  >
                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                    <span>{reels[activeReelIndex].likes}</span>
                  </button>
                  <span className="text-slate-300 font-mono">Reel {activeReelIndex + 1} of {reels.length}</span>
                </div>
              </div>

              {/* Next/Prev Reel overlays */}
              <div className="absolute top-1/2 -translate-y-1/2 inset-x-2 flex justify-between z-20">
                <button
                  onClick={() => setActiveReelIndex(prev => (prev === 0 ? reels.length - 1 : prev - 1))}
                  className="bg-black/55 hover:bg-black/85 text-white p-1.5 rounded-full text-xs cursor-pointer"
                >
                  ◀
                </button>
                <button
                  onClick={() => setActiveReelIndex(prev => (prev === reels.length - 1 ? 0 : prev + 1))}
                  className="bg-black/55 hover:bg-black/85 text-white p-1.5 rounded-full text-xs cursor-pointer"
                >
                  ▶
                </button>
              </div>
            </div>

            {/* Reel Comments Section */}
            <div className="space-y-3" id="reel-comments">
              <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Comments list</span>
              <div className="space-y-2 bg-slate-950 p-3 rounded-lg border border-slate-850 max-h-36 overflow-y-auto">
                {(reelComments[reels[activeReelIndex].id] || []).map((comment, idx) => (
                  <div key={idx} className="text-xs text-slate-300">
                    <span className="font-bold text-white mr-1.5">Amina Bakhresa:</span>
                    <span>{comment}</span>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 text-xs">
                <input
                  type="text"
                  placeholder="Share your thoughts about this gol..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 text-slate-200 placeholder-slate-500 px-3 py-2 rounded-lg outline-none focus:border-blue-500"
                />
                <button
                  onClick={() => handlePostComment(reels[activeReelIndex].id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 rounded-lg cursor-pointer"
                >
                  Post
                </button>
              </div>
            </div>
          </div>

          {/* Podcast Simulator */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1.5">
              <Volume2 size={18} className="text-blue-500" />
              <span>Azam Zone Podcast Channel</span>
            </h3>

            {/* Episodes List */}
            <div className="space-y-3" id="podcast-episodes-panel">
              {AZAM_PODCASTS.map((pod) => {
                const isPlaying = playingPodId === pod.id;
                return (
                  <div
                    key={pod.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between ${
                      isPlaying ? 'bg-slate-950 border-blue-600' : 'bg-slate-950/40 border-slate-850/60'
                    }`}
                  >
                    <div className="space-y-1 max-w-[240px]">
                      <h4 className="text-xs font-bold text-white font-sans">{pod.title}</h4>
                      <p className="text-[10px] text-slate-400 leading-normal line-clamp-2">{pod.description}</p>
                      <div className="flex items-center space-x-1 text-[9px] text-slate-500">
                        <span>Host: {pod.host}</span>
                        <span>•</span>
                        <span>{pod.duration} mins</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (isPlaying) {
                          setPlayingPodId(null);
                        } else {
                          setPlayingPodId(pod.id);
                          setPodProgress(0);
                        }
                      }}
                      className="bg-blue-600 hover:bg-blue-700 select-none text-white p-2.5 rounded-full flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/10"
                    >
                      {isPlaying ? <Pause size={14} /> : <Play size={14} fill="currentColor" />}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Active Podcast Player footer progress */}
            {playingPodId && (
              <div className="bg-slate-950 border border-slate-800 text-white p-3.5 rounded-xl space-y-2 animate-pulse" id="podcast-progress-bar">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-semibold text-yellow-300">STREAMING EXCLUSIVE AUDIO BROADCAST</span>
                  <span>{podProgress}%</span>
                </div>
                <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-yellow-400 transition-all duration-1000" style={{ width: `${podProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Gemini Powered Trivia Game */}
        <div className="space-y-6" id="fan-interactive-trivia">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400 font-sans font-bold text-base">
                <Sparkles size={18} className="text-amber-500 animate-spin" />
                <span>AI Supporter Trivia Challenge</span>
              </div>
              <p className="text-xs text-slate-400">
                Correct answers net you 100 active points. Test your memory of Azam FC achievements!
              </p>
            </div>

            <AnimatePresence mode="wait">
              {loadingTrivia ? (
                <div className="text-center py-12 space-y-2" key="loading">
                  <RefreshCw size={24} className="animate-spin mx-auto text-amber-400" />
                  <p className="text-xs text-slate-400 font-semibold uppercase">Consulting Gemini records...</p>
                </div>
              ) : trivia ? (
                <div className="space-y-5" key="trivia-data" id="active-trivia-block">
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-850">
                    <span className="text-[10px] bg-amber-950/45 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase mb-2 inline-block border border-amber-900/35">
                      QUESTION
                    </span>
                    <h4 className="text-sm font-sans font-black text-slate-200 leading-snug">
                      {trivia.question}
                    </h4>
                  </div>

                  {/* Options lists */}
                  <div className="space-y-2">
                    {trivia.options.map((opt, idx) => {
                      const isSelected = selectedOptionIndex === idx;
                      return (
                        <button
                          key={idx}
                          id={`trivia-opt-${idx}`}
                          onClick={() => !submitted && setSelectedOptionIndex(idx)}
                          className={`w-full p-3 rounded-xl border text-left text-xs font-semibold transition-all select-none outline-none ${
                            isSelected
                              ? 'bg-amber-950/45 border-amber-600 text-amber-200 shadow-md'
                              : 'bg-slate-950 border border-slate-850/80 hover:bg-slate-800/60 text-slate-300'
                          }`}
                          disabled={submitted}
                        >
                          <span className="text-[10px] text-amber-500 mr-2 uppercase">Option {String.fromCharCode(65 + idx)}:</span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Submit block */}
                  {!submitted ? (
                    <button
                      onClick={handleTriviaSubmit}
                      disabled={selectedOptionIndex === null}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50"
                      id="submit-trivia-btn"
                    >
                      Verify Answer
                    </button>
                  ) : (
                    <div className="space-y-4 animate-fade-in" id="trivia-result-block">
                      {scoreGranted ? (
                        <div className="flex items-center space-x-2 text-green-405 bg-green-950/20 p-3 rounded-lg border border-green-900/35" id="correct-alert">
                          <CheckCircle size={18} className="text-green-500" />
                          <span className="text-xs font-bold text-green-300">Safii Sana! Correct! +100 Points Awarded To Profile!</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-rose-300 bg-red-950/20 p-3 rounded-lg border border-red-900/35" id="wrong-alert">
                          <XCircle size={18} className="text-red-500" />
                          <span className="text-xs font-bold text-red-300">Aisee pole! Incorrect. True answer was Option {String.fromCharCode(65 + trivia.answerIndex)}.</span>
                        </div>
                      )}

                      <div className="bg-slate-950 p-3.5 rounded-xl text-xs text-slate-300 border border-slate-850">
                        <strong>Explanation:</strong> {trivia.explanation}
                      </div>

                      <button
                        onClick={fetchTriviaQuestion}
                        className="w-full bg-amber-600 hover:bg-amber-550 text-white font-bold py-2 rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-1"
                      >
                        <RefreshCw size={13} />
                        <span>Try Next AI Question</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

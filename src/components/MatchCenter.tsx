import React, { useState, useEffect } from 'react';
import { AZAM_MATCHES } from '../data';
import { Match, MatchEvent } from '../types';
import { Tv, Radio, MessageSquare, AlertCircle, Play, ShieldAlert, Sparkles, Send, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MatchCenterProps {
  isOffline: boolean;
  isSubscribed: boolean;
  onSubscribe: () => void;
}

export default function MatchCenter({ isOffline, isSubscribed, onSubscribe }: MatchCenterProps) {
  const [matches, setMatches] = useState<Match[]>(() => {
    // try to load from local storage first to respect offline persistence
    const saved = localStorage.getItem('azam_matches_live');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return AZAM_MATCHES; }
    }
    return AZAM_MATCHES;
  });

  const [selectedMatch, setSelectedMatch] = useState<Match>(matches[1]); // Young Africans SC vs Azam FC (live)
  const [commentaryPrompt, setCommentaryPrompt] = useState<string>('');
  const [aiCommentary, setAiCommentary] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [streamActive, setStreamActive] = useState<boolean>(false);

  // Auto-sync schedule state to local storage when matches change
  useEffect(() => {
    localStorage.setItem('azam_matches_live', JSON.stringify(matches));
  }, [matches]);

  // Periodic simulated game ticker for live match (index 1) which ticks every 15 seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isSimulating) {
      interval = setInterval(() => {
        setMatches((prevMatches) => {
          return prevMatches.map((m) => {
            if (m.id === 'm2' && m.status === 'live') {
              const currentMinutes = m.events.length > 0 ? (m.events[m.events.length - 1].minute + 6) : 46;
              if (currentMinutes >= 90) {
                // End game
                const finalEvents: MatchEvent[] = [
                  ...m.events,
                  {
                    id: `me-event-${Date.now()}`,
                    minute: 90,
                    type: 'whistle',
                    description: 'Full-time whistle blows! Thrilling match comes to an end!'
                  }
                ];
                return {
                  ...m,
                  status: 'finished' as const,
                  events: finalEvents
                };
              }

              // Normal progress / potential goal
              const shouldScore = Math.random() < 0.25;
              const isHomeScore = Math.random() < 0.4;
              let isGoalEvent = false;
              let description = `A technical run in midfield from ${isHomeScore ? 'Yanga' : 'Azam FC'} midfield block.`;
              let scoreUpdate = [...m.stats.shots];

              if (shouldScore) {
                isGoalEvent = true;
                if (!isHomeScore) {
                  const goalsBy = ['Feisal Salum', 'Gibril Sillah', 'Kipre Junior'][Math.floor(Math.random() * 3)];
                  description = `GOOOOL! Beautiful team effort finished smoothly by ${goalsBy} inside the 18-yard box!`;
                } else {
                  description = `Goal for Young Africans SC. High aerial ball converted inside the keeper's near post.`;
                }
              }

              const newEvent: MatchEvent = {
                id: `me-event-${Date.now()}`,
                minute: currentMinutes,
                type: isGoalEvent ? 'goal' : 'info',
                description,
                team: isHomeScore ? 'home' : 'away',
                player: isGoalEvent ? (isHomeScore ? 'Yanga Forward' : 'Azam Star') : undefined
              };

              // Update scores
              const nextHomeScore = isGoalEvent && isHomeScore ? m.homeScore + 1 : m.homeScore;
              const nextAwayScore = isGoalEvent && !isHomeScore ? m.awayScore + 1 : m.awayScore;

              const nextStats = {
                ...m.stats,
                possession: isHomeScore ? [m.stats.possession[0] + 1, m.stats.possession[1] - 1] as [number, number] : [m.stats.possession[0] - 1, m.stats.possession[1] + 1] as [number, number],
                shots: isHomeScore ? [m.stats.shots[0] + 1, m.stats.shots[1]] as [number, number] : [m.stats.shots[0], m.stats.shots[1] + 1] as [number, number]
              };

              return {
                ...m,
                homeScore: nextHomeScore,
                awayScore: nextAwayScore,
                events: [...m.events, newEvent],
                stats: nextStats
              };
            }
            return m;
          });
        });
      }, 8000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Keep selectedMatch updated with simulated progress
  useEffect(() => {
    const liveMatch = matches.find((m) => m.id === selectedMatch.id);
    if (liveMatch) {
      setSelectedMatch(liveMatch);
    }
  }, [matches, selectedMatch.id]);

  // Handle server-side Gemini commentary generation
  const handleGetAiCommentary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      setAiCommentary("Baraka Mpenja: Aiseee mtu wangu, hauwezi kuwasiliana na Gemini AI ukiwa offline kabisa! Hakikisha una mtandao na ujaribu tena!");
      return;
    }

    setIsAiLoading(true);
    setAiCommentary('');

    try {
      const response = await fetch('/api/gemini/commentate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          matchData: {
            homeTeam: selectedMatch.homeTeam,
            awayTeam: selectedMatch.awayTeam,
            homeScore: selectedMatch.homeScore,
            awayScore: selectedMatch.awayScore,
            competition: selectedMatch.competition,
            venue: selectedMatch.venue
          },
          contextInput: commentaryPrompt
        })
      });

      const data = await response.json();
      if (response.ok && data.commentary) {
        setAiCommentary(data.commentary);
      } else {
        throw new Error(data.error || "Failed API response");
      }
    } catch (err: any) {
      setAiCommentary("Aiseee! Soka safi sana hapa! Wanalambani wanapigana kiume huku Fei Toto akisukuma makali upande wa kulia! (Muunganisho ulikata, lakini mhemko upo!)");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-8" id="matchcenter-tab">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-sans font-black tracking-tight text-white">Matchday Watch & live center</h2>
        <p className="text-xs text-slate-400">Track scores, watch the livestream, or query AI play-by-play highlights.</p>
      </div>

      {/* Match selector lists */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4" id="matchday-selector-grid">
        {matches.map((m) => {
          const isLive = m.status === 'live';
          const isFinished = m.status === 'finished';
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMatch(m)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedMatch.id === m.id
                  ? 'bg-blue-650 border-blue-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60 text-slate-200'
              }`}
            >
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span className={isLive ? 'text-red-400 animate-pulse font-bold' : selectedMatch.id === m.id ? 'text-yellow-400' : 'text-slate-400'}>
                  {isLive ? '● LIVE' : isFinished ? 'FINISHED' : 'UPCOMING'}
                </span>
                <span className="opacity-80">{m.competition}</span>
              </div>
              <div className="flex justify-between items-center space-y-1">
                <div>
                  <div className="flex items-center space-x-1 font-bold">
                    <span>{m.homeLogo}</span>
                    <span className="truncate max-w-[120px]">{m.homeTeam}</span>
                  </div>
                  <div className="flex items-center space-x-1 font-bold">
                    <span>{m.awayLogo}</span>
                    <span className="truncate max-w-[120px]">{m.awayTeam}</span>
                  </div>
                </div>
                {!isLive && !isFinished ? (
                  <div className="text-right">
                    <span className="block text-xs font-mono">{m.time}</span>
                    <span className="block text-[10px] font-sans opacity-70">{m.date.split('-')[2]}/{m.date.split('-')[1]}</span>
                  </div>
                ) : (
                  <div className="text-right text-lg font-mono font-black" id={`matchcenter-score-${m.id}`}>
                    <span>{m.homeScore} - {m.awayScore}</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </section>

      {/* Main Focus: Selected Match Arena */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="match-center-arena">
        {/* Left 2 cols: Play-by-play and Match info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-6 text-white text-center border border-slate-850 shadow-2xl space-y-6">
            <div className="flex justify-between items-center text-xs">
              <span className="bg-blue-800/80 px-3 py-1 rounded-full">{selectedMatch.competition}</span>
              <span className="text-yellow-400 font-mono flex items-center space-x-1">
                <span>{selectedMatch.venue}</span>
              </span>
            </div>

            {/* Core Scoreboard Display */}
            <div className="flex justify-around items-center py-4" id="arena-scoreboard">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-4xl">{selectedMatch.homeLogo}</span>
                <span className="font-bold text-sm md:text-base tracking-wide max-w-[120px]">{selectedMatch.homeTeam}</span>
              </div>

              <div className="flex flex-col justify-center items-center">
                {selectedMatch.status === 'upcoming' ? (
                  <div className="space-y-1">
                    <span className="text-lg font-mono tracking-widest block font-black text-yellow-400">VS</span>
                    <span className="text-xs text-gray-300 block">{selectedMatch.date} • {selectedMatch.time}</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <span className="text-4xl md:text-5xl font-mono font-black tracking-tighter text-yellow-400" id="live-match-score-text">
                      {selectedMatch.homeScore} : {selectedMatch.awayScore}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-widest block bg-white/10 text-white rounded-full px-3 py-0.5 animate-pulse`}>
                      {selectedMatch.status === 'live' ? 'Playing 2nd Half' : 'Completed'}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center space-y-2">
                <span className="text-4xl">{selectedMatch.awayLogo}</span>
                <span className="font-bold text-sm md:text-base tracking-wide max-w-[120px]">{selectedMatch.awayTeam}</span>
              </div>
            </div>

            {/* Simulation controls for active live match */}
            {selectedMatch.status === 'live' && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 bg-white/5 p-3.5 rounded-xl border border-white/10" id="sim-controls">
                <p className="text-xs text-gray-200">
                  ⚡ Play simulation to drive automated match events & updates!
                </p>
                <button
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={`px-4 py-2 rounded-lg font-bold text-xs transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    isSimulating
                      ? 'bg-amber-600 hover:bg-amber-500 text-white'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                  id="sim-ticker-btn"
                >
                  <RefreshCw size={13} className={isSimulating ? 'animate-spin' : ''} />
                  <span>{isSimulating ? 'Pause Simulating' : 'Simulate Match Live'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Statistics Card */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-sans">Real-time match analytics</h3>
            <div className="space-y-3.5" id="arena-stats-bars">
              {/* Possession */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Possession ({selectedMatch.homeTeam})</span>
                  <span>{selectedMatch.stats.possession[0]}% - {selectedMatch.stats.possession[1]}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-slate-950 flex">
                  <div className="bg-blue-650" style={{ width: `${selectedMatch.stats.possession[0]}%` }} />
                  <div className="bg-red-500" style={{ width: `${selectedMatch.stats.possession[1]}%` }} />
                </div>
              </div>

              {/* Shots */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Total Shots (Target)</span>
                  <span>
                    {selectedMatch.stats.shots[0]} ({selectedMatch.stats.shotsOnTarget[0]}) - {selectedMatch.stats.shots[1]} ({selectedMatch.stats.shotsOnTarget[1]})
                  </span>
                </div>
                <div className="h-2 rounded-full overflow-hidden bg-slate-950 flex">
                  <div className="bg-blue-650" style={{ width: `${(selectedMatch.stats.shots[0] / (selectedMatch.stats.shots[0] + selectedMatch.stats.shots[1] || 1)) * 100}%` }} />
                  <div className="bg-red-500" style={{ width: `${(selectedMatch.stats.shots[1] / (selectedMatch.stats.shots[0] + selectedMatch.stats.shots[1] || 1)) * 100}%` }} />
                </div>
              </div>

              {/* Corners & Fouls */}
              <div className="grid grid-cols-2 gap-4 text-center border-t border-slate-800 pt-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Fouls Committed</span>
                  <span className="text-sm font-mono font-black text-slate-205">
                    {selectedMatch.stats.fouls[0]} vs {selectedMatch.stats.fouls[1]}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block">Corner Kicks</span>
                  <span className="text-sm font-mono font-black text-slate-205">
                    {selectedMatch.stats.corners[0]} vs {selectedMatch.stats.corners[1]}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Match Events timeline */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-sans">Play-by-play timeline</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2 scrollbar-thin" id="play-by-play-timeline">
              {selectedMatch.events.length > 0 ? (
                selectedMatch.events.slice().reverse().map((ev, idx) => (
                  <div key={ev.id || idx} className="flex space-x-3 text-xs border-l-2 border-slate-800 pl-4 relative">
                    <span className="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-blue-600 flex items-center justify-center text-[8px] text-white">
                      {ev.minute}'
                    </span>
                    <div className="space-y-0.5">
                      <span className="font-bold text-slate-400 uppercase tracking-widest text-[9px] block">
                        {ev.type} • {ev.minute}th Min
                      </span>
                      <p className="text-slate-350 leading-relaxed">{ev.description}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500" id="empty-timeline">
                  <Tv size={24} className="mx-auto mb-1 opacity-40 animate-pulse" />
                  <p className="text-xs">No active match event telemetry reported yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 col: Video watch player (Premium checked) & Gemini commentary box */}
        <div className="space-y-6">
          {/* Watch live box */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4 flex flex-col justify-between" id="stream-watch-widget">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1.5">
                <Tv size={18} className="text-blue-500" />
                <span>Live stream lobby</span>
              </h3>
              <p className="text-xs text-slate-400">Tune in for high speed broadcast signals directly from Azam Play.</p>
            </div>

            {streamActive ? (
              <div className="relative rounded-lg overflow-hidden bg-black aspect-video flex flex-col justify-center items-center text-center p-4">
                {/* Simulated embedded stream */}
                <span className="text-red-550 absolute top-2 right-2 flex items-center space-x-1 font-bold text-[10px] animate-pulse bg-black/60 px-2 py-0.5 rounded-full">
                  <span>LIVE FEED</span>
                </span>
                <Play size={36} className="text-white bg-blue-600/80 hover:bg-blue-600 p-2.5 rounded-full cursor-not-allowed mb-2 animate-bounce" />
                <p className="text-xs text-white font-mono font-bold">AZAM PLAY PRE-STREAM CH 1</p>
                <p className="text-[10px] text-slate-400 max-w-[200px]">Connected successfully. Watch commentary feed below.</p>
              </div>
            ) : (
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-850 text-center space-y-3">
                <ShieldAlert size={36} className="mx-auto text-blue-500 animate-pulse" />
                <div className="space-y-1">
                  <span className="block text-xs font-semibold text-white">Premium Broadcast Key Required</span>
                  <p className="text-[10px] text-slate-400">
                    Live match video requires a valid Platinum or Silver membership subscription.
                  </p>
                </div>
                {isSubscribed ? (
                  <button
                    onClick={() => setStreamActive(true)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Launch Stream
                  </button>
                ) : (
                  <button
                    onClick={onSubscribe}
                    className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Subscribe Now (35K TZS)
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Gemini AI Live Commentary Generator */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4" id="gemini-commentary-widget">
            <div className="space-y-1">
              <div className="flex items-center space-x-1.5 text-sky-400 font-sans font-bold text-sm">
                <Sparkles size={16} className="text-yellow-550 animate-bounce" />
                <span>Ask Baraka Mpenja (AI Commentator)</span>
              </div>
              <p className="text-xs text-slate-400">
                Get Swahili-English football yells & descriptions based on the scoreline.
              </p>
            </div>

            <form onSubmit={handleGetAiCommentary} className="space-y-3">
              <input
                type="text"
                placeholder="e.g. yell Goal for Fei Toto / analyze match"
                value={commentaryPrompt}
                onChange={(e) => setCommentaryPrompt(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={isAiLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>Analyzing Soka...</span>
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    <span>Generate AI Swahili Commentary</span>
                  </>
                )}
              </button>
            </form>

            {/* Generated display box */}
            {aiCommentary && (
              <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-850 text-xs shadow-inner space-y-1 animate-fade-in" id="commentary-output">
                <span className="font-bold text-sky-400 uppercase tracking-widest text-[9px] block">🎙️ Microphone Live:</span>
                <p className="text-slate-200 leading-relaxed italic">"{aiCommentary}"</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

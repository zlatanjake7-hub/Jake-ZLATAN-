import React, { useState } from 'react';
import { AZAM_PLAYERS } from '../data';
import { Player } from '../types';
import { Shield, Eye, Flame, Award, Heart, Search } from 'lucide-react';

export default function Squad() {
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'goals' | 'assists' | 'matches'>('goals');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const positions = ['All', 'Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

  // Process player roster
  const filteredPlayers = AZAM_PLAYERS.filter((player) => {
    const matchesPos = selectedPosition === 'All' || player.position === selectedPosition;
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          player.nationality.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPos && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'goals') return b.stats.goals - a.stats.goals;
    if (sortBy === 'assists') return b.stats.assists - a.stats.assists;
    return b.stats.matchesPlayed - a.stats.matchesPlayed;
  });

  return (
    <div className="space-y-8" id="squad-tab">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-2xl font-sans font-black tracking-tight text-white">Team Squad & player stats</h2>
          <p className="text-xs text-slate-400">View roster statistics, player goals, clean sheets, and caps.</p>
        </div>

        {/* Sorting options */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Rank By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-900 text-slate-100 border border-slate-800 rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
            id="squad-sort-select"
          >
            <option value="goals">Top Goalscorers</option>
            <option value="assists">Top Playmakers (Assists)</option>
            <option value="matches">Most Match Appearances</option>
          </select>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4" id="squad-filters-toolbar">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search players by name, nationality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-100 placeholder-slate-500 pl-9 pr-4 py-2 rounded-lg text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
            id="squad-search-input"
          />
        </div>

        {/* Tab filters */}
        <div className="flex space-x-1 overflow-x-auto pb-1 scrollbar-none shrink-0 border-b border-slate-800 md:border-b-0">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setSelectedPosition(pos)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedPosition === pos
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-white'
              }`}
            >
              {pos}s
            </button>
          ))}
        </div>
      </div>

      {/* Players grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" id="squad-grid-container">
        {filteredPlayers.map((player) => (
          <div
            key={player.id}
            id={`player-card-${player.id}`}
            className="bg-slate-900 rounded-xl border border-slate-800/80 shadow-md hover:shadow-2xl hover:border-slate-700 transition-all overflow-hidden flex flex-col justify-between"
          >
            {/* Player Avatar */}
            <div className="relative bg-slate-950 h-56">
              <img
                src={player.avatar}
                alt={player.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 bg-slate-900 border border-slate-750 text-yellow-400 font-mono font-black rounded-lg w-10 h-10 flex items-center justify-center text-xl shadow-lg">
                #{player.number}
              </span>
              <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {player.position}
              </span>
            </div>

            {/* General Info */}
            <div className="p-4 space-y-4">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{player.nationality}</span>
                <h4 className="text-sm font-sans font-black text-white truncate">{player.name}</h4>
              </div>

              {/* Core numbers metrics */}
              <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80 text-center text-xs">
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Matches</span>
                  <span className="font-mono font-black text-slate-200">{player.stats.matchesPlayed}</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Goals</span>
                  <span className="font-mono font-black text-blue-400 flex items-center justify-center">
                    <Flame size={11} className="text-amber-500 mr-0.5" />
                    {player.stats.goals}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-500 font-bold uppercase block">Assists</span>
                  <span className="font-mono font-black text-emerald-400">{player.stats.assists}</span>
                </div>
              </div>

              {/* Secondary Details block */}
              <div className="border-t border-slate-800/60 pt-3 flex justify-between items-center text-[10px] font-medium text-slate-400">
                <div className="flex items-center space-x-1">
                  <Shield size={12} className="text-rose-500" />
                  <span>{player.stats.yellowCards} Yellow Cards</span>
                </div>
                {player.position === 'Goalkeeper' && player.stats.cleanSheets !== undefined && (
                  <span className="text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-900/35 px-2 py-0.5 rounded-full">
                    {player.stats.cleanSheets} Clean Sheets
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl col-span-full" id="squad-not-found">
            <Award size={40} className="mx-auto text-slate-600 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-400">No players found in this list</p>
            <p className="text-xs text-slate-500">Try cleaning your search string.</p>
          </div>
        )}
      </div>
    </div>
  );
}

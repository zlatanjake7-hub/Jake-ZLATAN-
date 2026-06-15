import React from 'react';
import { Home, Calendar, Users, Music, ShoppingBag, User, Wifi, WifiOff } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  toggleOffline: () => void;
  points: number;
}

export default function Navigation({ activeTab, setActiveTab, isOffline, toggleOffline, points }: NavigationProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'matchcenter', label: 'Matches', icon: Calendar },
    { id: 'squad', label: 'Squad', icon: Users },
    { id: 'media', label: 'Media & Fan', icon: Music },
    { id: 'shop', label: 'Shop', icon: ShoppingBag },
    { id: 'profile', label: 'My Club', icon: User },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-slate-900 text-slate-100 shadow-xl border-b border-slate-800" id="app-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Slogan */}
          <div className="flex items-center space-x-3" id="header-logo-container">
            <div className="bg-slate-950 text-white font-bold p-1.5 rounded-lg flex items-center justify-center text-xl shadow-md border border-slate-800">
              <span className="text-yellow-500 mr-0.5 font-sans">★</span>Azam<span className="text-blue-500">FC</span>
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-sm font-bold tracking-wider uppercase font-sans text-white">Azam Football Club</span>
              <span className="text-xs text-yellow-400 italic">"Wanalambani - Sisi ni Mabingwa!"</span>
            </div>
          </div>

          {/* Connected State and Mini Points Tracker */}
          <div className="flex items-center space-x-4" id="header-connection-status">
            {/* Rewards points micro badge */}
            <div className="flex items-center bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-xs">
              <span className="text-yellow-400 mr-1.5 animate-pulse">★</span>
              <span className="font-semibold text-slate-200">{points} Pts</span>
            </div>

            {/* Offline toggle pill */}
            <button
              onClick={toggleOffline}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${
                isOffline
                  ? 'bg-amber-600/90 text-white hover:bg-amber-500'
                  : 'bg-emerald-600/90 text-white hover:bg-emerald-500'
              }`}
              title="Toggle network connectivity mode"
              id="offline-pill"
            >
              {isOffline ? (
                <>
                  <WifiOff size={13} className="animate-bounce" />
                  <span>Offline Mode</span>
                </>
              ) : (
                <>
                  <Wifi size={13} className="animate-pulse" />
                  <span>Online Connected</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Primary Tab Bar */}
      <nav className="bg-slate-950/90 backdrop-blur-md border-t border-slate-800 scrollbar-none" id="primary-navigation-tabbar">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex justify-around md:justify-start md:space-x-8 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 py-1.5 px-3 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 outline-none select-none whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-inner border border-blue-500/50'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`}
                >
                  <Icon size={16} className={`${isActive ? 'text-yellow-350' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}

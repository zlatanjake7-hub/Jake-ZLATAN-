import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import MatchCenter from './components/MatchCenter';
import Squad from './components/Squad';
import MediaHub from './components/MediaHub';
import Shop from './components/Shop';
import Profile from './components/Profile';
import { MemberProfile, MatchTicket, ShopOrder, MemberAchievement } from './types';
import { AZAM_ACHIEVEMENTS } from './data';

// Define initial profile state using the metadata email
const DEFAULT_PROFILE: MemberProfile = {
  name: 'Zlatan Jake',
  email: 'zlatanjake7@gmail.com',
  membershipNo: 'AZM-2026-9812',
  tier: 'Fan',
  points: 100, // Starts with 100 points
  achievements: AZAM_ACHIEVEMENTS,
  tickets: [],
  orders: [],
  isSubscribed: false
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isOffline, setIsOffline] = useState<boolean>(() => {
    const saved = localStorage.getItem('azam_is_offline');
    return saved ? saved === 'true' : false;
  });

  const [profile, setProfile] = useState<MemberProfile>(() => {
    const saved = localStorage.getItem('azam_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILE;
      }
    }
    return DEFAULT_PROFILE;
  });

  const [likedNewsIds, setLikedNewsIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('azam_liked_news');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return []; }
    }
    return [];
  });

  // Persist offline status choice
  useEffect(() => {
    localStorage.setItem('azam_is_offline', String(isOffline));
  }, [isOffline]);

  // Persist user profile adjustments
  useEffect(() => {
    localStorage.setItem('azam_user_profile', JSON.stringify(profile));
  }, [profile]);

  // Persist news likes
  useEffect(() => {
    localStorage.setItem('azam_liked_news', JSON.stringify(likedNewsIds));
  }, [likedNewsIds]);

  // Dynamic status triggers
  const handleToggleOffline = () => {
    setIsOffline((prev) => !prev);
  };

  const handleUpdateName = (name: string) => {
    setProfile((prev) => ({
      ...prev,
      name
    }));
  };

  const handleLikeNews = (id: string) => {
    setLikedNewsIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      } else {
        return [...prev, id];
      }
    });

    // Award minor points for reading and engaging with news
    setProfile((prev) => {
      const nextPoints = prev.points + 10;
      return {
        ...prev,
        points: nextPoints
      };
    });
  };

  const handleAwardPoints = (points: number) => {
    setProfile((prev) => {
      const nextPoints = prev.points + points;
      return {
        ...prev,
        points: nextPoints
      };
    });
  };

  const handleUnlockAchievement = (id: string) => {
    setProfile((prev) => {
      const achievements = prev.achievements.map((ach) => {
        if (ach.id === id && ach.unlockedAt === undefined) {
          return {
            ...ach,
            unlockedAt: new Date().toISOString().split('T')[0]
          };
        }
        return ach;
      });

      const clicked = prev.achievements.find((ach) => ach.id === id);
      const pointsToAdd = clicked && clicked.unlockedAt === undefined ? clicked.pointsGranted : 0;

      return {
        ...prev,
        achievements,
        points: prev.points + pointsToAdd
      };
    });
  };

  const handleAddTicket = (ticket: MatchTicket) => {
    setProfile((prev) => {
      // Award loyalty points for buying matchday ticket
      const nextPoints = prev.points + 250;

      // Attempt auto-activation of 'Chamazi Loyalist' achievement
      const achievements = prev.achievements.map((ach) => {
        if (ach.id === 'ac-2') {
          return {
            ...ach,
            unlockedAt: new Date().toISOString().split('T')[0]
          };
        }
        return ach;
      });

      return {
        ...prev,
        tickets: [ticket, ...prev.tickets],
        points: nextPoints,
        achievements
      };
    });
  };

  const handleAddOrder = (order: ShopOrder) => {
    setProfile((prev) => {
      const nextPoints = prev.points + 300;

      // Check if custom jersey was purchased, auto-unlock Kit Holder achievement
      const containsJersey = order.items.some(
        (i) => i.itemId === 'sh-1' || i.itemId === 'sh-2' || i.id.startsWith('custom-jersey')
      );

      const achievements = prev.achievements.map((ach) => {
        if (ach.id === 'ac-3' && containsJersey) {
          return {
            ...ach,
            unlockedAt: new Date().toISOString().split('T')[0]
          };
        }
        return ach;
      });

      return {
        ...prev,
        orders: [order, ...prev.orders],
        points: nextPoints,
        achievements
      };
    });
  };

  // Turn subscriber state to True
  const handleSubscribe = () => {
    setProfile((prev) => ({
      ...prev,
      isSubscribed: true
    }));
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            onNavigate={setActiveTab}
            isOffline={isOffline}
            onLikeNews={handleLikeNews}
            likedNewsIds={likedNewsIds}
          />
        );
      case 'matchcenter':
        return (
          <MatchCenter
            isOffline={isOffline}
            isSubscribed={profile.isSubscribed}
            onSubscribe={() => {
              setActiveTab('shop');
              alert('Redirecting to the merchandise shop! Scroll to Premium Supporters memberships.');
            }}
          />
        );
      case 'squad':
        return <Squad />;
      case 'media':
        return (
          <MediaHub
            isOffline={isOffline}
            onAwardPoints={handleAwardPoints}
          />
        );
      case 'shop':
        return (
          <Shop
            isOffline={isOffline}
            onAddTicket={handleAddTicket}
            onAddOrder={handleAddOrder}
            onSubscribed={handleSubscribe}
          />
        );
      case 'profile':
        return (
          <Profile
            profile={profile}
            isOffline={isOffline}
            onUpdateName={handleUpdateName}
            onUnlockAchievement={handleUnlockAchievement}
          />
        );
      default:
        return (
          <Dashboard
            onNavigate={setActiveTab}
            isOffline={isOffline}
            onLikeNews={handleLikeNews}
            likedNewsIds={likedNewsIds}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 selection:bg-blue-600 selection:text-white pb-12" id="app-root-container">
      {/* Primary header navbar */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOffline={isOffline}
        toggleOffline={handleToggleOffline}
        points={profile.points}
      />

      {/* Main viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {renderActiveTabContent()}
      </main>
    </div>
  );
}

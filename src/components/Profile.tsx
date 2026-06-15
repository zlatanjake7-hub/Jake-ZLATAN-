import React, { useState } from 'react';
import { MemberProfile, MatchTicket, ShopOrder } from '../types';
import { Award, QrCode, ClipboardList, Settings, Sparkles, User, Gift, Wifi, Bell, BellOff, LogIn, Smartphone, Download, Terminal, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileProps {
  profile: MemberProfile;
  isOffline: boolean;
  onUpdateName: (name: string) => void;
  onUnlockAchievement: (id: string) => void;
}

export default function Profile({ profile, isOffline, onUpdateName, onUnlockAchievement }: ProfileProps) {
  const [profileName, setProfileName] = useState<string>(profile.name);
  const [nameEditMode, setNameEditMode] = useState<boolean>(false);

  // Supporter notifications alerts options
  const [newsAlerts, setNewsAlerts] = useState<boolean>(true);
  const [goalAlerts, setGoalAlerts] = useState<boolean>(true);
  const [podcastAlerts, setPodcastAlerts] = useState<boolean>(false);
  const [showAndroidPort, setShowAndroidPort] = useState<boolean>(false);

  // Dynamic Tier visual support matching points
  const getTierMetadata = (points: number) => {
    if (points >= 500) return { label: 'Platinum Elite Member', color: 'from-blue-650 via-indigo-650 to-slate-800 text-white border-yellow-300' };
    if (points >= 300) return { label: 'Gold Supporter', color: 'from-yellow-500 to-amber-600 text-white border-amber-300' };
    if (points >= 150) return { label: 'Silver Member', color: 'from-gray-300 to-slate-450 text-gray-800 border-gray-400' };
    return { label: 'Bronze Supporter Fan', color: 'from-orange-400 to-amber-700 text-white border-amber-600' };
  };

  const tierMeta = getTierMetadata(profile.points);

  const handleSaveName = () => {
    onUpdateName(profileName);
    setNameEditMode(false);
  };

  return (
    <div className="space-y-8" id="profile-tab">
      {/* Supporter Digital Membership Card */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border bg-gradient-to-tr from-slate-900 via-slate-950 to-slate-900 border-slate-800 text-white p-6 md:p-8" id="digital-supporter-card">
        {/* Glow gradients */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-405/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
          {/* Supporter credentials details */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] bg-yellow-500/20 text-yellow-305 border border-yellow-500/40 font-black px-2.5 py-1 rounded-full uppercase tracking-wider block w-fit">
                {tierMeta.label}
              </span>
              {nameEditMode ? (
                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="bg-slate-950/80 px-3 py-1.5 rounded text-sm text-slate-100 border border-slate-800 focus:outline-none focus:ring-1 focus:ring-yellow-400 outline-none"
                    maxLength={20}
                  />
                  <button
                    onClick={handleSaveName}
                    className="bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-3 py-1.5 rounded text-xs cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <h3 className="text-xl md:text-2xl font-sans font-black flex items-center space-x-2">
                  <span>{profile.name}</span>
                  <button
                    onClick={() => setNameEditMode(true)}
                    className="text-[10px] text-yellow-400 font-semibold hover:underline block cursor-pointer"
                  >
                    [Edit Name]
                  </button>
                </h3>
              )}
              <span className="text-xs text-slate-400 block font-mono">SUPPORTER NO: {profile.membershipNo}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
                <span className="text-slate-550 block text-[9px] uppercase font-bold tracking-widest">LOYALTY SCORE</span>
                <span className="font-mono text-lg font-black text-yellow-400">{profile.points} Points</span>
              </div>
              <div className="bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-850">
                <span className="text-slate-555 block text-[9px] uppercase font-bold tracking-widest">ACTIVE STATUS</span>
                <span className="font-bold text-slate-200 flex items-center space-x-1">
                  <Sparkles size={12} className="text-yellow-400 text-xs" />
                  <span>{profile.isSubscribed ? 'Premium Member' : 'Free Supporter'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Hologram Supporter QR Code */}
          <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl text-slate-950 self-center shadow-lg border-2 border-yellow-500" id="supporter-qr">
            <QrCode size={70} className="text-slate-950" />
            <span className="text-[8px] font-mono font-bold uppercase tracking-widest mt-1 text-center select-none text-slate-900">
              AZAM-MEMBER-PASSPORT
            </span>
          </div>
        </div>
      </div>

      {/* Roster list Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10" id="profile-detailed-panels">
        {/* Left Column: Achievements list & unlock statuses */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-5">
            <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1.5">
              <Award size={18} className="text-blue-500" />
              <span>Personal Supporter Milestones</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" id="achievements-dashboard">
              {profile.achievements.map((ach) => {
                const isUnlocked = ach.unlockedAt !== undefined;
                return (
                  <div
                    key={ach.id}
                    id={`achievement-pod-${ach.id}`}
                    className={`p-4 rounded-xl border flex gap-3 ${
                      isUnlocked
                        ? 'bg-amber-950/20 border-amber-900/35 text-amber-100'
                        : 'bg-slate-950/50 border-slate-900/60 opacity-55'
                    }`}
                  >
                    <div className={`p-2 rounded-lg self-start ${isUnlocked ? 'bg-amber-950/40 text-amber-400 border border-amber-800/40' : 'bg-slate-800 text-slate-500'}`}>
                      <Gift size={20} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex justify-between items-center text-xs">
                        <h4 className="font-bold text-slate-205">{ach.title}</h4>
                        <span className="font-mono text-[10px] bg-amber-955/55 text-amber-400 border border-amber-900/45 font-bold px-1.5 py-0.2 rounded-full">
                          +{ach.pointsGranted}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">{ach.description}</p>
                      {isUnlocked ? (
                        <span className="text-[9px] font-mono text-emerald-400 block">✓ Achieved: {ach.unlockedAt}</span>
                      ) : (
                        <button
                          onClick={() => onUnlockAchievement(ach.id)}
                          className="text-[9px] text-blue-400 hover:text-blue-300 hover:underline block font-semibold cursor-pointer"
                        >
                          [Unlock achievement & claim points]
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Booked electronic tickets list */}
          <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white font-sans flex items-center space-x-1.5">
              <ClipboardList size={18} className="text-blue-500" />
              <span>My Entry barcoded tickets</span>
            </h3>

            <div className="space-y-4" id="booked-tickets-panel">
              {profile.tickets.length > 0 ? (
                profile.tickets.map((tkt) => (
                  <div
                    key={tkt.id}
                    id={`booked-ticket-${tkt.id}`}
                    className="border border-slate-800 rounded-xl bg-gradient-to-r from-slate-950 to-slate-950/40 overflow-hidden flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-dashed divide-slate-800"
                  >
                    {/* Left: game banner details */}
                    <div className="p-4 flex-1 space-y-3.5 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="bg-blue-600/20 border border-blue-900/50 text-blue-400 text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {tkt.ticketClass} SEATING
                        </span>
                        <span className="text-slate-500 font-mono text-[9px] font-bold">SERIAL ID: {tkt.id}</span>
                      </div>
                      <h4 className="text-sm font-sans font-black text-white tracking-tight leading-snug">
                        {tkt.matchTitle}
                      </h4>
                      <div className="grid grid-cols-2 gap-3.5 text-[10px] text-slate-400 leading-normal">
                        <div>
                          <strong>🏟 Venue Arena:</strong>
                          <span className="block mt-0.5">{tkt.venue}</span>
                        </div>
                        <div>
                          <strong>📅 Schedule:</strong>
                          <span className="block mt-0.5">{tkt.date} at {tkt.time}</span>
                        </div>
                        <div>
                          <strong>🎟 Seat Reserved:</strong>
                          <span className="block mt-0.5 text-blue-400 font-semibold">{tkt.seatNumber}</span>
                        </div>
                        <div>
                          <strong>💰 Paid Price:</strong>
                          <span className="block mt-0.5 font-mono text-slate-300">{tkt.price.toLocaleString()} TZS</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Barcode simulation block */}
                    <div className="p-4 flex flex-col items-center justify-center bg-slate-955 w-full md:w-36 self-center h-full text-center space-y-1">
                      <div className="text-2xl tracking-widest font-mono text-slate-300 animate-pulse select-none">
                        ||| || | ||| ||
                      </div>
                      <span className="text-[8px] font-mono text-slate-500 uppercase">
                        {tkt.qrValue}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-550" id="empty-tickets">
                  <span className="text-xs text-slate-500">No active match entry tickets reserved yet. Go to Shop to purchase.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order History and notification preferences */}
        <div className="space-y-6" id="personal-profile-configs">
          {/* Order history list */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white font-sans uppercase tracking-widest">Order Merchandise History</h3>
            <div className="space-y-3 max-h-48 overflow-y-auto" id="order-history-details">
              {profile.orders.length > 0 ? (
                profile.orders.map((ord) => (
                  <div key={ord.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-white text-[10px]/snug">
                      <span>Order: {ord.id}</span>
                      <span>{ord.totalAmount.toLocaleString()} TZS</span>
                    </div>
                    {ord.items.map((item, id) => (
                      <span key={id} className="block text-[9px] text-slate-400 truncate">
                        • {item.itemName} (x{item.quantity})
                      </span>
                    ))}
                    <div className="flex justify-between items-center pt-1.5 border-t border-slate-850 text-[9px]">
                      <span className="text-slate-500 font-medium">Paid with {ord.paymentMethod}</span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-900/35 px-2 rounded-full uppercase">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 flex flex-col items-center justify-center">
                  <span className="text-[10px]">No shopping cart merchant orders processed yet.</span>
                </div>
              )}
            </div>
          </div>

          {/* Fan Push Preferences Alerts options */}
          <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-white font-sans uppercase tracking-widest leading-none">News Push Alerts Preferences</h3>

            <div className="space-y-3 text-xs text-slate-300" id="notification-preferences">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-200">Team Breaking Bulletins</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Instant updates on squad shifts & transfers.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewsAlerts(!newsAlerts)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    newsAlerts ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' : 'bg-slate-950 text-slate-500 border border-slate-850'
                  }`}
                >
                  {newsAlerts ? <Bell size={14} /> : <BellOff size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-850 pt-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-205">Live Match Goal Pushes</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Vibrating alerts on live goals & points transitions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setGoalAlerts(!goalAlerts)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    goalAlerts ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' : 'bg-slate-950 text-slate-500 border border-slate-850'
                  }`}
                >
                  {goalAlerts ? <Bell size={14} /> : <BellOff size={14} />}
                </button>
              </div>

              <div className="flex items-center justify-between border-t border-slate-855 pt-3">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-205">New Podcast Episode Alert</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Get notified when सलीम कीकेक upload episodes.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPodcastAlerts(!podcastAlerts)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    podcastAlerts ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' : 'bg-slate-950 text-slate-500 border border-slate-850'
                  }`}
                >
                  {podcastAlerts ? <Bell size={14} /> : <BellOff size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Caching status and offline check info for local indices */}
          <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-850 text-xs text-slate-350 space-y-2">
            <div className="flex items-center space-x-1 font-bold">
              <Wifi size={14} className="text-yellow-500 animate-pulse" />
              <span>Offline Cache synchronization</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal">
              Supporter milestones, ticket barcodes, customized jerseys, and score tickers are securely persisted to local database indices for fluent offline support.
            </p>
          </div>

          {/* Android APK Setup & Guidance Panel */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-5 border border-slate-800 shadow-xl space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-white font-sans uppercase tracking-widest flex items-center gap-1.5">
                  <Smartphone size={14} className="text-yellow-500" />
                  <span>Native Android App (APK)</span>
                </h3>
                <p className="text-[10px] text-slate-400 leading-normal mt-0.5">Capacitor codebase fully visualised & configured.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAndroidPort(!showAndroidPort)}
                className="text-[10px] text-yellow-500 hover:text-yellow-405 bg-yellow-505/10 hover:bg-yellow-500/10 border border-yellow-500/20 px-2 py-1 rounded-lg transition-colors cursor-pointer"
              >
                {showAndroidPort ? 'Collapse Guidelines' : 'Program & Build APK'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[10px] border-t border-slate-850 pt-3">
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900">
                <span className="text-slate-505 block uppercase font-mono text-[8px]">App Target Name</span>
                <span className="font-semibold text-slate-200">Azam Fans</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900">
                <span className="text-slate-505 block uppercase font-mono text-[8px]">SDK Framework</span>
                <span className="font-semibold text-slate-200">Capacitor / React Hub</span>
              </div>
              <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-900 col-span-2">
                <span className="text-slate-505 block uppercase font-mono text-[8px]">Package Identifiers (UUID)</span>
                <span className="font-mono text-slate-305 text-[9px]">com.azamfans.app (Android Direct)</span>
              </div>
            </div>

            {showAndroidPort && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3.5 border-t border-slate-850 pt-3 text-[11px] text-slate-300"
              >
                <div className="space-y-1 bg-yellow-950/20 border border-yellow-900/40 text-yellow-300 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 font-semibold text-xs text-yellow-500">
                    <CheckCircle2 size={13} />
                    <span>Capacitor Project Initialised!</span>
                  </div>
                  <p className="text-[10px] leading-normal text-slate-400 font-sans">
                    We have programmed the native Android source core, setup <code>capacitor.config.ts</code>, and exported package.json bundle dependencies seamlessly.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold text-white text-xs block">How to compile APK on your local computer:</span>
                  <div className="space-y-2 text-[10px] font-mono leading-relaxed bg-slate-950 p-3 rounded-lg border border-slate-850">
                    <div className="flex items-start gap-1.5">
                      <Terminal size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-slate-500 block">1. Export code via top-right menu</span>
                        <code className="text-slate-200 bg-slate-900 px-1.5 py-0.5 rounded">Deploy &rarr; Download ZIP</code>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 border-t border-slate-905 pt-2">
                      <Terminal size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-slate-500 block">2. Install npm modules & build workspace</span>
                        <code className="text-yellow-400 block mt-0.5">npm install && npm run build</code>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 border-t border-slate-905 pt-2">
                      <Terminal size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-slate-500 block">3. Synchronize native Android platform assets</span>
                        <code className="text-yellow-400 block mt-0.5">npx cap sync android</code>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5 border-t border-slate-905 pt-2">
                      <Terminal size={12} className="text-blue-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="text-slate-500 block">4. Generate native release APK package</span>
                        <code className="text-yellow-400 block mt-0.5">npx cap open android</code>
                        <span className="text-slate-500 block mt-1 leading-normal font-sans text-[10px]">
                          This opens Android Studio directly. Simply click <strong>Build &rarr; Build Bundle(s) / APK(s) &rarr; Build APK(s)</strong> to compile your download APK!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 bg-slate-955 p-2 text-center rounded-lg border border-slate-900">
                  ⚡ Fully offline capable when packaged directly as an APK.
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

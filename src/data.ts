import { Player, Match, NewsArticle, PodcastEpisode, FootballReel, ShopItem, MemberAchievement } from './types';

export const AZAM_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Feisal Salum (Fei Toto)',
    number: 10,
    position: 'Midfielder',
    nationality: 'Tanzania',
    avatar: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=250',
    stats: {
      goals: 14,
      assists: 9,
      matchesPlayed: 28,
      yellowCards: 2
    }
  },
  {
    id: 'p2',
    name: 'Gibril Sillah',
    number: 11,
    position: 'Forward',
    nationality: 'Gambia',
    avatar: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=250',
    stats: {
      goals: 11,
      assists: 8,
      matchesPlayed: 26,
      yellowCards: 4
    }
  },
  {
    id: 'p3',
    name: 'Kipre Junior',
    number: 21,
    position: 'Midfielder',
    nationality: 'Ivory Coast',
    avatar: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=250',
    stats: {
      goals: 8,
      assists: 12,
      matchesPlayed: 27,
      yellowCards: 1
    }
  },
  {
    id: 'p4',
    name: 'Lusajo Mwaikenda',
    number: 15,
    position: 'Defender',
    nationality: 'Tanzania',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250',
    stats: {
      goals: 2,
      assists: 3,
      matchesPlayed: 29,
      yellowCards: 5
    }
  },
  {
    id: 'p5',
    name: 'Idriss Mbombo',
    number: 9,
    position: 'Forward',
    nationality: 'DR Congo',
    avatar: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&q=80&w=250',
    stats: {
      goals: 9,
      assists: 2,
      matchesPlayed: 18,
      yellowCards: 3
    }
  },
  {
    id: 'p6',
    name: 'Ali Ahmada',
    number: 1,
    position: 'Goalkeeper',
    nationality: 'Comoros',
    avatar: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=250',
    stats: {
      goals: 0,
      assists: 1,
      matchesPlayed: 25,
      cleanSheets: 12,
      yellowCards: 1
    }
  },
  {
    id: 'p7',
    name: 'Yannick Bangala',
    number: 4,
    position: 'Defender',
    nationality: 'DR Congo',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=250',
    stats: {
      goals: 3,
      assists: 1,
      matchesPlayed: 24,
      yellowCards: 6
    }
  }
];

export const AZAM_MATCHES: Match[] = [
  {
    id: 'm1',
    homeTeam: 'Azam FC',
    awayTeam: 'Simba SC',
    homeLogo: '🔵',
    awayLogo: '🔴',
    homeScore: 2,
    awayScore: 1,
    date: '2026-06-12',
    time: '19:00',
    venue: 'Benjamin Mkapa National Stadium',
    status: 'finished',
    competition: 'NBC Premier League',
    events: [
      { id: 'me1', minute: 15, type: 'info', description: 'Match kicks off in front of a packed stadium.' },
      { id: 'me2', minute: 28, type: 'goal', description: 'GOAL! Fei Toto scores a stunning volley from outside the box!', team: 'home', player: 'Feisal Salum' },
      { id: 'me3', minute: 45, type: 'card', description: 'Yellow Card for Yannick Bangala following a harsh tackle.', team: 'home', player: 'Yannick Bangala' },
      { id: 'me4', minute: 58, type: 'goal', description: 'Goal for Simba SC. Awesu Awesu scores a header from a corner.', team: 'away', player: 'Awesu Awesu' },
      { id: 'me5', minute: 82, type: 'goal', description: 'GOAL! Gibril Sillah slots it home after a superb pass from Kipre Junior!!', team: 'home', player: 'Gibril Sillah' },
      { id: 'me6', minute: 95, type: 'whistle', description: 'Full-Time: Azam FC gets a hard-earned 2-1 derby victory!' }
    ],
    stats: {
      possession: [52, 48],
      shots: [14, 11],
      shotsOnTarget: [7, 4],
      fouls: [12, 14],
      corners: [6, 4]
    }
  },
  {
    id: 'm2',
    homeTeam: 'Young Africans SC',
    awayTeam: 'Azam FC',
    homeLogo: '🟡',
    awayLogo: '🔵',
    homeScore: 0,
    awayScore: 0,
    date: '2026-06-14', // Realistic matches
    time: '16:00',
    venue: 'Chamazi Sports Complex', // Real Azam home ground
    status: 'live',
    competition: 'NBC Premier League',
    events: [
      { id: 'me10', minute: 1, type: 'info', description: 'Referee blows the whistle and we are underway at Chamazi!' },
      { id: 'me11', minute: 12, type: 'info', description: 'Azam FC dominates the midfield with high pressing from Kipre Junior.' },
      { id: 'me12', minute: 24, type: 'card', description: 'Yellow Card for Young Africans defender for stopping a break.', team: 'away' },
      { id: 'me13', minute: 36, type: 'info', description: 'Spectacular diving save by Ali Ahmada to deny Yanga!' },
      { id: 'me14', minute: 45, type: 'info', description: 'Half time score remains empty. Tactical masterclass from both sides.' }
    ],
    stats: {
      possession: [46, 54],
      shots: [5, 8],
      shotsOnTarget: [2, 4],
      fouls: [9, 7],
      corners: [3, 5]
    }
  },
  {
    id: 'm3',
    homeTeam: 'Azam FC',
    awayTeam: 'Coastal Union FC',
    homeLogo: '🔵',
    awayLogo: '🟢',
    homeScore: 0,
    awayScore: 0,
    date: '2026-06-20',
    time: '19:00',
    venue: 'Chamazi Sports Complex',
    status: 'upcoming',
    competition: 'NBC Premier League',
    events: [],
    stats: {
      possession: [50, 50],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      fouls: [0, 0],
      corners: [0, 0]
    }
  },
  {
    id: 'm4',
    homeTeam: 'Singida Black Stars',
    awayTeam: 'Azam FC',
    homeLogo: '⚫',
    awayLogo: '🔵',
    homeScore: 0,
    awayScore: 0,
    date: '2026-06-25',
    time: '16:00',
    venue: 'Liti Stadium, Singida',
    status: 'upcoming',
    competition: 'NBC Premier League',
    events: [],
    stats: {
      possession: [50, 50],
      shots: [0, 0],
      shotsOnTarget: [0, 0],
      fouls: [0, 0],
      corners: [0, 0]
    }
  }
];

export const AZAM_NEWS: NewsArticle[] = [
  {
    id: 'n1',
    title: 'Azam FC Clinches Dramatic Victory Against Simba SC',
    summary: 'A breathtaking goal from Fei Toto and Gibril Sillahs late winner secures three crucial derby points.',
    content: `Dar es Salaam was painted blue and white today as Azam FC secured a pivotal 2-1 victory over Simba SC. Feisal Salum (Fei Toto) opened the scoring in the 28th minute with an absolute rocket of a volley that sent the Chamazi faithful into raptures.

    Simba equalized in the second half, but Yannick Bangala and the defense held strong before substitute Kipre Junior set up Gibril Sillah for an iconic 82nd-minute winner. Coach Bruno Ferry praised the team spirit and tactical discipline of the 'Ice Cream Makers'.`,
    date: '2026-06-12',
    category: 'Match Report',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600',
    likes: 425,
    views: 1850,
    isBehindTheScenes: false
  },
  {
    id: 'n2',
    title: 'Behind the Scenes: Training Camp Preparations at Chamazi',
    summary: 'An exclusive look into the technical regimens and fitness training sessions ahead of the Yanga clash.',
    content: `We bring you an exclusive peek into the training ground. Head coach Bruno Ferry has introduced high-intensity tactical drills focusing on transitions and possession speed.

    In this special footage, see how the goalkeepers Ali Ahmada and Zuberi Foba are running specialized agility drills, while Fei Toto is honing his signature long-range shooting. Physical fitness coach has reported a clean bill of health across the squad.`,
    date: '2026-06-13',
    category: 'Behind the Scenes',
    image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600',
    likes: 295,
    views: 1205,
    isBehindTheScenes: true
  },
  {
    id: 'n3',
    title: 'Interview: Fei Toto Eyes Golden Boot Title',
    summary: 'Fei Toto discusses his playmaking style, partnership with Sillah, and goals for the NBC Premier League season.',
    content: `Feisal Salum, widely known as Fei Toto, sat down with Azam Media today. 'Our target is to lift the championship,' he stated firmly. 'Personal accolades are fantastic, but the club success is paramount. The connection Kipre, Sillah, and I have on the training ground is finally translating beautifully into matches.'

    Fei Toto also thanked the Azam FC board and Bakhresa Group for providing state-of-the-art facilities at Chamazi, calling it the best sporting hub in East Africa.`,
    date: '2026-06-11',
    category: 'Interview',
    image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=600',
    likes: 512,
    views: 2200,
    isBehindTheScenes: false
  },
  {
    id: 'n4',
    title: 'New Chamazi Pitch Tech Upgrade Completed',
    summary: 'The Chamazi Complex replaces hybrid grass with next-generation drainage and turf technology.',
    content: `Azam Football Club continues to lead in sports tourism and infrastructure. Today, the club management announced the completion of the state-of-the-art pitch upgrade.

    The new grass utilizes premium materials allowing smooth ball transitions even during heavy tropical rains. Supporters will witness the improved ball rolls firsthand during upcoming evening fixtures.`,
    date: '2026-06-09',
    category: 'Training',
    image: 'https://images.unsplash.com/photo-1556479810-6c73550a4ad0?auto=format&fit=crop&q=80&w=600',
    likes: 188,
    views: 940,
    isBehindTheScenes: true
  }
];

export const AZAM_PODCASTS: PodcastEpisode[] = [
  {
    id: 'pod-1',
    title: 'The Chamazi Icebreaker - Ep 42: Fei Toto Speaks out',
    description: 'Listen to Fei Toto discuss his journey to Azam FC, the high standards at Chamazi, and the upcoming title charge.',
    duration: '24:15',
    date: '2026-06-13',
    host: 'Baraka Mpenja & Beatrice Shayo',
    likes: 312
  },
  {
    id: 'pod-2',
    title: 'Azam Zone Premium - Ep 41: Midfield Masterclass',
    description: 'A deep-dive tactical analysis of Azam FC midfield structure with guest analyst Kipre Junior.',
    duration: '18:40',
    date: '2026-06-08',
    host: 'Salim Kikeke',
    likes: 204
  }
];

export const AZAM_REELS: FootballReel[] = [
  {
    id: 'r1',
    title: '⚡ Fei Toto Volley stunner vs Simba SC!',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400',
    views: '45.2K',
    likes: 8500,
    commentsCount: 312,
    uploader: 'Azam FC Media'
  },
  {
    id: 'r2',
    title: '🧤 Ali Ahmada insane double reflex save!',
    thumbnail: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80&w=400',
    views: '28.1K',
    likes: 4200,
    commentsCount: 145,
    uploader: 'Goalkeeper Union'
  },
  {
    id: 'r3',
    title: '🎨 Kipre Junior nutmeg in training!',
    thumbnail: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?auto=format&fit=crop&q=80&w=400',
    views: '89.4K',
    likes: 12500,
    commentsCount: 680,
    uploader: 'Azam FC Media'
  }
];

export const AZAM_SHOP: ShopItem[] = [
  {
    id: 'sh-1',
    name: 'Azam FC Home Jersey 2025/2026',
    price: 35000, // TZS
    description: 'The official royal blue home jersey with subtle geometric ice patterns, breathable high-perf fabric, and the Azam FC and Bakhresa crests.',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=500',
    category: 'Jersey',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    inStock: true
  },
  {
    id: 'sh-2',
    name: 'Azam FC Away Jersey 2025/2026',
    price: 35000, // TZS
    description: 'The elegant white away kit representing Tanzanian salt-plains, with cyan-and-royal-blue striped dynamic collar.',
    image: 'https://images.unsplash.com/photo-1578269174936-2709b5a19adf?auto=format&fit=crop&q=80&w=500',
    category: 'Jersey',
    sizes: ['S', 'M', 'L', 'XL'],
    inStock: true
  },
  {
    id: 'sh-3',
    name: 'Azam FC Supporters Scarf',
    price: 15000, // TZS
    description: 'Keep warm and show your colors at Chamazi. High quality woven scarf with "WANALAMBANI" and club badge.',
    image: 'https://images.unsplash.com/photo-157 school-scarf?auto=format&fit=crop&q=80&w=500', // Unsplash fallbacks
    category: 'Accessory',
    inStock: true
  },
  {
    id: 'sh-4',
    name: 'Platinum Supporter Annual Membership',
    price: 120000, // TZS
    description: 'Premium subscription offering free entry to 5 home games, 15% discount on store items, VIP lounge booking access, and exclusive media content.',
    image: 'https://images.unsplash.com/photo-1540747737956-37872404a82f?auto=format&fit=crop&q=80&w=500',
    category: 'Membership',
    inStock: true
  },
  {
    id: 'sh-5',
    name: 'Azam FC Retro Training Cap',
    price: 18000, // TZS
    description: 'Embroidered adjustable cap in navy blue, as worn by Bruno Ferry and coaching staff.',
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=500',
    category: 'Apparel',
    sizes: ['One Size'],
    inStock: true
  }
];

export const AZAM_ACHIEVEMENTS: MemberAchievement[] = [
  {
    id: 'ac-1',
    title: 'First-Time Lambani',
    description: 'Register an account and join the Azam FC supporter portal.',
    pointsGranted: 100
  },
  {
    id: 'ac-2',
    title: 'Chamazi loyalist',
    description: 'Purchase your first stadium match ticket.',
    pointsGranted: 250
  },
  {
    id: 'ac-3',
    title: 'Official kit holder',
    description: 'Purchase an official team jersey from the interactive shop.',
    pointsGranted: 300
  },
  {
    id: 'ac-4',
    title: 'Super fan trivia master',
    description: 'Complete 3 AI match reports and trivia sessions successfully.',
    pointsGranted: 150
  }
];

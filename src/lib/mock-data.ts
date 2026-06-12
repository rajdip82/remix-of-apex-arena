export type Game = "Free Fire MAX" | "BGMI";
export type TMode = "Solo" | "Duo" | "Squad";
export type TStatus = "Live" | "Upcoming" | "Completed";

export interface Tournament {
  id: string;
  name: string;
  game: Game;
  mode: TMode;
  map: string;
  entryFee: number;
  prizePool: number;
  slots: number;
  filled: number;
  startsAt: string; // ISO
  status: TStatus;
  banner: string; // gradient class identifier
}

const now = Date.now();
const inHrs = (h: number) => new Date(now + h * 3600_000).toISOString();
const agoHrs = (h: number) => new Date(now - h * 3600_000).toISOString();

export const tournaments: Tournament[] = [
  { id: "ff-championship", name: "FF MAX Championship", game: "Free Fire MAX", mode: "Squad", map: "Bermuda", entryFee: 49, prizePool: 50000, slots: 100, filled: 84, startsAt: inHrs(6), status: "Upcoming", banner: "from-red-600 via-rose-500 to-orange-500" },
  { id: "bgmi-pro-league", name: "BGMI Pro League S4", game: "BGMI", mode: "Squad", map: "Erangel", entryFee: 99, prizePool: 100000, slots: 80, filled: 80, startsAt: inHrs(2), status: "Live", banner: "from-purple-600 via-fuchsia-500 to-red-500" },
  { id: "duo-battle-arena", name: "Duo Battle Arena", game: "Free Fire MAX", mode: "Duo", map: "Kalahari", entryFee: 25, prizePool: 15000, slots: 60, filled: 41, startsAt: inHrs(28), status: "Upcoming", banner: "from-orange-500 via-red-500 to-purple-600" },
  { id: "solo-sniper-cup", name: "Solo Sniper Cup", game: "BGMI", mode: "Solo", map: "Miramar", entryFee: 19, prizePool: 8000, slots: 50, filled: 22, startsAt: inHrs(52), status: "Upcoming", banner: "from-amber-500 via-red-500 to-rose-600" },
  { id: "midnight-rumble", name: "Midnight Rumble", game: "Free Fire MAX", mode: "Squad", map: "Purgatory", entryFee: 39, prizePool: 25000, slots: 100, filled: 56, startsAt: inHrs(10), status: "Upcoming", banner: "from-indigo-600 via-purple-600 to-red-500" },
  { id: "weekend-warriors", name: "Weekend Warriors", game: "BGMI", mode: "Duo", map: "Sanhok", entryFee: 0, prizePool: 5000, slots: 40, filled: 12, startsAt: inHrs(72), status: "Upcoming", banner: "from-emerald-500 via-teal-500 to-purple-600" },
  { id: "legends-cup", name: "Legends Cup Finals", game: "BGMI", mode: "Squad", map: "Vikendi", entryFee: 149, prizePool: 200000, slots: 64, filled: 64, startsAt: agoHrs(48), status: "Completed", banner: "from-yellow-500 via-amber-500 to-red-600" },
  { id: "ff-night-cup", name: "FF Night Cup", game: "Free Fire MAX", mode: "Solo", map: "Bermuda", entryFee: 10, prizePool: 3000, slots: 50, filled: 7, startsAt: inHrs(96), status: "Upcoming", banner: "from-pink-600 via-red-500 to-orange-500" },
];

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  points: number;
  matches: number;
  kills: number;
  winRate: number;
  streak: number;
}

const handles = ["ShadowBlade", "NeonReaper", "CrimsonFury", "Vortex_OP", "PhantomAce", "ZeroDayX", "Ghostrider77", "ApexLynx", "Pixelstorm", "IronWolf", "VenomKing", "NovaStrike", "RogueSamurai", "BlitzKid", "Stormbreaker", "OblivionX", "FrostByte", "DarkPulse", "JadeAssassin", "ThunderHawk"];
export const leaderboard: LeaderboardEntry[] = handles.map((u, i) => ({
  rank: i + 1,
  username: u,
  avatar: `https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${u}`,
  points: 12500 - i * 412 + (i % 3) * 80,
  matches: 240 - i * 6,
  kills: 4800 - i * 130,
  winRate: Math.max(18, 72 - i * 2.4),
  streak: Math.max(0, 18 - i),
}));

export const platformStats = {
  players: 25840,
  tournaments: 1284,
  prizeDistributed: 3540000, // INR
  dailyActive: 8420,
};

export interface Testimonial {
  name: string;
  team: string;
  rating: number;
  body: string;
  avatar: string;
}
export const testimonials: Testimonial[] = [
  { name: "Aarav 'ShadowBlade' M.", team: "Team Eclipse", rating: 5, body: "Smoothest tournament UX I've used in India. UPI payouts were instant after our finals win.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Aarav" },
  { name: "Riya 'NeonReaper' K.", team: "Phantom Squad", rating: 5, body: "Brackets, room IDs, results — everything just works. Felt like a real esports stage.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Riya" },
  { name: "Karan 'Vortex' S.", team: "Iron Wolves", rating: 5, body: "From signup to lobby in under 2 minutes. Redeem codes were a lifesaver during scrims.", avatar: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Karan" },
];

export interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
  type: "tournament" | "registration" | "room" | "result" | "system";
  read: boolean;
}
export const notifications: Notification[] = [
  { id: "n1", title: "Room ID Released", body: "BGMI Pro League S4 — Room ID and password are live.", time: "2m ago", type: "room", read: false },
  { id: "n2", title: "Registration Approved", body: "Your squad for FF MAX Championship is confirmed.", time: "1h ago", type: "registration", read: false },
  { id: "n3", title: "Tournament Starting Soon", body: "Duo Battle Arena begins in 28 hours.", time: "3h ago", type: "tournament", read: true },
  { id: "n4", title: "Result Published", body: "Legends Cup Finals results are live. Check leaderboard.", time: "2d ago", type: "result", read: true },
  { id: "n5", title: "Admin Announcement", body: "Server maintenance Sunday 03:00 IST — 30 min downtime.", time: "3d ago", type: "system", read: true },
];

export interface Team {
  id: string;
  name: string;
  tag: string;
  captain: string;
  members: string[];
  game: Game;
  wins: number;
}
export const teams: Team[] = [
  { id: "t1", name: "Phantom Squad", tag: "PHX", captain: "ShadowBlade", members: ["ShadowBlade", "NeonReaper", "Vortex_OP", "Ghostrider77"], game: "Free Fire MAX", wins: 14 },
  { id: "t2", name: "Iron Wolves", tag: "IRN", captain: "IronWolf", members: ["IronWolf", "ApexLynx", "BlitzKid", "FrostByte"], game: "BGMI", wins: 9 },
];

export interface Registration {
  id: string;
  tournament: string;
  team: string;
  status: "Pending" | "Approved" | "Rejected";
  paid: number;
  date: string;
}
export const myRegistrations: Registration[] = [
  { id: "TX-89231", tournament: "FF MAX Championship", team: "Phantom Squad", status: "Approved", paid: 49, date: "2 hours ago" },
  { id: "TX-89102", tournament: "Midnight Rumble", team: "Phantom Squad", status: "Pending", paid: 39, date: "5 hours ago" },
  { id: "TX-88940", tournament: "Legends Cup Finals", team: "Iron Wolves", status: "Approved", paid: 149, date: "3 days ago" },
];

export const redeemCodes = [
  { code: "FREEFF2026", type: "Free Entry", discount: 100, uses: 142, limit: 500, expires: "2026-12-31", active: true },
  { code: "BGMI50OFF", type: "Discount", discount: 50, uses: 89, limit: 1000, expires: "2026-09-30", active: true },
  { code: "WELCOME2026", type: "VIP Entry", discount: 100, uses: 38, limit: 200, expires: "2026-12-31", active: true },
];

export const pendingPayments = [
  { id: "PAY-7721", tournament: "FF MAX Championship", team: "Phantom Squad", captain: "ShadowBlade", fee: 49, utr: "402938102938", time: "12 min ago" },
  { id: "PAY-7720", tournament: "BGMI Pro League S4", team: "Iron Wolves", captain: "IronWolf", fee: 99, utr: "402938102811", time: "28 min ago" },
  { id: "PAY-7719", tournament: "Duo Battle Arena", team: "Crimson Duo", captain: "CrimsonFury", fee: 25, utr: "402938102744", time: "44 min ago" },
];

export const adminUsers = [
  { id: "u1", username: "ShadowBlade", email: "shadow@tx.gg", joined: "2025-09-12", status: "Active", verified: true },
  { id: "u2", username: "NeonReaper", email: "neon@tx.gg", joined: "2025-10-04", status: "Active", verified: true },
  { id: "u3", username: "Vortex_OP", email: "vortex@tx.gg", joined: "2025-11-21", status: "Suspended", verified: false },
  { id: "u4", username: "FrostByte", email: "frost@tx.gg", joined: "2026-01-08", status: "Active", verified: true },
];

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}
export function shortInr(n: number) {
  if (n >= 100000) return "₹" + (n / 100000).toFixed(1) + "L";
  if (n >= 1000) return "₹" + (n / 1000).toFixed(1) + "K";
  return "₹" + n;
}
export function countdown(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "LIVE NOW";
  const h = Math.floor(diff / 3600_000);
  const m = Math.floor((diff % 3600_000) / 60_000);
  if (h >= 24) return Math.floor(h / 24) + "d " + (h % 24) + "h";
  return h + "h " + m + "m";
}

// --- CHALLENGE CARD TYPES ---
export interface Challenge {
  id: number
  title: string
  description: string
  duration_days: number
  status: 'active' | 'completed' | 'failed' | 'retracted' | 'scheduled'
  joined?: boolean
  startDate?: string,
  categoryName?: string
}

export interface ChallengeCardProps {
  challenge: Challenge
  joined: boolean
  openJoinModal?: (data: { challengeId: number, duration: number }) => void;
  openLeaveModal: (data: { challengeId: number }) => void;
}


// --- CHALLENGE ACTIONS TYPES ---
export interface ChallengeActionsProps {
  challengeId: number
  joined: boolean
  duration: number
  status: Challenge['status']
  openJoinModal?: (data: { challengeId: number, duration: number }) => void;
  openLeaveModal: (data: { challengeId: number }) => void;
}


// --- PARTICIPANTS TYPES ---
export interface Log {
  id: number;
  date: string;
  status: "completed" | "missed" | "remaining";
}

export interface Participant {
  user_id: number;
  username: string;
  status: string;
  streak: number;
  maxStreak: number;
  logs: Log[];
  start_date: string;
  end_date?: string;
}

export interface ParticipantCardPropsType {
  participant: Participant;
  onClick?: () => void;
  expanded?: boolean;
}

type LeaderboardEntry = {
  user_id: number;
  username: string;
  streak: number;
  maxStreak: number;
  completedDays: number;
  totalDays: number;
  completionRate: number;
};

type OverallStats = {
  totalParticipants: number;
  avgCompletion: number;
  avgStreak: number;
};

type DailyStats = {
  [date: string]: number; // "YYYY-MM-DD": count
};

type WeeklyStats = {
  [weekNumber: string]: {
    completed: number;
    total: number;
  };
};

export type ChallengeStatsResponse = {
  leaderboard: LeaderboardEntry[];
  overall: OverallStats;
  dailyStats: DailyStats;
  weeklyStats: WeeklyStats;
};

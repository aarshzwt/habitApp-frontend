// --- CHALLENGE CARD TYPES ---
export interface Challenge {
  id: number
  title: string
  description: string
  duration_days: number
  status: 'active' | 'completed' | 'failed' | 'retracted' | 'scheduled'
  joined?: boolean
  startDate?: string
}

export interface ChallengeCardProps {
  challenge: Challenge
  joined: boolean
}


// --- CHALLENGE ACTIONS TYPES ---
export interface ChallengeActionsProps {
  challengeId: number
  joined: boolean
  duration: number
  status: Challenge['status']
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

import {
  FaEnvelope,
  FaStar,
  FaTrophy,
  FaFire,
} from "react-icons/fa";

interface HeaderProps {
  user: {
    username?: string;
    email?: string;
    level?: number;
    totalXP?: number;
    currentXP?: number;
    streaks?: any[];
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="mb-10 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm p-6 transition-all hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            👋 Hey, <span className="text-blue-600">{user?.username}</span>!
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Welcome back — ready to grow today?
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 text-sm">
        <InfoCard
          icon={<FaEnvelope className="text-blue-500" />}
          label={user?.email || "No email"}
        />
        <InfoCard
          icon={<FaStar className="text-yellow-500" />}
          label={`Level ${user?.level ?? 0}`}
        />
        <InfoCard
          icon={<FaTrophy className="text-purple-500" />}
          label={`Total XP: ${user?.totalXP ?? 0}`}
        />
        <InfoCard
          icon={<FaTrophy className="text-green-500" />}
          label={`Current XP: ${user?.currentXP ?? 0}`}
        />
        <InfoCard
          icon={<FaFire className="text-red-500" />}
          label={`Streaks: ${user?.streaks?.length ?? 0}`}
        />
      </div>
    </header>
  );
}

function InfoCard({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 hover:bg-gray-100 transition">
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-gray-800 font-medium truncate">{label}</span>
    </div>
  );
}

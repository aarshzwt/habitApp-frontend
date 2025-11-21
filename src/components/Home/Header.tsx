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
    <header
      className="mb-10 rounded-3xl border border-white/30 bg-gradient-to-br
                 from-blue-50/60 via-white/70 to-purple-50/60 backdrop-blur-xl
                 shadow-xl p-8 transition-all hover:shadow-2xl"
    >
      {/* Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
            👋 Hey,{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
              {user?.username}
            </span>
            !
          </h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Welcome back — ready to grow today? 🌱
          </p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5 text-sm">
        <InfoCard
          icon={<FaEnvelope className="text-blue-600 text-md" />}
          label={user?.email || "No email"}
        />
        <InfoCard
          icon={<FaStar className="text-yellow-500 text-md" />}
          label={`Level ${user?.level ?? 0}`}
        />
        <InfoCard
          icon={<FaTrophy className="text-purple-600 text-md" />}
          label={`Total XP: ${user?.totalXP ?? 0}`}
        />
        <InfoCard
          icon={<FaTrophy className="text-green-600 text-md" />}
          label={`Current XP: ${user?.currentXP ?? 0}`}
        />
        <InfoCard
          icon={<FaFire className="text-red-500 text-md" />}
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
    <div
      className="flex items-center gap-4 bg-white/70 border border-white/40 
                 backdrop-blur-md rounded-2xl px-3 py-3 shadow-sm
                 hover:shadow-md hover:scale-[1.02] transition-all"
    >
      <div className="flex-shrink-0 animate-pulse-slow">{icon}</div>

      <span className="text-gray-800 font-semibold truncate text-sm sm:text-base">
        {label}
      </span>
    </div>
  );
}

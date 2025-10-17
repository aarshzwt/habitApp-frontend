import { FaUser, FaEnvelope, FaStar, FaFire, FaTrophy } from "react-icons/fa";

interface HeaderProps{
  user: {
    username: string;
    email: string;
    level: number;
    totalXP: number;
    currentXP: number;

  }
}
export default function Header({ user }:HeaderProps) {

  return (
    <header className="mb-10 p-6 shadow-md border border-gray-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">👋 Hey, {user?.username}!</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back. Ready to grow today?</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-blue-500" />
          <span>{user?.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaStar className="text-yellow-500" />
          <span>Level {user?.level}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaTrophy className="text-purple-500" />
          <span>Total XP: {user?.totalXP}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaTrophy className="text-green-500" />
          <span>Current XP: {user?.currentXP}</span>
        </div>
        {/* <div className="flex items-center gap-2">
          <FaFire className="text-red-500" />
          <span>Streaks: {user?.streaks?.length ?? 0}</span>
        </div> */}
      </div>
    </header>

  )

}
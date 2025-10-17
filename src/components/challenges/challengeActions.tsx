import axiosInstance from "@/utils/axiosInstance";
import { useRouter } from "next/router";

export function ChallengeActions({ challengeId, joined, duration, status }) {
  const router = useRouter();

  const handleJoin = () =>
    axiosInstance.post(`/challenges/join/${challengeId}`, { duration }).then(() => location.reload());

  const handleLeave = () =>
    axiosInstance.delete(`/challenges/leave/${challengeId}`).then(() => location.reload());

  // Show stats for past challenges
  if (joined && status !== "active") {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          router.push(`/challenge/${challengeId}/stats`);
        }}
        className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 text-sm"
      >
        Stats
      </button>
    );
  }

  // Otherwise show Join/Leave
  return joined ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleLeave();
      }}
      className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
    >
      Leave
    </button>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        handleJoin();
      }}
      className="bg-indigo-500 text-white px-3 py-1 rounded-lg hover:bg-indigo-600 text-sm"
    >
      Join
    </button>
  );
}

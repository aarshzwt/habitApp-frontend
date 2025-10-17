import { useRouter } from "next/router";
import { ChallengeActions } from "./challengeActions";

export function ChallengeCard({ challenge, joined }) {
  const router = useRouter();

  const statusColors = {
    completed: "bg-green-100 text-green-700",
    retracted: "bg-yellow-100 text-yellow-700",
    failed: "bg-red-100 text-red-700",
    active: "bg-blue-100 text-blue-700",
  };

  return (
    <div
      key={challenge.id}
      className="bg-white shadow-md rounded-2xl p-4 border hover:shadow-lg transition cursor-pointer"
      onClick={() => router.push(`/challenge/${challenge.id}`)}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">{challenge.title}</h3>

        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[challenge.status] || "bg-gray-100 text-gray-700"}`}
        >
          {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
        </span>
      </div>

      <p className="text-gray-600 mt-1">{challenge.description}</p>

      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-gray-500">
          Duration: {challenge.duration_days} days
        </span>
        <ChallengeActions
          challengeId={challenge.id}
          joined={joined}
          duration={challenge.duration_days}
          status={challenge.status}
        />
      </div>
    </div>
  );
}


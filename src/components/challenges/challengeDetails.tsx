import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { Participants } from "./Participants";
import { ChallengeLogs } from "./challengeLogs";

export function ChallengeDetails({ id }) {
  const [challenge, setChallenge] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/challenges/${id}`).then(res => setChallenge(res.challenge));
  }, [id]);

  if (!challenge) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-indigo-600">{challenge.title}</h1>
      <p className="text-gray-600 mt-2">{challenge.description}</p>

      <div className="flex gap-4 mt-4 text-sm text-gray-500">
        <span>Duration: {challenge.duration_days} days</span>
        <span>Category: {challenge.category?.name || "N/A"}</span>
      </div>

      <div className="mt-6">
        <Participants challengeId={id} />
      </div>
    </div>
  );
}

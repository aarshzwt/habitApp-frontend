import { useEffect, useState } from "react";
import { ChallengeCard } from "@/components/challenges/challengeCard";
import axiosInstance from "@/utils/axiosInstance";

export default function MyChallengesPage() {
    const [myChallenges, setMyChallenges] = useState([]);

    useEffect(() => {
        axiosInstance.get("/challenges/user").then(res => setMyChallenges(res.challenges));
    }, []);

    const activeChallenges = myChallenges.filter(ch => ch.status === "active");
    const pastChallenges = myChallenges.filter(ch => ch.status !== "active");

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-indigo-600 mb-4">My Challenges</h1>

            {/* Active Challenges */}
            {activeChallenges.map(ch => (
                <ChallengeCard key={ch.id} challenge={ch} joined={true} />
            ))}

            {/* Past Challenges */}
            {pastChallenges.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Past Challenges</h2>
                    {pastChallenges.map(ch => (
                        <ChallengeCard key={ch.id} challenge={ch} joined={false} />
                    ))}
                </div>
            )}
        </div>
    );
}


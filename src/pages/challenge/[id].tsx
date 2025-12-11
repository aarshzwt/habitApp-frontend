import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Participants } from "@/components/challenges/Participants";
import { Challenge } from "../../types/types";
import { ChallengeStats } from "@/components/challenges/challengeStats";

export default function ChallengeDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    if (!id) return null;

    const [challenge, setChallenge] = useState<Challenge | null>(null);

    useEffect(() => {
        axiosInstance.get(`/challenges/${id}`).then(res => setChallenge(res.challenge));
    }, [id]);

    if (!challenge) return <p className="text-gray-500">Loading...</p>;

    return (
        <div className="container shadow-md rounded-2xl p-6">
            <h1 className="text-2xl font-bold text-indigo-600">{challenge.title}</h1>
            <p className="text-gray-600 mt-2">{challenge.description}</p>

            <div className="flex gap-4 mt-4 text-sm text-gray-500">
                <span>Duration: {challenge.duration_days} days</span>
                <span>Category: {challenge.category_id || "N/A"}</span>
            </div>

            <div>
                <ChallengeStats challengeId={id as string} />
            </div>

            <div className="mt-6">
                <Participants challengeId={id as string} />
            </div>
        </div>
    );
}







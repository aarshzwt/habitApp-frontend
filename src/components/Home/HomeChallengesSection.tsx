'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { ChallengeCard } from "../challenges/challengeCard";
import { Challenge } from "../challenges/types";

export default function HomeChallengesSection() {
    const router = useRouter();
    const [challenges, setChallenges] = useState<Challenge[]>([]);

    useEffect(() => {
        const getChallenges = async () => {
            try {
                const res = await axiosInstance.get("/challenges", {
                    params: {
                        page: 1,
                        limit: 5,
                    }
                });

                setChallenges(res.challenges || []);
            } catch (err) {
                console.error(err);
            }
        };

        getChallenges();
    }, []);

    if (!challenges.length) return null;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">🏆 Challenges</h2>

                <button
                    onClick={() => router.push("/challenge")}
                    className="text-blue-600 font-medium hover:underline"
                >
                    Explore More →
                </button>
            </div>

            <div className="space-y-3">
                {challenges.map(ch => (
                    <ChallengeCard key={ch.id} challenge={ch} joined={ch.joined as boolean} />
                ))}
            </div>
        </div>
    );
}

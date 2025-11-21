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
                    params: { page: 1, limit: 5 }
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
        <div className="rounded-3xl shadow-lg p-6 bg-gradient-to-br 
                        from-purple-100 via-white to-blue-100 border border-white/30 backdrop-blur">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-gray-900">🏆 Challenges For You</h2>
                <button
                    onClick={() => router.push("/challenge")}
                    className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition"
                >
                    Explore More →
                </button>
            </div>

            <div className="space-y-4">
                {challenges.map(ch => (
                    <div
                        key={ch.id}
                        className="hover:scale-[1.01] transition-transform duration-200"
                    >
                        <ChallengeCard challenge={ch} joined={ch.joined as boolean} />
                    </div>
                ))}
            </div>
        </div>
    );
}

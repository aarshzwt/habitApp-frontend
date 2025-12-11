'use client'
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { ChallengeCard } from "../challenges/challengeCard";
import { Challenge } from "../challenges/types";
import { JoinChallengeModal } from "../Models/JoinChallengeModal";
import { LeaveChallengeModal } from "../Models/LeaveChallengeModal";
import { showSuccessToast } from "../toast";

export default function HomeChallengesSection() {
    const router = useRouter();
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [activeModal, setActiveModal] = useState<string | null>(null);
    const [challengeData, setChallengeData] = useState<{ challengeId: number, duration?: number } | null>(null);
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const getChallenges = async () => {
            try {
                const res = await axiosInstance.get("/challenges", {
                    params: { page: 1, limit: 5, recommended: true }
                });
                setChallenges(res.challenges || []);
            } catch (err) {
                console.error(err);
            }
        };
        getChallenges();
    }, [reload]);

    const handleJoin = async (startDate: string) => {
        if (!challengeData) return;
        try {
            await axiosInstance.post(`/challenges/join/${challengeData.challengeId}`, {
                duration: challengeData.duration,
                start_date: startDate,
            });

            setActiveModal(null);
            showSuccessToast('Joined challenge 🎉')
            setReload(prev => !prev);
        } catch { }
    };

    const handleLeave = async () => {
        if (!challengeData) return;
        try {
            await axiosInstance.delete(`/challenges/leave/${challengeData.challengeId}`);

            setActiveModal(null);
            showSuccessToast('Left challenge 👋')
            setReload(prev => !prev);
        } catch { }
    };

    return (
        <div className="rounded-3xl shadow-lg p-6 bg-gradient-to-br 
                        from-purple-100 via-white to-blue-100 border border-white/30 backdrop-blur">
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold text-gray-900">🏆 Challenge Suggestion For You</h2>
                <button
                    onClick={() => router.push("/challenge")}
                    className="text-blue-600 font-medium hover:underline hover:text-blue-700 transition"
                >
                    Explore More →
                </button>
            </div>

            <div className="space-y-4">
                {!challenges.length && (
                    <div className="flex flex-col items-center justify-center py-10 opacity-90">

                        {/* Trophy Illustration */}
                        <svg
                            width="150"
                            height="150"
                            viewBox="0 0 200 200"
                            xmlns="http://www.w3.org/2000/svg"
                            className="mb-6"
                        >
                            <circle cx="100" cy="100" r="90" fill="#F3F4F6" />
                            <path d="M70 60h60v30a30 30 0 0 1 -60 0z" fill="#FCD34D" />
                            <path d="M60 65h20v20a20 20 0 0 1 -20 -20z" fill="#FDE68A" />
                            <path d="M120 65h20a20 20 0 0 1 -20 20z" fill="#FDE68A" />
                            <rect x="85" y="110" width="30" height="40" rx="4" fill="#D1D5DB" />
                            <rect x="75" y="150" width="50" height="12" rx="4" fill="#9CA3AF" />
                        </svg>

                        <h3 className="text-xl font-semibold text-gray-700">No New Challenges Found</h3>
                        <p className="text-gray-500 mt-2 max-w-sm text-center">
                            Looks like you’ve joined everything that’s available right now. Check back later!
                        </p>
                    </div>
                )}

                {challenges.map(ch => (
                    <div
                        key={ch.id}
                        className="hover:scale-[1.01] transition-transform duration-200"
                    >
                        <ChallengeCard
                            key={ch.id}
                            challenge={ch}
                            joined={ch.joined!}
                            openJoinModal={(data: { challengeId: number, duration: number }) => { setActiveModal("join"); setChallengeData(data); }}
                            openLeaveModal={(data: { challengeId: number }) => { setActiveModal("leave"); setChallengeData(data); }}
                        />
                    </div>
                ))}
            </div>
            {activeModal === "join" && challengeData?.duration && (
                <JoinChallengeModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    duration={challengeData.duration}
                    onConfirm={handleJoin}
                />
            )}

            {activeModal === "leave" && (
                <LeaveChallengeModal
                    isOpen={true}
                    onClose={() => setActiveModal(null)}
                    onConfirm={handleLeave}
                />
            )}
        </div>
    );
}

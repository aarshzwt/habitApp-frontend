import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { ChallengeCard } from "./challengeCard";

export function ChallengeList() {
    const [challenges, setChallenges] = useState([]);

    useEffect(() => {
        const getChallenges = async () => {
            const res = await axiosInstance.get("/challenges");
            setChallenges(res.challenges)
        }
        getChallenges();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map(ch => (
                <ChallengeCard key={ch.id} challenge={ch} joined={ch.joined} />
            ))}
        </div>
    );
}

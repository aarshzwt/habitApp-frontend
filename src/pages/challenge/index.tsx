import { ChallengeList } from "@/components/challenges/challengeList";

export default function ChallengesPage() {
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="text-2xl font-bold text-indigo-600 mb-4">Challenges</h1>
            <ChallengeList />
        </div>
    );
}

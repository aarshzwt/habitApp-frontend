import { ChallengeDetails } from "@/components/challenges/challengeDetails";
import { useRouter } from "next/router";

export default function ChallengeDetailPage() {
    const router = useRouter();
    const { id } = router.query;

    if (!id) return null;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <ChallengeDetails id={id} />
        </div>
    );
}

import { useRouter } from 'next/router'
import { ChallengeActions } from './challengeActions'
import type { ChallengeCardProps } from './types'

export function ChallengeCard({ challenge, joined, openJoinModal, openLeaveModal }: ChallengeCardProps) {
  const router = useRouter()

  const statusStyles: Record<string, string> = {
    completed: "bg-green-100 text-green-700 border-green-300",
    retracted: "bg-orange-100 text-orange-700 border-orange-300",
    failed: "bg-red-100 text-red-700 border-red-300",
    active: "bg-blue-100 text-blue-700 border-blue-300",
    scheduled: "bg-yellow-100 text-yellow-700 border-yellow-300",
  }

  return (
    <div
      onClick={(e) => {
        // if the user clicked a button inside ChallengeActions, do NOT navigate
        if ((e.target as HTMLElement).closest(".action-button")) return;
        router.push(`/challenge/${challenge.id}`);
      }}
      className="
        group relative bg-white rounded-2xl shadow-md border border-gray-200
        hover:border-purple-400 hover:shadow-purple-50
        transition-all duration-300 cursor-pointer p-5
        hover:shadow-md hover:scale-[1.01]
      "
    >
      {/* Accent Ribbon */}
      {challenge.categoryName && (
        <div className="
        absolute -top-2 -left-2 bg-gradient-to-r from-purple-600 to-blue-500
        text-white text-[10px] px-2 py-0.5 rounded-md shadow
      ">
          {challenge.categoryName}
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="
          text-lg font-semibold text-gray-800
          group-hover:text-purple-600 group-hover:tracking-tight transition-all
        ">
          {challenge.title}
        </h3>

        {challenge.status && (
          <span
            className={`
              px-2.5 py-0.5 rounded-full text-xs font-medium border
              ${statusStyles[challenge.status] || "bg-gray-100 text-gray-700 border-gray-200"}
            `}
          >
            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="
        text-gray-600 text-sm mb-4 line-clamp-3
        group-hover:text-gray-700
      ">
        {challenge.description}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span className="
          px-2 py-1 bg-purple-50 text-purple-700 rounded-md border border-purple-200 
          font-medium 
        ">
          ⏱ {challenge.duration_days} days
        </span>

        <ChallengeActions
          challengeId={challenge.id}
          joined={joined}
          duration={challenge.duration_days}
          status={challenge.status}
          openJoinModal={openJoinModal}
          openLeaveModal={openLeaveModal}
        />

      </div>
    </div>
  )
}

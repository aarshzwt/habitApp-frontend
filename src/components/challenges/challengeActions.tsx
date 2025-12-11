'use client'

import { useRouter } from 'next/router'
import type { ChallengeActionsProps } from './types'

export function ChallengeActions({
  challengeId,
  joined,
  duration,
  status,
  openJoinModal,
  openLeaveModal
}: ChallengeActionsProps) {
  const router = useRouter()

  // Stats button for past challenges
  if (joined && status !== 'active' && status !== 'scheduled') {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/challenge/${challengeId}/stats`)
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
      >
        View Stats
      </button>
    )
  }

  return (
    <>
      {joined ? (
        <button
          className="action-button bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
          onClick={(e) => {
            e.stopPropagation()
            openLeaveModal({ challengeId })
          }}
        >
          Leave
        </button>
      ) : (
        <button
          className="action-button bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
          onClick={(e) => {
            e.stopPropagation()
            openJoinModal && openJoinModal({ duration, challengeId })
          }}
        >
          Join
        </button>
      )}
    </>
  );
}

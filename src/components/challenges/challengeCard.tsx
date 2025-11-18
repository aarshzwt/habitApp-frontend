import { useRouter } from 'next/router'
import { ChallengeActions } from './challengeActions'
import type { ChallengeCardProps } from './types'

export function ChallengeCard({ challenge, joined }: ChallengeCardProps) {
  const router = useRouter()

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-700 border border-green-300',
    retracted: 'bg-orange-100 text-orange-700 border border-orange-300',
    failed: 'bg-red-100 text-red-700 border border-red-300',
    active: 'bg-blue-100 text-blue-700 border border-blue-300',
    scheduled: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
  }

  return (
    <div
      onClick={() => router.push(`/challenge/${challenge.id}`)}
      className="group bg-white shadow-md hover:shadow-xl rounded-2xl p-5 border border-gray-200 hover:border-indigo-300 transition-all duration-200 cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
          {challenge.title}
        </h3>
        {challenge.status && (
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[challenge.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}
          >
            {/* {new Date(challenge.startDate) > new Date() ? "Scheduled" : challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)} */}
            {challenge.status.charAt(0).toUpperCase() + challenge.status.slice(1)}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {challenge.description}
      </p>

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>⏱ Duration: {challenge.duration_days} days</span>
        <ChallengeActions
          challengeId={challenge.id}
          joined={joined}
          duration={challenge.duration_days}
          status={challenge.status}
        />
      </div>
    </div>
  )
}

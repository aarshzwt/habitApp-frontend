'use client'

import { useState } from 'react'
import { useRouter } from 'next/router'
import axiosInstance from '@/utils/axiosInstance'
import type { ChallengeActionsProps } from './types'
import { Modal } from '../modal'
import { Button } from '../button'
import { showSuccessToast } from '../toast'

export function ChallengeActions({
  challengeId,
  joined,
  duration,
  status,
}: ChallengeActionsProps) {
  const router = useRouter()
  const [joinModalOpen, setJoinModalOpen] = useState(false)
  const [leaveModalOpen, setLeaveModalOpen] = useState(false)
  const [startDate, setStartDate] = useState('')

  const handleJoin = async () => {
    try {
      await axiosInstance.post(`/challenges/join/${challengeId}`, {
        duration,
        start_date: startDate,
      })
      showSuccessToast('Joined challenge 🎉')
      setJoinModalOpen(false)
      router.reload()
    } catch (error) {
    }
  }

  const handleLeave = async () => {
    try {
      await axiosInstance.delete(`/challenges/leave/${challengeId}`)
      showSuccessToast('Left challenge 👋')
      setLeaveModalOpen(false)
      router.reload()
    } catch (error) {
    }
  }

  // Stats button for past challenges
  if (joined && status !== 'active' && status !== 'scheduled') {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/challenge/${challengeId}/stats`)
        }}
        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
      >
        View Stats
      </button>
    )
  }

  return (
    <>
      {/* --- ACTION BUTTONS --- */}
      {joined ? (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setLeaveModalOpen(true)
          }}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
        >
          Leave
        </button>
      ) : (
        <button
          onClick={(e) => {
            e.stopPropagation()
            setJoinModalOpen(true)
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm transition-colors"
        >
          Join
        </button>
      )}

      {/* --- JOIN MODAL --- */}
      <Modal
        isOpen={joinModalOpen}
        onClose={() => setJoinModalOpen(false)}
        title="Join Challenge"
        footer={
          <>
            <Button variant="ghost" onClick={() => setJoinModalOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!startDate}
              onClick={handleJoin}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              Confirm Join
            </Button>
          </>
        }
      >
        <div className="space-y-3">
          <p>Select a start date to begin this challenge.</p>
          <input
            type="date"
            className="border rounded-md p-2 w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
      </Modal>

      {/* --- LEAVE CONFIRMATION MODAL --- */}
      <Modal
        isOpen={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        title="Leave Challenge"
        footer={
          <>
            <Button variant="ghost" onClick={() => setLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleLeave}
              variant="destructive"
            >
              Yes, Leave
            </Button>
          </>
        }
      >
        <p>Are you sure you want to leave this challenge?</p>
      </Modal>
    </>
  )
}

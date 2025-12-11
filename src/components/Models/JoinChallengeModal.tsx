'use client'

import { Modal } from '@/components/modal'
import { Button } from '@/components/button'
import { useState } from 'react'

interface JoinChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (startDate: string) => void
  duration: number
}

export function JoinChallengeModal({
  isOpen,
  onClose,
  onConfirm,
  duration,
}: JoinChallengeModalProps) {
  const [startDate, setStartDate] = useState('')

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Challenge"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!startDate}
            onClick={() => onConfirm(startDate)}
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
  )
}

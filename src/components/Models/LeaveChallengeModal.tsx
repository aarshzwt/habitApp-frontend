'use client'

import { Modal } from '@/components/modal'
import { Button } from '@/components/button'

interface LeaveChallengeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function LeaveChallengeModal({
  isOpen,
  onClose,
  onConfirm,
}: LeaveChallengeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Leave Challenge"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Yes, Leave
          </Button>
        </>
      }
    >
      <p>Are you sure you want to leave this challenge?</p>
    </Modal>
  )
}

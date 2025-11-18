'use client'
import React, { useState } from 'react'
import axiosInstance from '@/utils/axiosInstance'
import { Button } from '../button'
import { Modal } from '../modal'

interface ChangeEndDateModalProps {
  isOpen: boolean
  onClose: () => void
  habit: any
  onSuccess?: () => void
}

export default function ChangeEndDateModal({
  isOpen,
  onClose,
  habit,
  onSuccess,
}: ChangeEndDateModalProps) {
  const [newDate, setNewDate] = useState(habit?.end_date || '')
  const [loading, setLoading] = useState(false)

  async function handleSave(removeDate = false) {
    if (!removeDate && !newDate) return alert('Please select a new date.')
    try {
      setLoading(true)
      const finalDate = removeDate ? null : newDate
      await axiosInstance.post(`/habit/${habit.id}`, { end_date: finalDate, mode: "edit" })
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Failed to change end date:', err)
      alert('Error updating end date. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Change End Date"
      footer={
        <>
          <Button variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => handleSave(true)} disabled={loading}>
            Remove Date
          </Button>
          <Button variant="secondary" onClick={() => handleSave()} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-gray-700">
          Select New End Date:
        </label>
        <input
          type="date"
          className="border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-200"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
        />
      </div>
    </Modal>
  )
}

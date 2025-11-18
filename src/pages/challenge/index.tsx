'use client'

import { useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { Pagination } from "@/components/pagination"
import { ChallengeCard } from "@/components/challenges/challengeCard"
import { Loader2 } from "lucide-react"
import { paginationDataType } from "@/components/types"
import { Challenge, challengeApiResponse } from "./types"
import { Button } from "@/components/button"
import CreateChallengeModal from "@/components/Models/CreateChallengeModal"

export default function ChallengesPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([])
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [paginationData, setPaginationData] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 6,
        total: 0,
    })
    const [loading, setLoading] = useState<boolean>(false)
    const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
    const [refreshToggle, setRefreshToggle] = useState<boolean>(false)
    const fetchChallenges = async (page = 1, limit = 6) => {
        try {
            setLoading(true)
            const params = { page, limit }

            const res = await axiosInstance.get<challengeApiResponse>("/challenges", { params })
            setChallenges(res.challenges || [])
            setPaginationData(res.pagination)
        } catch (err) {
            console.error("Error fetching challenges:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchChallenges(currentPage, paginationData.itemsPerPage)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, paginationData.itemsPerPage, refreshToggle])

    return (
        <div className="container max-w-6xl mx-auto p-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                    🏆 Challenges
                </h1>
                <Button onClick={() => setIsCreateOpen(true)}>Create Challenge</Button>
            </div>
            <CreateChallengeModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={() => setRefreshToggle(prev => !prev)}
            />

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-20 text-gray-500">
                    <Loader2 className="animate-spin w-6 h-6 mr-2" />
                    <span>Loading challenges...</span>
                </div>
            )}

            {/* Empty State */}
            {!loading && challenges.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    <p className="text-lg">No challenges available yet.</p>
                    <p className="text-sm mt-1 text-gray-400">
                        Check back soon or create a new one!
                    </p>
                </div>
            )}

            {/* Challenge Grid */}
            {!loading && challenges.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {challenges.map((ch) => (
                            <ChallengeCard key={ch.id} challenge={ch} joined={ch.joined!} />
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Pagination
                            paginationData={paginationData}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(size) => {
                                setPaginationData((prev) => ({ ...prev, itemsPerPage: size }))
                                setCurrentPage(1)
                            }}
                            contentType="Challenge"
                        />
                    </div>
                </>
            )}
        </div>
    )
}

'use client'

import { useEffect, useState } from "react"
import axiosInstance from "@/utils/axiosInstance"
import { ChallengeCard } from "@/components/challenges/challengeCard"
import { Pagination } from "@/components/pagination"
import { Loader2 } from "lucide-react"
import { paginationDataType } from "@/components/types"
import { challengeApiResponse } from "./challenge/types"
import { Challenge } from "@/components/challenges/types"
import { useRouter } from "next/router"

export default function MyChallengesPage() {
    const router = useRouter();
    const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([])
    const [pastChallenges, setPastChallenges] = useState<Challenge[]>([])

    const [activePage, setActivePage] = useState(1)
    const [pastPage, setPastPage] = useState(1)

    const [activePagination, setActivePagination] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 5,
        total: 0,
    })
    const [pastPagination, setPastPagination] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 5,
        total: 0,
    })

    const [loadingActive, setLoadingActive] = useState(false)
    const [loadingPast, setLoadingPast] = useState(false)

    const fetchActive = async (page = 1, limit = 6) => {
        setLoadingActive(true)
        try {
            const res = await axiosInstance.get<challengeApiResponse>("/challenges/user", {
                params: { status: "active", page, limit },
            })
            setActiveChallenges(res.challenges)
            setActivePagination(res.pagination)
        } finally {
            setLoadingActive(false)
        }
    }

    const fetchPast = async (page = 1, limit = 6) => {
        setLoadingPast(true)
        try {
            const res = await axiosInstance.get<challengeApiResponse>("/challenges/user", {
                params: { status: "past", page, limit },
            })
            setPastChallenges(res.challenges)
            setPastPagination(res.pagination)
        } finally {
            setLoadingPast(false)
        }
    }

    useEffect(() => {
        fetchActive(activePage, activePagination.itemsPerPage)
    }, [activePage, activePagination.itemsPerPage])

    useEffect(() => {
        fetchPast(pastPage, pastPagination.itemsPerPage)
    }, [pastPage, pastPagination.itemsPerPage])

    return (
        <div className="container max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold mb-6">🏆 My Challenges</h2>
                <button
                    onClick={() => router.push("/challenge")}
                    className="text-blue-600 font-medium hover:underline"
                >
                    Explore More →
                </button>
            </div>
            <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col px-2">
                    <h3 className="font-semibold text-gray-800 mb-3">Active Challenges</h3>

                    {loadingActive && (
                        <div className="flex items-center py-10 text-gray-500">
                            <Loader2 className="animate-spin mr-2" /> Loading...
                        </div>
                    )}

                    {/* Fixed height list container */}
                    <div className="flex-1 min-h-[400px] flex flex-col gap-4">
                        {!loadingActive && activeChallenges.map(ch => (
                            <ChallengeCard key={ch.id} challenge={ch} joined={true} />
                        ))}

                        {!loadingActive && activeChallenges.length === 0 && (
                            <p className="text-gray-500 italic">No active challenges.</p>
                        )}
                    </div>

                    {/* Pagination stays at bottom now */}
                    {activeChallenges.length !== 0 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                paginationData={activePagination}
                                onPageChange={setActivePage}
                                onPageSizeChange={(size) => {
                                    setActivePagination(prev => ({ ...prev, itemsPerPage: size }))
                                    setActivePage(1)
                                }}
                                contentType="Active Challenge"
                            />
                        </div>
                    )}
                </div>

                <div className="flex flex-col px-2">
                    <h3 className="font-semibold text-gray-800 mb-3">Past Challenges</h3>

                    {loadingPast && (
                        <div className="flex items-center py-10 text-gray-500">
                            <Loader2 className="animate-spin mr-2" /> Loading...
                        </div>
                    )}

                    <div className="flex-1 min-h-[400px] flex flex-col gap-4">
                        {!loadingPast && pastChallenges.map(ch => (
                            <ChallengeCard key={ch.id} challenge={ch} joined={true} />
                        ))}

                        {!loadingPast && pastChallenges.length === 0 && (
                            <p className="text-gray-500 italic">No past challenges.</p>
                        )}
                    </div>

                    {pastChallenges.length !== 0 && (
                        <div className="mt-4 flex justify-center">
                            <Pagination
                                paginationData={pastPagination}
                                onPageChange={setPastPage}
                                onPageSizeChange={(size) => {
                                    setPastPagination(prev => ({ ...prev, itemsPerPage: size }))
                                    setPastPage(1)
                                }}
                                contentType="Past Challenge"
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

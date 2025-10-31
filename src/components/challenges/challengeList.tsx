'use client'
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { ChallengeCard } from "./challengeCard";
import { Pagination } from "../pagination";

interface paginationDataType {
    page: number;
    totalPages: number;
    itemsPerPage: number;
    total: number;
}

export function ChallengeList() {
    const [challenges, setChallenges] = useState([]);

    const [currentPage, setCurrentPage] = useState(1)
    const [paginationData, setPaginationData] = useState<paginationDataType>({
        page: 1,
        totalPages: 1,
        itemsPerPage: 5,
        total: 0,
    });

    const fetchChallenges = async (page = 1, limit = 5) => {
        try {
            const params: any = {
                page,
                itemsPerPage: paginationData.itemsPerPage,
                // sortBy: 'updated_at',
                // sortOrder: 'DESC',
            }

            const res = await axiosInstance.get(`/challenges?page=${page}&limit=${limit}`, { params });
            setChallenges(res.challenges || []);
            setPaginationData(res.pagination);
        } catch (err) {
            console.error("Error fetching challenges:", err);
        }
    };

    useEffect(() => {
        fetchChallenges(currentPage, paginationData.itemsPerPage);
    }, [paginationData.itemsPerPage, currentPage]);

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {challenges.map((ch) => (
                    <ChallengeCard key={ch.id} challenge={ch} joined={ch.joined} />
                ))}
            </div>

            {challenges.length !== 0 && (
                <Pagination
                    paginationData={paginationData}
                    onPageChange={setCurrentPage}
                    onPageSizeChange={(size) => {
                        setPaginationData((prev) => ({ ...prev, itemsPerPage: size }))
                        setCurrentPage(1)
                    }}
                    contentType="Challenge"
                />
            )}
        </>
    );
}

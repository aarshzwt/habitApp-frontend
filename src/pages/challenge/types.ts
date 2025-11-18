import { paginationDataType } from "@/components/types"

export interface Challenge {
    id: number
    title: string
    description: string
    joined?: boolean
    duration_days: number
    category_id: number | null
    created_by: number
    start_date: string,
    end_date: string,
    status: "active" | "completed" | "failed" | "retracted"
    [key: string]: any
}

export interface challengeApiResponse {
    challenges: Challenge[]
    pagination: paginationDataType
}
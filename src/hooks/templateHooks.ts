import useSWR from "swr";
import axiosInstance from "@/utils/axiosInstance";

const fetcher = (url: string, params: any) =>
    axiosInstance.get(url, { params }).then((res) => res);

export function useTemplatePreview(filters: any) {
    const key = filters ? ["/templates", filters] : null;

    const { data, error, isLoading } = useSWR(key, ([url, params]) =>
        fetcher(url, params)
    );

    return {
        count: data?.pagination?.total || 0,
        pagination: data?.pagination,
        isLoading,
        error,
    };
}

export function useTemplateList(params: any) {
    const key = params ? ["/templates", params] : null;

    const { data, error, isLoading, mutate } = useSWR(key, ([url, p]) =>
        fetcher(url, p)
    );

    return {
        templates: data?.templates || [],
        pagination: data?.pagination,
        isLoading,
        error,
        mutate, // to refetch when needed
    };
}

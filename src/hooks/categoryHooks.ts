// hooks/useCategories.ts
import useSWR from "swr";
import axiosInstance from "@/utils/axiosInstance";
import { CategoryType } from "@/components/Models/types";
import { Option } from "@/components/types";

export const fetcher = (url: string) => axiosInstance.get(url).then(res => res);

export function useCategories() {
  const { data, error, isLoading } = useSWR("/category", fetcher);

  const options: Option[] =
    data?.categories?.map((c: CategoryType) => ({
      value: c.id,
      label: c.name,
    })) || [];

  return {
    options,
    raw: data?.categories || [],
    isLoading,
    error,
  };
}

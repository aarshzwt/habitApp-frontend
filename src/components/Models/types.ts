export interface HabitModalPropsType {
    isOpen: boolean,
    onClose: () => void,
    onHabitCreated?: () => void,
    templateId?: number; // optional: template id to fetch
    habitId?: number;
}

export type HabitFormType = {
    title: string;
    description: string;
    frequency_type: "daily" | "x_times_per_week" | "every_x_days";
    frequency_days: number[] | null;
    frequency_value: number | null;
    category_id: number | null | string;
    start_date: string;
    end_date: string | null;
    template: boolean;
    showDayPicker: boolean;
    mode?:string;
};

export type HabitErrorsType = {
    [key: string]: string | undefined;
    title?: string;
    description?: string;
    frequency_type?: string;
    frequency_days?: string;
    frequency_value?: string;
    category_id?: string;
    start_date?: string;
    end_date?: string;
};

export interface CategoryType {
    id: number;
    name: string;
}

export type ChallengeFormType = {
    title: string;
    description: string;
    duration_days: string;
    category_id: number | null | string;
};

export interface AddCategoryModalPropTypes {
    onCategoryCreated: (category: CategoryType) => void;
    onClose: () => void;
}
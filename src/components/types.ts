import { SingleValue, Props as SelectProps } from 'react-select'

// Header Dropdown Item Types
export type DropDownItem = {
  label: string
  icon?: React.ReactNode
  variant?: 'danger' | 'default'
  onClick: () => void
}

export interface DropdownProps {
  triggerLabel: string
  items: DropDownItem[]
}


//Pagination Types
export interface paginationDataType {
  page: number
  totalPages: number
  itemsPerPage: number
  total: number
}

export interface PaginationProps {
  paginationData: paginationDataType
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  contentType: string
}


//HabitCalendar Types
export type Log = {
  id: number;
  date: string;
  status: "completed" | "missed" | "remaining";
};

export interface HabitCalendarProps {
  type: "challenge" | "habit";
  allLogs: Log[];
  startDate: string | Date;
  endDate: string | Date | null;
  onChange: () => void;
  clickable?: boolean
}


//TemplateList Types
export interface TemplatesType {
  id: number;
  categoryImage: string;
  categoryName: string;
  description: string;
  title: string;
  frequency_type: string,
  frequency_value: null | number,
  frequency_days: null | number[],
}


//Auth Form Types
export interface AuthFormPropsType {
  type: "signup" | "login",
  onSubmit: (form: FormType) => void
}
export interface FormType {
  username: string,
  email: string,
  password: string,
  timezone: string,
  role: string
}

// SelectFields Prop Types
export type Option = {
  value: string
  label: string
}

export interface MySelectProps
  extends Omit<
    SelectProps<Option, false>,
    'options' | 'onChange' | 'value' | 'name'
  > {
  options: Option[]
  onChange?: (value: SingleValue<Option>) => void
  label?: string
  name?: string
  value?: SingleValue<Option>
  required?: boolean
  placeholder?: string
  isLoading?: boolean
  error?: string
  isClearable?: boolean
  note?: string
}
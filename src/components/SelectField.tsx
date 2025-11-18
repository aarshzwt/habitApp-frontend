'use client'

import { useField, FormikContext } from 'formik'
import Select, { SingleValue } from 'react-select'
import { Tooltip } from 'react-tooltip'
import { useContext } from 'react'
import { MySelectProps, Option } from './types'

export default function SelectField({
  options,
  onChange,
  label,
  value,
  name,
  required,
  placeholder = 'Select an option',
  isLoading,
  error,
  isClearable = true,
  note,
  ...props
}: MySelectProps) {
  // Detect if inside Formik
  const formikContext = useContext(FormikContext)
  const isFormikContext = !!formikContext

  // Use Formik field only if in Formik context and name is provided
  let field: ReturnType<typeof useField>[0] | null = null
  let meta: ReturnType<typeof useField>[1] | null = null
  let helpers: ReturnType<typeof useField>[2] | null = null
  if (isFormikContext && name) {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      ;[field, meta, helpers] = useField(name)
    } catch {
      // Fallback if useField fails
      field = null
      meta = null
      helpers = null
    }
  }

  // Determine the actual value to display
  const displayValue =
    isFormikContext && field
      ? options.find((opt) => opt.value === field.value)
      : value

  // Determine the error to show
  const displayError =
    isFormikContext && meta
      ? meta.touched && meta.error
        ? meta.error
        : null
      : error

  // Handle change event
  const handleChange = (selectedOption: SingleValue<Option>) => {
    // Call external onChange if provided
    if (onChange) {
      onChange(selectedOption)
    }

    // Update Formik field if in Formik context
    if (isFormikContext && helpers) {
      helpers.setValue(selectedOption?.value || null)
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1 mb-1">
        {label && (
          <label className="text-sm font-medium text-gray-900 flex items-center">
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}

        {note && (
          <>
            <span
              data-tooltip-id={`${label}-tooltip`}
              className="ml-1 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-info-circle text-xs align-middle"></i>
            </span>
            <Tooltip
              id={`${label}-tooltip`}
              className="!text-sm !text-gray-900 !bg-white !border !border-gray-200 !p-2 !rounded-md !font-medium shadow-md max-w-xs z-50"
              place="right"
            >
              {note}
            </Tooltip>
          </>
        )}
      </div>
      <Select
        options={options}
        value={displayValue ?? null}
        onChange={handleChange}
        placeholder={placeholder}
        classNamePrefix="custom-select"
        menuPlacement="auto"
        isLoading={isLoading}
        isClearable={isClearable}
        {...props}
      />
      {displayError && (
        <div className="mt-1 text-xs text-red-500">{displayError}</div>
      )}
    </div>
  )
}

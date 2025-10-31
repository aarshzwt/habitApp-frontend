'use client'

import React, { useMemo } from 'react'
import ReactPaginate from 'react-paginate'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils'

interface PaginationProps {
  paginationData: paginationDataType
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  contentType: string
}
interface paginationDataType {
  page: number
  totalPages: number
  itemsPerPage: number
  total: number
}

export function Pagination({
  paginationData,
  onPageChange,
  onPageSizeChange,
  contentType = 'Posts',
}: PaginationProps) {
  const { page, totalPages, total, itemsPerPage } = paginationData

  const start = (page - 1) * itemsPerPage + 1
  const end = Math.min(page * itemsPerPage, total)

  //Dynamic Page Size option based on total
  const pageSizeOptions = useMemo(() => {
    const step = 5
    const options = []
    for (let i = step; i <= total + step; i += step) {
      options.push(i)
      if (i >= total) break
    }
    return options
  }, [total])

  const baseBtn =
    'px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer'
  const pageBtn = 'text-gray-800 hover:bg-gray-200'
  const activeBtn =
    'border border-primary-500 cursor-default hover:bg-primary-500'
  const disabledBtn = 'text-gray-400 cursor-not-allowed pointer-events-none'
  const baseNavBtn = 'flex items-center'

  return (
    <div className="mt-6 relative flex items-center justify-between w-full text-sm text-gray-600">
      <div>
        Showing {start} to {end} of {total}{' '}
        {contentType === 'All' ? <>Post</> : <>{contentType}</>}s
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="pageSize" className="text-gray-700">
          Show
        </label>
        <select
          id="pageSize"
          value={itemsPerPage}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-300 bg-white rounded-md text-sm px-2 py-1
          focus:ring-primary-500 focus:border-gray-400 outline-none cursor-pointer"
        >
          {pageSizeOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <span>{contentType === 'All' ? <>Post</> : <>{contentType}</>}s</span>
      </div>

      <div className="flex justify-center">
        <ReactPaginate
          forcePage={page - 1}
          pageCount={totalPages}
          onPageChange={(selected) => onPageChange(selected.selected + 1)}
          previousLabel={
            <>
              <ChevronLeft size={14} /> Previous
            </>
          }
          nextLabel={
            <>
              Next <ChevronRight size={14} />
            </>
          }
          breakLabel="..."
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          containerClassName="flex items-center gap-1 select-none"
          pageLinkClassName={cn(baseBtn, pageBtn)}
          activeLinkClassName={cn(baseBtn, activeBtn)}
          previousLinkClassName={cn(
            baseBtn,
            baseNavBtn,
            page === 1 ? disabledBtn : pageBtn
          )}
          nextLinkClassName={cn(
            baseBtn,
            baseNavBtn,
            page === totalPages ? disabledBtn : pageBtn
          )}
          breakLinkClassName="px-3 py-1.5 text-gray-500"
        />
      </div>
    </div>
  )
}

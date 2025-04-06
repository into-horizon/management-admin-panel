import React, { FC, ReactNode } from 'react'
import FormButtons from './FormButtons'
import { CForm } from '@coreui/react'

type FilterCardProps = {
  children?: ReactNode
  showButtons?: boolean
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  onReset?: (e: React.FormEvent<HTMLFormElement>) => void
}
const FilterCard: FC<FilterCardProps> = ({ children, showButtons, onSubmit, onReset }) => {
  return (
    <div className='card padding my-3'>
      {!showButtons ? (
        children
      ) : (
        <CForm
          onSubmit={(e) => {
            e.preventDefault()
            onSubmit?.(e)
          }}
          onReset={onReset}
        >
          {children}
          <FormButtons />
        </CForm>
      )}
    </div>
  )
}

export default FilterCard

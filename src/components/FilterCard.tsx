import React, { ReactNode } from 'react'

const FilterCard= ({children }: {children: ReactNode})=> {

  return (
    <div className="card padding mrgn25">
        {children}
    </div>
  )
}

export default FilterCard
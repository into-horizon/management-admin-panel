import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { getLogs, updateParams } from '../../store/log'
import Table from '../../components/Table'
import { updateParamsHelper } from '../../services/helpers'
import { columns } from './columns'
import FilterCard from '../../components/FilterCard'
import { CCol, CRow } from '@coreui/react'
import EmployeeSearch from './components/EmployeeSearch'
import UserSearch from './components/UserSearch'

const Log = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const dispatch = useDispatch()
  const { params, loading, data, count } = useSelector((state: RootState) => state.log)
  useEffect(() => {
    dispatch(getLogs())
  }, [params])

  const onPageChange = (page: number) => {
    setCurrentPage(page)
    dispatch(updateParams(updateParamsHelper(params, page)))
  }
  return (
    <div>
      <FilterCard showButtons>
        <CRow className=' justify-content-center my-3'>
          <CCol xs={12} md={6} lg={4}>
            <EmployeeSearch />
          </CCol>
          <CCol xs={12} md={6} lg={4}>
            <UserSearch />
          </CCol>
        </CRow>
      </FilterCard>
      <Table
        loading={loading}
        data={data}
        count={count}
        columns={columns}
        onPageChange={onPageChange}
        pageNumber={currentPage}
        pageSize={+params.limit!}
      />
    </div>
  )
}

export default Log

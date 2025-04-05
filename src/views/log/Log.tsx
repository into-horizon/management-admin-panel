import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { getLogs, updateParams } from '../../store/log'
import Table from '../../components/Table'
import { updateParamsHelper } from '../../services/helpers'
import { columns } from './columns'

const Log = () => {
  const dispatch = useDispatch()
  const [currentPage, setCurrentPage] = useState<number>(1)

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

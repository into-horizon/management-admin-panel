import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { CWidgetStatsF, CRow, CCol } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheck, cilPaperclip, cilTruck, cilExternalLink } from '@coreui/icons'
import { getAmounts } from '../../store/finance'
import AccountModal from './components/AccountModal'
import Table from '../../components/Table'
import UpdateWithdrawalStatus from './components/UpdateWithdrawalStatus'
import { RootState } from '../../store'
import { WithdrawalType } from '../../types'
import { getWithdrawalsHandler, setWithdrawalsParams } from '../../store/withdrawal'
import { updateParamsHelper } from '../../services/helpers'
import LoadingSpinner from '../../components/LoadingSpinner'

const Summary = () => {
  const { commission, delivery, transferred } = useSelector((state: RootState) => state.finance)
  const { loading } = useSelector((state: RootState) => state.finance)
  const {
    data: withdrawals,
    count,
    loading: withdrawalsLoading,
    params,
  } = useSelector((state: RootState) => state.withdrawals)

  const [add, setAdd] = useState(false)

  const dispatch = useDispatch()

  const columns = [
    { header: 'transfer to', field: 'title' },
    { header: 'amount', field: 'amount' },
    { header: 'status', field: 'status' },
    {
      header: 'created at',
      body: (data: WithdrawalType) => (
        <span>{new Date(data.created_at)?.toLocaleDateString()}</span>
      ),
    },
    {
      header: 'updated at',
      body: (data: WithdrawalType) => (
        <span>{data.updated ? new Date(data.updated)?.toLocaleDateString() : '-'}</span>
      ),
    },
    {
      header: 'attachment',
      body: (data: WithdrawalType) =>
        data.document ? (
          <a href={data.document} target='_blank'>
            <CIcon icon={cilPaperclip} />
          </a>
        ) : (
          '-'
        ),
    },
    {
      header: 'action',
      body: (data: WithdrawalType) =>
        data.status === 'requested' ? <UpdateWithdrawalStatus {...data} /> : <span>completed</span>,
    },
  ]
  const onPageChange = (page: number) => {
    dispatch(setWithdrawalsParams(updateParamsHelper(params, page)))
  }
  useEffect(() => {
    dispatch(getAmounts())
  }, [])

  useEffect(() => {
    dispatch(getWithdrawalsHandler())
  }, [params])
  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <AccountModal add={add} onClose={() => setAdd(false)} />
      <CRow>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className='mb-3'
            color='success'
            icon={<CIcon icon={cilCheck} height={24} />}
            padding={false}
            title='commission'
            value={commission}
          />
        </CCol>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className='mb-3'
            color='warning'
            icon={<CIcon icon={cilTruck} height={24} />}
            padding={false}
            title='delivery'
            value={delivery}
          />
        </CCol>
        <CCol lg={4} md={4} xs={12} sm={4}>
          <CWidgetStatsF
            className='mb-3'
            color='info'
            icon={<CIcon icon={cilExternalLink} height={24} />}
            padding={false}
            title='transferred'
            value={transferred}
          />
        </CCol>
      </CRow>
      <CRow className='justify-content-md-center mgn-top50'>
        <CCol xs={12} lg={10} xl={8}>
          <Table
            columns={columns}
            data={withdrawals}
            count={count}
            changeData={getWithdrawalsHandler}
            cookieName='withdrawal'
            loading={withdrawalsLoading}
            onPageChange={onPageChange}
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Summary

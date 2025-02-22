import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getTransactions, resetTransactionParams, setTransactionParams } from '../../store/finance'
import Table from '../../components/Table'
import FilterCard from '../../components/FilterCard'
import FormButtons from '../../components/FormButtons'
import { CCol, CForm, CFormInput, CFormLabel, CFormSelect, CRow } from '@coreui/react'
import CopyableText from '../../components/CopyableText'
import { updateParamsHelper } from '../../services/helpers'
import { RootState } from '../../store'
import { TransactionType } from '../../types'

export const Statement = () => {
  const {
    transactions: { data, count },
    loading,
    transactionsParams,
  } = useSelector((state: RootState) => state.finance)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getTransactions())
  }, [transactionsParams])
  const columns = [
    {
      header: 'id',
      field: 'id',
      body: (data: TransactionType) => <span>{data.id.substring(24)}</span>,
    },
    {
      header: 'order number',
      field: 'customer_order_id',
      body: (data: TransactionType) => <CopyableText data={data} field={'customer_order_id'} />,
    },
    { header: 'product', field: 'entitle' },
    { header: 'source', field: 'source' },
    {
      header: 'amount',
      field: 'amount',
      body: (data: TransactionType) => <span>{data.amount.toFixed(2)}</span>,
    },
    { header: 'status', field: 'status' },
    { header: 'type', field: 'type' },
    {
      header: 'created at',
      field: 'created_at',
      body: (data: TransactionType) => (
        <span>{new Date(data.created_at).toLocaleDateString()}</span>
      ),
    },
  ]
  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const _params: string[] = ['type', 'source', 'status', 'customer_order_id']
    type QueryType = {
      type?: HTMLSelectElement
      description?: HTMLSelectElement
      status?: HTMLSelectElement
      customer_order_id?: HTMLInputElement
    }
    const target = e.target as typeof e.target & QueryType

    type DataType = {
      type?: string
      source?: string
      status?: string
      customer_order_id?: string
    }
    let _data: DataType = {}
    _params.forEach((param) => {
      if (target[param as keyof QueryType]?.value && target[param as keyof QueryType]?.value !== '')
        _data[param as keyof DataType] = target[param as keyof QueryType]?.value
    })
    dispatch(setTransactionParams(_data))
  }
  const resetHandler = (e: React.FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      reset: () => void
    }
    target.reset()
    dispatch(resetTransactionParams())
  }

  const onPageChange = (page: number) => {
    dispatch(setTransactionParams(updateParamsHelper(transactionsParams, page)))
  }

  return (
    <>
      <FilterCard>
        <CForm onSubmit={submitHandler} onReset={resetHandler}>
          <CRow className='justify-content-center align-items-end' xs={{ gutterY: 3 }}>
            <CCol xs='auto'>
              <CFormLabel>order number</CFormLabel>
              <CFormInput placeholder='enter order number' id='customer_order_id' />
            </CCol>
            <CCol xs='auto'>
              <CFormLabel>status</CFormLabel>
              <CFormSelect id='status'>
                <option value=''>select</option>
                <option value='pending'>pending</option>
                <option value='released'>released</option>
                <option value='canceled'>canceled</option>
              </CFormSelect>
            </CCol>
            <CCol xs='auto'>
              <CFormLabel>type</CFormLabel>
              <CFormSelect id='type'>
                <option value=''>select</option>

                <option value='debit'>debit</option>
                <option value='credit'>credit</option>
              </CFormSelect>
            </CCol>
            <CCol xs='auto'>
              <CFormLabel>description</CFormLabel>
              <CFormSelect id='source'>
                <option value=''>select</option>

                <option value='delivery'>delivery</option>
                <option value='commission'>commission</option>
              </CFormSelect>
            </CCol>
            <CCol xs='auto'></CCol>

            <CCol xs={12} className='py-2'>
              <FormButtons />
            </CCol>
          </CRow>
        </CForm>
      </FilterCard>
      <Table
        columns={columns}
        data={data}
        count={count}
        cookieName='transactions'
        loading={loading}
        onPageChange={onPageChange}
      />
    </>
  )
}

export default Statement

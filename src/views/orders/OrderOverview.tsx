import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import {
  getOverviewOrdersHandler,
  getStatuesHandler,
  bulkStatusUpdate,
  setOverviewParams,
} from '../../store/orders'
import OrdersModel from './OrdersModel'
import { useDispatch, useSelector } from 'react-redux'
import Paginator from '../../components/Paginator'
import {
  CForm,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CFormCheck,
  CFormInput,
  CButtonGroup,
  CTooltip,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CFormLabel,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilPencil } from '@coreui/icons'
import Table from '../../components/Table'
import Export from '../../components/Export'
import NewOrders from 'src/services/Orders'
import CopyableText from '../../components/CopyableText'
import { RootState } from 'src/store'
import { OrderType } from 'src/types'
import { updateParamsHelper } from 'src/services/helpers'

const OrdersOverview = () => {
  const initialParams = { limit: 5, offset: 0 }
  const {
    overviewParams,
    isLoading,
    ordersOverview: { data: orders, count },
    statuses,
  } = useSelector((state: RootState) => state.orders)
  const [selected, setSelected] = useState<any[]>([])
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(getOverviewOrdersHandler())
    dispatch(getStatuesHandler())
  }, [overviewParams])

  const [searchType, setSearchType] = useState('status')
  const [view, setView] = useState('card')
  const [visible, setVisible] = useState(false)
  const submitHandler = (e: FormEvent<HTMLFormElement>) => {
    const target = e.target as typeof e.target & {
      order: HTMLInputElement
      status: HTMLSelectElement
    }
    setOverviewParams({ order_id: target.order?.value, status: target.status?.value })
    e.preventDefault()
    let data: { status?: string; customer_order_id?: string } = {}
    target.status?.value && (data.status = target.status?.value)
    target.order?.value && (data.customer_order_id = target.order?.value)
    setOverviewParams({ ...initialParams, ...data })
  }
  const columns = [
    {
      header: 'order id',
      field: 'customer_order_id',
      body: (data: OrderType) => <CopyableText data={data} field='customer_order_id' />,
    },
    { header: 'status', field: 'status' },
  ]

  const changeView = (e: ChangeEvent<HTMLInputElement>) => {
    setView(e.target.id)
    setOverviewParams(initialParams)
  }
  const statusHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      status: HTMLSelectElement
    }
    dispatch(bulkStatusUpdate({ id: selected.join('&'), status: target.status.value }))
    setVisible(false)
  }
  const downloadableData = async () => {
    let _params = { ...overviewParams }
    delete _params?.limit
    delete _params?.offset
    let { orders } = await NewOrders.getStoreNotPendingOrders(_params)
    return orders
  }

  return (
    <>
      <h2>orders overview</h2>
      <CButtonGroup
        role='group'
        aria-label='Basic checkbox toggle button group'
        size='lg'
        className='m-2-1rem'
      >
        <CFormCheck
          type='radio'
          button={{ color: 'primary', variant: 'outline' }}
          name='btnradio'
          id='card'
          label='Card View'
          checked={view === 'card'}
          onChange={changeView}
        />
        <CFormCheck
          type='radio'
          button={{ color: 'primary', variant: 'outline' }}
          name='btnradio'
          id='table'
          checked={view === 'table'}
          label='Table View'
          onChange={changeView}
        />
      </CButtonGroup>
      <CRow className='background'>
        <CCol md={2}>
          <strong>search by</strong>
        </CCol>
        <CCol md={2}>
          <CFormCheck
            type='radio'
            name='search'
            value='status'
            label='order status'
            checked={searchType === 'status'}
            onChange={(e) => setSearchType(e.target.value)}
          />
        </CCol>
        <CCol md={2}>
          <CFormCheck
            type='radio'
            name='search'
            value='number'
            label='order number'
            checked={searchType === 'number'}
            onChange={(e) => setSearchType(e.target.value)}
          />
        </CCol>

        {searchType === 'status' && (
          <CForm onSubmit={submitHandler} className='mgn-top50'>
            <CRow>
              <CCol>
                <CFormSelect id='status'>
                  <option value=''>All</option>
                  {React.Children.toArray(
                    statuses.map((status) => <option value={status}>{status}</option>),
                  )}
                  {/* <option value='canceled'>canceled</option>
                                <option value='accepted'>accepted</option>
                                <option value='pending'>pending</option> */}
                </CFormSelect>
              </CCol>
              <CCol>
                <CButton type='submit'>
                  <CIcon icon={cilSearch} />
                  search
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        )}
        {searchType === 'number' && (
          <CForm className='mt-3' onSubmit={submitHandler}>
            <CRow>
              <CCol>
                <CFormInput
                  type='text'
                  placeholder='order number'
                  aria-label='default input example'
                  id='order'
                />
              </CCol>
              <CCol>
                <CButton type='submit'>
                  <CIcon icon={cilSearch} />
                  search
                </CButton>
              </CCol>
            </CRow>
          </CForm>
        )}
      </CRow>

      {view === 'card' && (
        <>
          <OrdersModel data={orders} loading={isLoading} />
          <Paginator
            count={+count}
            params={overviewParams}
            onPageChange={(page) =>
              dispatch(setOverviewParams(updateParamsHelper(overviewParams, page)))
            }
            cookieName='orderOverview'
          />
        </>
      )}

      {view === 'table' && (
        <>
          <CRow className='justify-content-end mgn-top50' xs={{ gutterX: 3 }}>
            <CCol xs='auto'>
              <Export color='primary' data={downloadableData} fileName='orders' />
            </CCol>
            <CCol xs='auto'>
              <CTooltip content='update status'>
                <CButton color='secondary' onClick={() => setVisible(true)}>
                  <CIcon icon={cilPencil} />
                </CButton>
              </CTooltip>
              <CModal visible={visible} alignment='center'>
                <CModalHeader>
                  <CModalTitle>Bulk Status Update</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={statusHandler}>
                  <CRow className='justify-content-center'>
                    <CCol xs='auto'>
                      <CFormLabel htmlFor='status'>Select Status</CFormLabel>
                      <CFormSelect name='status' id='status'>
                        <option value='delivered'>delivered</option>
                        <option value='canceled'>canceled</option>
                        <option value='ready for pick-up'>ready for pick-up</option>
                        <option value='out for delivery'>out for delivery</option>
                        <option value='received at hub'>received at hub</option>
                        <option value='ready for delivery'>ready for delivery</option>
                      </CFormSelect>
                    </CCol>
                  </CRow>
                  <CModalFooter>
                    <CButton color='secondary' onClick={() => setVisible(false)}>
                      Cancel
                    </CButton>
                    <CButton color='primary' type='submit'>
                      Submit
                    </CButton>
                  </CModalFooter>
                </CForm>
              </CModal>
            </CCol>
          </CRow>
          <Table
            checkbox
            loading={isLoading}
            columns={columns}
            data={orders}
            count={count}
            params={overviewParams}
            cookieName='tableView'
            onPageChange={(page) =>
              dispatch(setOverviewParams({ offset: (page - 1) * overviewParams.limit! }))
            }
            displayedItems
            onSelect={setSelected}
          />
        </>
      )}
    </>
  )
}

export default OrdersOverview

import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { getOverviewOrdersHandler, getStatuesHandler, bulkStatusUpdate } from '../../store/orders'
import OrdersModel from './OrdersModel'
import { connect } from 'react-redux'
import Paginator from '../../components/Paginator';
import { CForm, CFormSelect, CButton, CRow, CCol, CSpinner, CFormCheck, CFormInput, CButtonGroup, CTooltip, CModal, CModalHeader, CModalTitle, CModalFooter, CFormLabel } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilPencil, cilCloudDownload } from '@coreui/icons';
import Table from '../../components/Table';
import Export from '../../components/Export';
import NewOrders from 'src/services/Orders';
import CopyableText from '../../components/CopyableText';
import { RootState } from 'src/store';


type PropsTypes = {
    bulkStatusUpdate : (p: {id: string, status: string})=> Promise<void>,
    getOverviewOrdersHandler: (p: ParamsType) => Promise<void>,
    orders : OrderType[],
    count : number,
    getStatuesHandler : ()=> Promise<void>,
    statuses : string[]
}
const OrdersOverview = ({ bulkStatusUpdate, getOverviewOrdersHandler, orders, count, getStatuesHandler, statuses }:PropsTypes) => {
    const initialParams = { limit: 5, offset: 0 }
    const [params, setParams] = useState<ParamsType>(initialParams)
    const [selected, setSelected] = useState<any[]>([])
    useEffect(() => {
        Promise.all([getOverviewOrdersHandler(params), getStatuesHandler()]).then(() => setLoading(false))
    }, [params])

    const [orderStatus, setOrderStatus] = useState('')
    const [searchType, setSearchType] = useState('status')
    const [orderId, setOrder] = useState('')
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('card')
    const [visible, setVisible] = useState(false)
    const submitHandler = (e: FormEvent<HTMLFormElement>) => {
        setLoading(true)
        const target = e.target as typeof e.target & {
            order: HTMLInputElement
            status: HTMLSelectElement
        }
        setOrder(target.order?.value)
        setOrderStatus(target.status?.value)
        setParams(x => { return { ...x, order_id: target.order?.value, status: target.status?.value } })
        e.preventDefault();
        let data: { status?: string, customer_order_id?: string } = {}
        target.status?.value && (data.status = target.status?.value)
        target.order?.value && (data.customer_order_id = target.order?.value)
        setParams({ ...initialParams, ...data })
        // Promise.all([getOverviewOrdersHandler({ ...initialParams, ...data })]).then(() => setLoading(false))

    }
    const columns = [{ header: 'order id', field: 'customer_order_id', body: (data: OrderType) => <CopyableText data={data} field='customer_order_id' /> }, { header: 'status', field: 'status' }]

    const changeView = (e: ChangeEvent<HTMLInputElement>) => {
        setView(e.target.id)
        setParams(initialParams)
    }
    const statusHandler = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            status: HTMLSelectElement
        }
        bulkStatusUpdate({ id: selected.join('&'), status: target.status.value })
        setVisible(false)
    }
    const downloadableData = async () => {
        let _params = { ...params }
        delete _params?.limit
        delete _params?.offset
        let { orders } = await NewOrders.getStoreNotPendingOrders(_params)
        return orders
    }


    return (
        <>
            <h2>orders overview</h2>
            <CButtonGroup role="group" aria-label="Basic checkbox toggle button group" size='lg' className='m-2-1rem'>
                <CFormCheck
                    type="radio"
                    button={{ color: 'primary', variant: 'outline' }}
                    name="btnradio"
                    id="card"

                    label="Card View"
                    checked={view === 'card'}
                    onChange={changeView}
                />
                <CFormCheck
                    type="radio"
                    button={{ color: 'primary', variant: 'outline' }}
                    name="btnradio"
                    id="table"
                    checked={view === 'table'}
                    label="Table View"
                    onChange={changeView}
                />
            </CButtonGroup>
            <CRow className='background'>
                <CCol md={2}>
                    <strong>search by</strong>
                </CCol>
                <CCol md={2}>

                    <CFormCheck type='radio' name='search' value="status" label="order status" defaultChecked onChange={e => setSearchType(e.target.value)} />
                </CCol>
                <CCol md={2}>

                    <CFormCheck type='radio' name='search' value="number" label="order number" onChange={e => setSearchType(e.target.value)} />
                </CCol>

                {searchType === 'status' && <CForm onSubmit={submitHandler} className='mgn-top50'>
                    <CRow>
                        <CCol >
                            <CFormSelect id="status" onChange={e => setOrderStatus(e.target.value)}>
                                <option value=''>All</option>
                                {React.Children.toArray(statuses.map(status => <option value={status}>{status}</option>))}
                                {/* <option value='canceled'>canceled</option>
                                <option value='accepted'>accepted</option>
                                <option value='pending'>pending</option> */}
                            </CFormSelect>

                        </CCol>
                        <CCol>

                            <CButton type="submit" ><CIcon icon={cilSearch} />search</CButton>
                        </CCol>
                    </CRow>

                </CForm>}
                {searchType === 'number' && <CForm className='mgn-top50' onSubmit={submitHandler}>
                    <CRow>
                        <CCol>

                            <CFormInput type="text" placeholder="order number" aria-label="default input example" id='order' />
                        </CCol>
                        <CCol>

                            <CButton type="submit" ><CIcon icon={cilSearch} />search</CButton>
                        </CCol>

                    </CRow>
                </CForm>}
            </CRow>

            {view === 'card' && <>
                <OrdersModel data={orders} loading={loading} />
                <Paginator count={Number(count)} params={params} changeData={getOverviewOrdersHandler} cookieName='orderOverview' updateLoading={setLoading } />
            </>
            }

            {view === 'table' &&
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
                                            <CFormLabel htmlFor='status'>
                                                Select Status
                                            </CFormLabel>
                                            <CFormSelect name='status' id='status'>
                                                <option value="delivered">delivered</option>
                                                <option value="canceled">canceled</option>
                                                <option value="ready for pick-up">ready for pick-up</option>
                                                <option value="out for delivery">out for delivery</option>
                                                <option value="received at hub">received at hub</option>
                                                <option value="ready for delivery">ready for delivery</option>
                                            </CFormSelect>
                                        </CCol>
                                    </CRow>
                                    <CModalFooter>

                                        <CButton color='secondary' onClick={() => setVisible(false)}>Cancel</CButton>
                                        <CButton color='primary' type='submit' >Submit</CButton>
                                    </CModalFooter>
                                </CForm>
                            </CModal>
                        </CCol>
                    </CRow>
                    <Table
                        checkbox loading={loading}
                        columns={columns} data={orders}
                        count={count}
                        changeData={getOverviewOrdersHandler}
                        params={params}
                        cookieName='tableView'
                        updateLoading={setLoading}
                        updateParams={setParams}
                        displayedItems
                        onSelect={setSelected}
                    />
                </>
            }

        </>
    )
}

const mapStateToProps = (state : RootState) => ({
    orders: state.orders.ordersOverview.data,
    count: state.orders.ordersOverview?.count,
    statuses: state.orders.statuses
})

const mapDispatchToProps = { getOverviewOrdersHandler, getStatuesHandler, bulkStatusUpdate }

export default connect(mapStateToProps, mapDispatchToProps)(OrdersOverview)
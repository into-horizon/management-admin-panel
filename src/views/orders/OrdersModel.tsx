import React, { useState, useEffect, useRef, FormEvent, Children } from 'react';
import { getPendingOrdersHandler, updateOrderItemHandler } from 'src/store/orders';
import { connect } from 'react-redux'
import defaultProductImg from '../../assets/images/default-store-350x350.jpg'
import { CTable, CTableHead, CTableRow, CTableHeaderCell, CTableDataCell, CTableBody, CFormSelect, CButton, CSpinner, CCol, CRow, CModal, CModalHeader, CModalFooter, CModalTitle, CForm } from '@coreui/react'
import Pdf from '../../components/Pdf'
import CopyableText from '../../components/CopyableText';
import { RootState } from 'src/store';
import { OrderType, OrderItemType } from 'src/types';

type PropTypes = {
    data: OrderType[],
    updateOrderItemHandler: (item: OrderItemType) => Promise<void>,
    loading?: boolean
    type?: string
}
const OrderModel = ({ data, updateOrderItemHandler, loading, type }: PropTypes) => {


    const [itemAction, setItemAction] = useState<string>('')
    const [itemId, setItemId] = useState('')

    const closeModel = () => {
        setItemAction('')
        setItemId('')
    }

    const updateItem = (e: FormEvent<HTMLFormElement>, item: OrderItemType) => {
        e.preventDefault();
        const target = e.target as typeof e.target & {
            status: HTMLSelectElement
            cancellation_reason: HTMLInputElement
        }
        itemAction === 'canceled' ? updateOrderItemHandler({ ...item, status: target.status.value, cancellation_reason: target.cancellation_reason.value }) : updateOrderItemHandler({ ...item, status: target.status.value })
        closeModel()
    }


    const OrderItemAction = ({ item }: { item: OrderItemType }) => {
        const { entitle } = item
        return (
            <React.Fragment>
                <CModalHeader>{entitle}</CModalHeader>

                <CForm onSubmit={e => updateItem(e, item)}>
                    <CRow>
                        <CCol md={11} >
                            <CFormSelect id='status' onChange={e => setItemAction(e.target.value)} className="m-2-1rem" value={itemAction}>
                                <option value="accepted">approve</option>
                                <option value="canceled">reject</option>
                            </CFormSelect>
                        </CCol>
                        {itemAction === 'canceled' && <CCol md={11} className="m-2-1rem">
                            <CFormSelect id='cancellation_reason' required={itemAction === 'canceled'}>
                                <option value="incorrect item">incorrect item</option>
                                <option value="out of stock">out of stock</option>
                                <option value="defective">defective</option>
                            </CFormSelect>
                        </CCol>}
                    </CRow>
                    <CModalFooter >

                        <CButton type='submit'>submit</CButton>
                    </CModalFooter>

                </CForm>
            </React.Fragment>
        )
    }

    return (
        <>
            {loading ? <CSpinner /> :
                data.map((order, idx) =>
                    <div id='orders' key={idx} style={{ border: '1px solid black', backgroundColor: 'white', borderRadius: '2rem', padding: '2rem', margin: '2rem 0' }}>

                        <h5>order details</h5>
                        <CTable >
                            <CTableHead>
                                <CTableRow>
                                    <CTableHeaderCell>
                                        Order ID
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>
                                        customer Name
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>
                                        grand total
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>
                                        place order date
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>
                                        delivery date order date
                                    </CTableHeaderCell>
                                    <CTableHeaderCell>
                                        status
                                    </CTableHeaderCell>
                                </CTableRow>
                            </CTableHead>
                            <CTableBody>
                                <CTableRow>
                                    <CTableDataCell>
                                        <CopyableText data={order} field='customer_order_id' />

                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {`${order.first_name} ${order.last_name}`}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {order.grand_total}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {new Date(order.created_at).toLocaleDateString()}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {new Date(order.updated).toLocaleDateString()}
                                    </CTableDataCell>
                                    <CTableDataCell>
                                        {order.status}
                                    </CTableDataCell>
                                </CTableRow>
                            </CTableBody>
                        </CTable>
                        <h6>order items</h6>
                        <div >

                            <CTable align='middle'>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell>
                                            image
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            Title
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            price
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            quantity
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            size
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            size
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            store
                                        </CTableHeaderCell>
                                        <CTableHeaderCell>
                                            status
                                        </CTableHeaderCell>
                                        {type === 'pending' && <CTableHeaderCell>
                                            action
                                        </CTableHeaderCell>}
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {Children.toArray( order.items.map((item) =>
                                        <CTableRow>
                                            <CTableDataCell>

                                                {item && <img style={{ width: '7rem' }} src={item.picture ?? defaultProductImg} alt='img' />}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.entitle}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.price}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.quantity}
                                            </CTableDataCell>
                                             <CTableDataCell>
                                                {item.size ?? '-'}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.color ?? '-'}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.store_name}
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                {item.status}
                                            </CTableDataCell>
                                            {item.status === 'pending' && <CTableDataCell>
                                                <CModal visible={itemId === item.id} alignment="center" onClose={closeModel}>
                                                    <OrderItemAction item={item} />
                                                </CModal>
                                                <CButton color="secondary" onClick={() => setItemId(item.id)}>action</CButton>

                                            </CTableDataCell>}
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </div>

                        <Pdf order={order} />
                    </div>
                )}


        </>
    )
}

const mapStateToProps = (state: RootState) => ({
    pendingOrders: state.orders.pendingOrders
})

const mapDispatchToProps = { updateOrderItemHandler }
export default connect(mapStateToProps, mapDispatchToProps)(OrderModel)
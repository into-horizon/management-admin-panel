import React, { useState, useEffect } from 'react';
import { getPendingOrdersHandler } from 'src/store/orders';
import { connect } from 'react-redux'
import OrdersModel from './OrdersModel'
import { CSpinner } from '@coreui/react';
import Paginator from '../../components/Paginator';
import { RootState } from 'src/store';

type PropTypes = {
    orders: OrderType[],
    getPendingOrdersHandler: (p: ParamsType) => Promise<void>,
    count: number
}

const PendingOrders = ({ orders, getPendingOrdersHandler, count }: PropTypes) => {
    const [params, setParams] = useState<ParamsType>({ limit: 10, offset: 0 })
    const [loading, setLoading] = useState<boolean>(true)
    useEffect(() => {
        getPendingOrdersHandler(params).then(()=> setLoading(false))
    }, [])
    return (
        <>
            <h2>pending orders</h2>
            {loading ? <CSpinner /> : <OrdersModel data={orders} />}
            <Paginator params={params} updateParams={setParams} count={Number(count)} changeData={getPendingOrdersHandler} cookieName='pendingOrder' updateLoading={setLoading} />
        </>
    )
}
const mapStateToProps = (state: RootState) => ({
    orders: state.orders.pendingOrders.data,
    count: state.orders.pendingOrders.count,
})
const mapDispatchToProps = { getPendingOrdersHandler }

export default connect(mapStateToProps, mapDispatchToProps)(PendingOrders)
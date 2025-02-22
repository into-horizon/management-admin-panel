import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import OrdersModel from './OrdersModel'
import Paginator from '../../components/Paginator'
import LoadingSpinner from '../../components/LoadingSpinner'
import { RootState } from '../../store'
import { getPendingOrdersHandler, setPendingParams } from '../../store/orders'

const PendingOrders = () => {
  const {
    pendingParams,
    pendingOrders: { data: orders, count },
    isLoading,
  } = useSelector((state: RootState) => state.orders)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getPendingOrdersHandler())
  }, [pendingParams])

  return (
    <>
      <h2>pending orders</h2>
      {isLoading ? <LoadingSpinner /> : <OrdersModel data={orders} type='pending' />}
      <Paginator
        params={pendingParams}
        count={+count}
        cookieName='pendingOrder'
        onPageChange={(page) =>
          dispatch(setPendingParams({ offset: (page - 1) * pendingParams.limit! }))
        }
      />
    </>
  )
}

export default PendingOrders

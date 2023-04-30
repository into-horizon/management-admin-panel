import { createSlice } from "@reduxjs/toolkit";

import Orders from '../services/Orders'
import { updateToast } from "./globalToasts";
import { addData } from "./store";
const orders = createSlice({
    name: 'orders',
    initialState: {pendingOrders: {data: [], count: 0 } , ordersOverview:{data: [], count: 0} , messages:'', statuses: []},
    reducers: {
        addPendingOrders(state, action) {
            return { ...state, pendingOrders: action.payload }
        },
        errorMessage(state, action) {
            return { ...state, errorMessage: action.payload }
        },
        addOverviewOrders(state, action) {
            return { ...state, ordersOverview: action.payload }
        },
        addStatues(state, action) {
            return { ...state, statuses: action.payload }
        }
    }
})

export const getPendingOrdersHandler = (payload) => async (dispatch, state) => {
    try {
        let {status, data, message} = await Orders.getStorePendingOrders(payload)
        if(status === 200){
            dispatch(addPendingOrders(data))
        } else{
            dispatch(updateToast({status, message, type: 'error'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message:error.message, type: 'error'}))
    }
}
export const getOverviewOrdersHandler = (payload) => async (dispatch, state) => {
    try {
        let {status, data, message} = await Orders.getStoreNotPendingOrders(payload)
        if(status=== 200){
            
            dispatch(addOverviewOrders(data))
        } else   dispatch(updateToast({status, message, type: 'error'}))
    } catch (error) {
        dispatch(updateToast({status: 403, message:error.message, type: 'error'}))
    }
}

export const updateOrderItemHandler = payload => async (dispatch, state) => {
    try {
        let { status, result, message } = await Orders.updateOrderItem(payload)
        if (status === 200) {
            let newState = await state().orders.pendingOrders.data.map(order => {
                let items=  order.items.map(item => {
                    if (item.id === result.id) return result;
                    else return item
                })
                return {...order, items: items} 
            })
            dispatch(addPendingOrders({...state().orders.pendingOrders,data:newState}))
        } else {
            dispatch(updateToast({status, message, type: 'error'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message:error.message, type: 'error'}))
    }
}

export const getStatuesHandler = () => async (dispatch) => {
    try {
        let {data, status} = await Orders.getStatues()
        if (status === 200 ){
            dispatch(addStatues(data))
        } 
    } catch (error) {
        dispatch(updateToast({status: 403, message:error.message, type: 'error'}))
    }
}

export const bulkStatusUpdate =  payload => async (dispatch, state) =>{
    try {
        const {status, data, message} = await Orders.bulkStatusUpdate(payload)
        const { data: overview, count} = state().orders.ordersOverview
        let newState =  overview.map(v =>{
            let x  = v
            data.map(d=>{
                if(v.id === d.id){
                   x = {...v,...d}
                } 
             })
            return x
        })
        if(status === 200){
            dispatch(addOverviewOrders({data:newState, count}))
            dispatch(updateToast({status, type: 'update', message}))
        } else dispatch(updateToast({status: status, message:message, type: 'error'}))
    } catch (error) {
        dispatch(updateToast({status: 403, message:error.message, type: 'error'}))
    }
}

export default orders.reducer
export const { addPendingOrders, errorMessage, addOverviewOrders,addStatues } = orders.actions
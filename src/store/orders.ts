import { createSlice } from "@reduxjs/toolkit";

import Orders from '../services/Orders'
import { updateToast } from "./globalToasts";
 import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";
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

export const getPendingOrdersHandler = (payload : ParamsType) => async (dispatch : AppDispatch, state : ()=> RootState) => {
    try {
        let {status, data, message} = await Orders.getStorePendingOrders(payload)
        if(status === 200){
            dispatch(addPendingOrders(data))
        } else{
            dispatch(updateToast({status, message, type: DialogResponseTypes.ERROR}))
        }
    } catch (error) {
        if(error instanceof Error) {

            dispatch(updateToast({status: 403, message:error.message, type: DialogResponseTypes.ERROR}))
        }
    }
}
export const getOverviewOrdersHandler = (payload : ParamsType) => async (dispatch : AppDispatch, state : ()=> RootState) => {
    try {
        let {status, data, message} = await Orders.getStoreNotPendingOrders(payload)
        if(status=== 200){
            
            dispatch(addOverviewOrders(data))
        } else   dispatch(updateToast({status, message, type: DialogResponseTypes.ERROR}))
    } catch (error) {
        if(error instanceof Error) {

            dispatch(updateToast({status: 403, message:error.message, type: DialogResponseTypes.ERROR}))
        }
    }
}

export const updateOrderItemHandler = (payload : OrderItemType) => async (dispatch :AppDispatch, state : ()=> RootState) => {
    try {
        let { status, result, message } = await Orders.updateOrderItem(payload)
        if (status === 200) {
            let newState = state().orders.pendingOrders.data.map((order : OrderType ) => {
                let items=  order.items.map((item : OrderItemType) => {
                    if (item.id === result.id) return result;
                    else return item
                })
                return {...order, items: items} 
            })
            dispatch(addPendingOrders({...state().orders.pendingOrders,data:newState}))
        } else {
            dispatch(updateToast({status, message, type: DialogResponseTypes.ERROR}))
        }
    } catch (error) {
        if(error instanceof Error) {

            dispatch(updateToast({status: 403, message:error.message, type: DialogResponseTypes.ERROR}))
        }
    }
}

export const getStatuesHandler = () => async (dispatch: AppDispatch) => {
    try {
        let {data, status} = await Orders.getStatues()
        if (status === 200 ){
            dispatch(addStatues(data))
        } 
    } catch (error) {
        if(error instanceof Error) {

            dispatch(updateToast({status: 403, message:error.message, type: DialogResponseTypes.ERROR}))
        }
    }
}

export const bulkStatusUpdate =  (payload: {status: string , id: string}) => async (dispatch : AppDispatch, state : ()=> RootState) =>{
    try {
        const {status, data, message} = await Orders.bulkStatusUpdate(payload)
        const { data: overview, count} = state().orders.ordersOverview
        let newState =  overview.map((v : OrderType) =>{
            let x  = v
            data.map((d :OrderType )=>{
                if(v.id === d.id){
                   x = {...v,...d}
                } 
             })
            return x
        })
        if(status === 200){
            dispatch(addOverviewOrders({data:newState, count}))
            dispatch(updateToast({status, type: 'update', message}))
        } else dispatch(updateToast({status: status, message:message, type: DialogResponseTypes.ERROR}))
    } catch (error) {
        if(error instanceof Error) {

            dispatch(updateToast({status: 403, message:error.message, type: DialogResponseTypes.ERROR}))
        }
    }
}

export default orders.reducer
export const { addPendingOrders, errorMessage, addOverviewOrders,addStatues } = orders.actions
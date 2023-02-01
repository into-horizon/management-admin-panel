import { createSlice } from "@reduxjs/toolkit";
import DiscountCode from "src/services/DiscountCode";
import { updateToast } from "./globalToasts";

const discountCode = createSlice({
    name: 'discountCode',
    initialState:{data: [], count: 0},
    reducers:{
        addData(state, {payload}){
            return {...state, ...payload}
        }
    }
})

export const getDiscountCodesHandler = payload => async dispatch =>{
    try {
        let {status, message, data} = await DiscountCode.getDiscountCodes(payload)
        if(status === 200) {
            dispatch(addData(data))
        } else console.error(message);
    } catch (error) {
        console.error(error);
    }
}

export const updateDiscountCodeHandler = payload => async (dispatch,state) =>{
    try {
        let {status, data, message} = await DiscountCode.updateDiscountCode(payload)
        if  (status === 200){
            dispatch( updateToast({ status: status, message: message, type: "update" }))
            let {data: discountData,count} = state().discountCode
            let newState = discountData.map(discount =>{
                if(data.id === discount.id){
                    return {...discount, ...data}
                } else return discount
            })
            dispatch(addData({data:newState, count: count}))
        }
    } catch (error) {
        dispatch(
            updateToast({ status: 403, message: error.message, type: "error" })
          );
    }
}

export const createDiscountCode = payload =>  async (dispatch) =>{
    try {
        let {status, message, data} = await DiscountCode.createDiscountCode(payload);
        if(status ===200){
            dispatch(
                updateToast({ status: status, message: message, type: "create" })
              );
        }
    } catch (error) {
        dispatch(
            updateToast({ status: 403, message: error.message, type: "error" })
          );
    }
}

export default discountCode.reducer
export const {addData   } = discountCode.actions
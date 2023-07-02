import { createSlice } from "@reduxjs/toolkit";
import DiscountCode from "src/services/DiscountCode";
import { updateToast } from "./globalToasts";
import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";


const initialState : DiscountCodeStateType = {
    data: [],
    count: 0
}
const discountCode = createSlice({
    name: 'discountCode',
    initialState: initialState,
    reducers: {
        addData(state, { payload }) {
            return { ...state, ...payload }
        }
    }
})

export const getDiscountCodesHandler = (payload : ParamsType) => async (dispatch: AppDispatch) => {
    try {
        let { status, message, data } = await DiscountCode.getDiscountCodes(payload)
        if (status === 200) {
            dispatch(addData(data))
        } else console.error(message);
    } catch (error) {
        if(error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}

export const updateDiscountCodeHandler = (payload: DiscountCodeType) => async (dispatch : AppDispatch, state: () => RootState) => {
    try {
        let { status, data, message } = await DiscountCode.updateDiscountCode(payload)
        if (status === 200) {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
            let { data: discountData, count } = state().discountCode
            let newState = discountData.map((discount : DiscountCodeType) => {
                if (data.id === discount.id) {
                    return { ...discount, ...data }
                } else return discount
            })
            dispatch(addData({ data: newState, count: count }))
        }
    } catch (error) {
        if(error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}

export const createDiscountCode = (payload : DiscountCodeType) => async (dispatch : AppDispatch) => {
    try {
        let { status, message, data } = await DiscountCode.createDiscountCode(payload);
        if (status === 200) {
            dispatch(
                updateToast({ status: status, message: message, type: DialogResponseTypes.CREATE })
            );
        }
    } catch (error) {
        if(error instanceof Error) {

            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}

export default discountCode.reducer
export const { addData } = discountCode.actions
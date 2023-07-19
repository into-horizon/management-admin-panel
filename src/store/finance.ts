import { createSlice } from "@reduxjs/toolkit";

import Finance from "../services/Finance";
import { updateToast } from "./globalToasts";
import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";
import { ParamsType } from "src/types";

const finance = createSlice({
    name: 'finance',
    initialState: { transactions: { data: [], count: 0 }, message: '', pending: 0, refunded: 0, released: 0, transferred: 0, withdrawn: 0, canceledWithdrawn: 0, commission: 0, delivery: 0 },
    reducers: {
        addData(state, action) {
            return { ...state, ...action.payload }
        },
        errorMessage(state, action) {
            return { ...state, message: action.payload }
        },
        updateWithdrawn(state, action) {
            return { ...state, withdrawn: state.withdrawn + action.payload }
        }
    }
})


export const getAmounts = () => async (dispatch: AppDispatch) => {
    try {
        let { status, data, message } = await Finance.getAmounts()
        const getData = (data: { type: string, description: string, status: string, sum: number }[], type: string, description: string, status: string) => {
            return data.find(val => val.type === type && val.description === description && val.status === status)?.sum.toFixed(2) ?? 0
        }
        if (status === 200) {
            dispatch(addData({ commission: getData(data, 'credit', 'commission', 'released'), delivery: getData(data, 'credit', 'delivery', 'released'), transferred: getData(data, 'debit', 'withdrawal', 'transferred') }))
        }
    } catch (error) {
        if(error instanceof Error) {
            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const getTransactions = (payload:  ParamsType) => async (dispatch : AppDispatch, state : ()=> RootState) => {
    try {
        let { status, data, message, count } = await Finance.getTransactions(payload)
        if (status === 200) {
            dispatch(addData({ transactions: data }))
        } else dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
    } catch (error) {
        if(error instanceof Error) {
            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const getPendingAmounts = () => async (dispatch : AppDispatch) => {
    try {
        let { status: s1, amount: pending } = await Finance.pendingAmounts()
        let { status: s2, amount: released } = await Finance.releasedAmounts()
        let { status: s3, amount: refunded } = await Finance.refundedAmounts()
        let { status: s4, amount: canceled } = await Finance.canceledWithdrawnAmount()
        let { status: s5, amount: transferred } = await Finance.transferredAmount()
        let { status: s6, amount: withdrawn } = await Finance.withdrawnAmount()
        if (s1 === 200 && s2 === 200 && s3 === 200 && s4 === 200 && s5 === 200 && s6 === 200) {
            dispatch(addData({ pending: pending, released: released, refunded: refunded, transferred: transferred, canceledWithdrawn: canceled, withdrawn: withdrawn }))
        }
    } catch (error) {
        if(error instanceof Error) {
            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const { addData, errorMessage, updateWithdrawn } = finance.actions

export default finance.reducer
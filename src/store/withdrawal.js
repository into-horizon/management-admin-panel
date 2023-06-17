import { createSlice } from "@reduxjs/toolkit";
import Withdrawal from "../services/Withdrawal";
import { updateWithdrawn } from './finance'
import { updateToast } from "./globalToasts";


const withdrawal = createSlice({
    name: "withdrawal",
    initialState: {  count: 0, data: []  },
    reducers: {
        addWithdrawals(state, action) {
            return { ...state, ...action.payload }
        },
        addMsg(state, action) {
            return { ...state, msg: action.payload }
        }
    }
})

export const getWithdrawalsHandler = payload => async (dispatch) => {
    try {
        let { data, message, status } = await Withdrawal.getWithdrawals(payload)
        if (status === 200) {
            dispatch(addWithdrawals(data))
        } else {
            dispatch(addMsg(message))
        }
    } catch (error) {
        dispatch(addMsg(error));
    }
}

export const addWithdrawalHandler = payload => async (dispatch) => {
    try {
        let { status, message } = await Withdrawal.addWithdrawal(payload)
        if (status === 200) {
            dispatch(getWithdrawalsHandler())
            dispatch(updateWithdrawn(Number(payload.amount)))
        } else {
            dispatch(addMsg(message));
        }
    } catch (error) {
        dispatch(addMsg(error));
    }
}

export const updateWithdrawalHandler = payload => async (dispatch, state) => {
    try {
        let { data, message, status } = await Withdrawal.updateWithdrawal(payload)
        let { withdrawals: { data: withdrawals, count } } = state()
        const newWithdrawals = withdrawals.map(w => {
            if (data.id === w.id) {
                return { ...w, ...data }
            }
            return w
        })
        dispatch(addWithdrawals({ data: newWithdrawals, count } ))
        dispatch(updateToast({status, message, type: 'update'}))
    } catch (error) {
        dispatch(updateToast({ type: 'error', message: error.message, status: 403 }))
    }
}

export default withdrawal.reducer
export const { addWithdrawals, addMsg } = withdrawal.actions
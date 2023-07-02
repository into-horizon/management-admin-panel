import { createSlice } from "@reduxjs/toolkit";
import Withdrawal from "../services/Withdrawal";
import { updateWithdrawn } from './finance'
import { updateToast } from "./globalToasts";
import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";


const withdrawal = createSlice({
    name: "withdrawal",
    initialState: { count: 0, data: [] },
    reducers: {
        addWithdrawals(state, action) {
            return { ...state, ...action.payload }
        },
        addMsg(state, action) {
            return { ...state, msg: action.payload }
        }
    }
})

export const getWithdrawalsHandler = (payload: ParamsType) => async (dispatch: AppDispatch) => {
    try {
        let { data, message, status } = await Withdrawal.getWithdrawals(payload)
        if (status === 200) {
            dispatch(addWithdrawals(data))
        } else {
            dispatch(addMsg(message))
        }
    } catch (error) {
        if (error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}

export const addWithdrawalHandler = (payload: WithdrawalType) => async (dispatch: AppDispatch) => {
    try {
        let { status, message } = await Withdrawal.addWithdrawal(payload)
        if (status === 200) {
            dispatch(updateWithdrawn(Number(payload.amount)))
        } else {
            dispatch(addMsg(message));
        }
    } catch (error) {
        if (error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}

export const updateWithdrawalHandler = (payload: WithdrawalType | FormData) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { data, message, status } = await Withdrawal.updateWithdrawal(payload)
        let { withdrawals: { data: withdrawals, count } } = state()
        const newWithdrawals = withdrawals.map((w: WithdrawalType) => {
            if (data.id === w.id) {
                return { ...w, ...data }
            }
            return w
        })
        dispatch(addWithdrawals({ data: newWithdrawals, count }))
        dispatch(updateToast({ status, message, type: DialogResponseTypes.UPDATE }))
    } catch (error) {
        if (error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );

        }
    }
}

export default withdrawal.reducer
export const { addWithdrawals, addMsg } = withdrawal.actions
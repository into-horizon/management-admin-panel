import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import Withdrawal from '../services/Withdrawal'
import { updateWithdrawn } from './finance'
import { updateToast } from './globalToasts'
import { AppDispatch, RootState } from '.'
import { DialogResponseTypes } from 'src/enums'
import { ParamsType, WithdrawalType } from 'src/types'

const initialState: {
  loading: boolean
  count: number
  data: WithdrawalType[]
  params: ParamsType
} = {
  loading: false,
  count: 0,
  data: [],
  params: {
    limit: 5,
    offset: 0,
  },
}
const withdrawal = createSlice({
  name: 'withdrawal',
  initialState,
  reducers: {
    addWithdrawals(state, action) {
      return { ...state, ...action.payload }
    },
    addMsg(state, action) {
      return { ...state, msg: action.payload }
    },
    setWithdrawalsParams(state, action: PayloadAction<ParamsType>) {
      state.params = { ...state, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getWithdrawalsHandler.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      getWithdrawalsHandler.fulfilled,
      (state, action: PayloadAction<{ data: WithdrawalType[]; count: number }>) => {
        state.loading = false
        state.data = action.payload.data
        state.count = action.payload.count
      },
    )
    builder.addCase(getWithdrawalsHandler.rejected, (state) => {
      state.loading = false
    })
  },
})

export const getWithdrawalsHandler = createAsyncThunk<
  { data: WithdrawalType[]; count: number },
  void
>('withdrawals/fetch', async (_, { dispatch, getState }) => {
  try {
    const { params } = (getState() as RootState).withdrawals
    const { data, message, status } = await Withdrawal.getWithdrawals(params)
    if (status === 200) {
      dispatch(addWithdrawals(data))
      return data
    } else {
      dispatch(updateToast({ status: 403, message: message, type: DialogResponseTypes.ERROR }))
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
      )
    }
  }
})

export const addWithdrawalHandler = (payload: WithdrawalType) => async (dispatch: AppDispatch) => {
  try {
    let { status, message } = await Withdrawal.addWithdrawal(payload)
    if (status === 200) {
      dispatch(updateWithdrawn(Number(payload.amount)))
    } else {
      dispatch(addMsg(message))
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
      )
    }
  }
}

export const updateWithdrawalHandler = createAsyncThunk<void, WithdrawalType | FormData>(
  'withdrawals/update',
  async (payload, { dispatch }) => {
    try {
      let { message, status } = await Withdrawal.updateWithdrawal(payload)
      dispatch(getWithdrawalsHandler())
      dispatch(updateToast({ status, message, type: DialogResponseTypes.UPDATE }))
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
      }
    }
  },
)

export default withdrawal.reducer
export const { addWithdrawals, addMsg, setWithdrawalsParams } = withdrawal.actions

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import Finance from '../services/Finance'
import { updateToast } from './globalToasts'
import { DialogResponseTypes } from 'src/enums'
import { ParamsType, TransactionType } from 'src/types'
import { RootState } from '.'

const initialState: {
  loading: boolean
  transactions: { data: TransactionType[]; count: number }
  transactionsParams: ParamsType
  message: string
  pending: number
  refunded: number
  released: number
  transferred: number
  withdrawn: number
  canceledWithdrawn: number
  commission: number
  delivery: number
} = {
  transactions: { data: [], count: 0 },
  transactionsParams: { limit: 20, offset: 0 },
  message: '',
  pending: 0,
  refunded: 0,
  released: 0,
  transferred: 0,
  withdrawn: 0,
  canceledWithdrawn: 0,
  commission: 0,
  delivery: 0,
  loading: false,
}
const finance = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload }
    },
    errorMessage(state, action) {
      state.message = action.payload
    },
    updateWithdrawn(state, action) {
      return { ...state, withdrawn: state.withdrawn + action.payload }
    },
    setTransactionParams(state, action: PayloadAction<ParamsType>) {
      state.transactionsParams = { ...state.transactionsParams, ...action.payload }
    },
    resetTransactionParams(state) {
      state.transactionsParams = { limit: 20, offset: 0 }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAmounts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getAmounts.fulfilled, (state, action) => {
      state.loading = false
      // state.pending = action.payload.pending
    })
    builder.addCase(getAmounts.rejected, (state, action) => {
      state.loading = false
      // state.message = action.error.message
    })
    builder.addCase(getTransactions.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getTransactions.fulfilled, (state, action) => {
      state.loading = false
      // state.transactions = action.payload
    })
    builder.addCase(getTransactions.rejected, (state, action) => {
      state.loading = false
      // state.message = action.error.message
    })
  },
})

export const getAmounts = createAsyncThunk('finance/getAmounts', async (_, { dispatch }) => {
  try {
    let { status, data, message } = await Finance.getAmounts()
    const getData = (
      data: { type: string; source: string; status: string; sum: number }[],
      type: string,
      description: string,
      status: string,
    ) => {
      return data.reduce((acc, current) => {
        if (current.type === type && current.status === status && current.source === description) {
          return acc + current.sum
        } else return acc
      }, 0)
    }
    if (status === 200) {
      dispatch(
        addData({
          commission: getData(data, 'credit', 'commission', 'released'),
          delivery: getData(data, 'credit', 'delivery', 'released'),
          transferred: getData(data, 'debit', 'withdrawal', 'released'),
        }),
      )
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
      )
    }
  }
})

// export const getTransactions =
//   (payload: ParamsType) => async (dispatch: AppDispatch, state: () => RootState) => {
//   }

export const getTransactions = createAsyncThunk<void, void>(
  'finance/transactions',
  async (_, { dispatch, getState }) => {
    try {
      const { transactionsParams } = (getState() as RootState).finance
      let { status, data, message, count } = await Finance.getTransactions(transactionsParams)
      if (status === 200) {
        dispatch(addData({ transactions: data }))
      } else
        dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
      }
    }
  },
)

export const {
  addData,
  errorMessage,
  updateWithdrawn,
  setTransactionParams,
  resetTransactionParams,
} = finance.actions

export default finance.reducer

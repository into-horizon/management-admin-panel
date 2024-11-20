import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import Orders from '../services/Orders'
import { updateToast } from './globalToasts'
import { AppDispatch, RootState } from '.'
import { DialogResponseTypes } from 'src/enums'
import { ParamsType, OrderItemType, OrderType } from 'src/types'

const initialState: {
  pendingOrders: { data: OrderType[]; count: number }
  ordersOverview: { data: OrderType[]; count: number }
  overviewParams: ParamsType
  pendingParams: ParamsType
  isLoading: boolean
  messages: string
  statuses: string[]
  isUpdating: boolean
} = {
  pendingOrders: { data: [], count: 0 },
  ordersOverview: { data: [], count: 0 },
  overviewParams: { limit: 5, offset: 0 },
  pendingParams: { limit: 5, offset: 0 },
  isLoading: false,
  messages: '',
  statuses: [],
  isUpdating: false,
}
const orders = createSlice({
  name: 'orders',
  initialState,
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
    },
    setOverviewParams(state, action: PayloadAction<ParamsType>) {
      state.overviewParams = { ...state.overviewParams, ...action.payload }
    },
    setPendingParams(state, action: PayloadAction<ParamsType>) {
      state.pendingParams = { ...state.pendingParams, ...action.payload }
    },
  },
  extraReducers(builder) {
    builder.addCase(getPendingOrdersHandler.fulfilled, (state, action) => {
      state.pendingOrders = action.payload
      state.isLoading = false
    })
    builder.addCase(getPendingOrdersHandler.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getPendingOrdersHandler.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(getOverviewOrdersHandler.fulfilled, (state, action) => {
      state.ordersOverview = action.payload
      state.isLoading = false
    })
    builder.addCase(getOverviewOrdersHandler.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(getOverviewOrdersHandler.rejected, (state) => {
      state.isLoading = false
    })
    builder.addCase(updateOrderItemHandler.fulfilled, (state) => {
      state.isUpdating = false
    })
    builder.addCase(updateOrderItemHandler.pending, (state) => {
      state.isUpdating = true
    })
    builder.addCase(updateOrderItemHandler.rejected, (state) => {
      state.isUpdating = false
    })
  },
})

export const getPendingOrdersHandler = createAsyncThunk<{ data: OrderType[]; count: number }, void>(
  'orders/pending',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const { pendingParams } = (getState() as RootState).orders
      let { status, data, message } = await Orders.getStorePendingOrders(pendingParams)
      if (status === 200) {
        dispatch(addPendingOrders(data))
        return data
      } else {
        dispatch(updateToast({ status, message, type: DialogResponseTypes.ERROR }))
        return rejectWithValue(message)
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
        return rejectWithValue(error.message)
      }
    }
  },
)

export const getOverviewOrdersHandler = createAsyncThunk<
  { data: OrderType[]; count: number },
  void
>('order/overview', async (_, { dispatch, rejectWithValue, getState }) => {
  try {
    const { overviewParams } = (getState() as RootState).orders

    let { status, data, message } = await Orders.getStoreNotPendingOrders(overviewParams)
    if (status === 200) {
      dispatch(addOverviewOrders(data))
      return data
    } else {
      dispatch(updateToast({ status, message, type: DialogResponseTypes.ERROR }))
      return rejectWithValue(message)
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
      )
      return rejectWithValue(error.message)
    }
  }
})

export const updateOrderItemHandler = createAsyncThunk<void, OrderItemType>(
  'orders/update',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { status, message } = await Orders.updateOrderItem(payload)
      if (status === 200) {
        // dispatch(getOverviewOrdersHandler())
        dispatch(getPendingOrdersHandler())
        dispatch(updateToast({ status, message, type: DialogResponseTypes.SUCCESS }))
      } else {
        dispatch(updateToast({ status, message, type: DialogResponseTypes.ERROR }))
        return rejectWithValue(message)
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
        return rejectWithValue(error.message)
      }
    }
  },
)

export const getStatuesHandler = () => async (dispatch: AppDispatch) => {
  try {
    let { data, status } = await Orders.getStatues()
    if (status === 200) {
      dispatch(addStatues(data))
    }
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
      )
    }
  }
}

export const bulkStatusUpdate = createAsyncThunk<void, { status: string; id: string }>(
  'orders/bulkUpdate',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { status, message } = await Orders.bulkStatusUpdate(payload)
      if (status === 200) {
        dispatch(getOverviewOrdersHandler())
        dispatch(updateToast({ status, type: 'update', message }))
      } else {
        dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        return rejectWithValue(message)
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
      }
    }
  },
)

export default orders.reducer
export const {
  addPendingOrders,
  errorMessage,
  addOverviewOrders,
  addStatues,
  setPendingParams,
  setOverviewParams,
} = orders.actions

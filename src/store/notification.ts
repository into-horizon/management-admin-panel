import { createSlice, AsyncThunkAction, createAsyncThunk } from '@reduxjs/toolkit'
import Notification from '../services/Notification'
import { NotificationType, ParamsType } from '../types'
import { updateToast } from './globalToasts'
import { DialogResponseTypes } from '../enums'
import { RootState } from '.'

export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (payload: ParamsType, { dispatch, rejectWithValue }) => {
    try {
      const { data, count, types } = await Notification.getNotifications(payload)
      return { data, count, types }
    } catch (error) {
      if (error instanceof Error) {
        rejectWithValue(error.message)
        dispatch(
          updateToast({
            message: error.message,
            type: DialogResponseTypes.ERROR,
          }),
        )
      }
    }
  },
)
export const updateNotificationsAsSeen = createAsyncThunk(
  'notifications/updateAsSeen',
  async (_, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState
      const { count } = await Notification.updateNotificationsAsSeen({
        id: state.notifications.data.map((notification: NotificationType) => notification.id),
      })
      return count
    } catch (error) {
      if (error instanceof Error) {
        rejectWithValue(error.message)
        dispatch(
          updateToast({
            message: error.message,
            type: DialogResponseTypes.ERROR,
          }),
        )
      }
    }
  },
)
const initialState: {
  data: NotificationType[]
  count: number
  loading: boolean
  types: {
    ORDER: 'order'
    ORDER_ITEM: 'order-item'
    PRODUCT: 'product'
    STORE: 'store'
    OVERALL_PENDING_ORDERS: 'pending-orders'
    OVERALL_PENDING_PRODUCTS: 'pending-products'
  }
} = {
  data: [],
  count: 0,
  loading: false,
  types: {
    ORDER: 'order',
    ORDER_ITEM: 'order-item',
    PRODUCT: 'product',
    STORE: 'store',
    OVERALL_PENDING_ORDERS: 'pending-orders',
    OVERALL_PENDING_PRODUCTS: 'pending-products',
  },
}

const notification = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getNotifications.fulfilled, (state, action) => {
      state.data = action.payload?.data ? action.payload?.data.concat(state.data) : action.payload
      state.count = action.payload?.count
      state.types = action.payload?.types
      state.loading = false
    })
    builder.addCase(getNotifications.pending, (state, action) => {
      state.loading = true
    })
    builder.addCase(getNotifications.rejected, (state, action) => {
      state.loading = false
    })
    builder.addCase(updateNotificationsAsSeen.fulfilled, (state, action) => {
      state.count = action.payload
    })
  },
})

export default notification.reducer

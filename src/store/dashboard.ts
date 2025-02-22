import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { DashboardStateType } from '../types'
import { AppDispatch } from '.'
import Dashboard from '../services/Dashboard'
import { updateToast } from './globalToasts'
import { DialogResponseTypes } from '../enums'

const initialState: DashboardStateType = {
  stores: 0,
  products: 0,
  itemsSold: 0,
  orderPlaced: 0,
  users: 0,
  ratedStores: [],
  isDashboardLoading: false,
}

const dashboard = createSlice({
  name: 'dashboard',
  initialState: initialState,
  reducers: {
    setData(state, action) {
      return { ...state, ...action.payload }
    },
  },
  extraReducers(builder) {
    builder.addCase(getDashboardData.fulfilled, (state) => {
      state.isDashboardLoading = false
    })
    builder.addCase(getDashboardData.pending, (state) => {
      state.isDashboardLoading = true
    })
    builder.addCase(getDashboardData.rejected, (state) => {
      state.isDashboardLoading = false
    })
  },
})

export const getDashboardData = createAsyncThunk(
  'dashboard/getStats',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      //TODO call api to fetch data
      const { usersCount, ordersCount, storesCount, productsCount, soldItemsCount } =
        await Dashboard.dashboardStatistics()
      const { ratedStores } = await Dashboard.storesCount()

      dispatch(
        setData({
          stores: storesCount,
          products: productsCount,
          orderPlaced: ordersCount,
          users: usersCount,
          itemsSold: soldItemsCount,
          ratedStores,
        }),
      )
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            message: error.message,
            type: DialogResponseTypes.ERROR,
          }),
        )
        return rejectWithValue(error.message)
      }
    }
  },
)

export default dashboard.reducer

export const { setData } = dashboard.actions

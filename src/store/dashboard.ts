import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { DashboardStateType } from "src/types";
import { AppDispatch } from ".";
import Dashboard from "src/services/Dashboard";
import { updateToast } from "./globalToasts";
import { DialogResponseTypes } from "src/enums";

const initialState: DashboardStateType = {
  stores: 0,
  products: 0,
  itemsSold: 0,
  orderPlaced: 0,
  users: 0,
  ratedStores: [],
  isDashboardLoading: false,
};

const dashboard = createSlice({
  name: "dashboard",
  initialState: initialState,
  reducers: {
    setData(state, action) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers(builder) {
    builder.addCase(getDashboardData.fulfilled, (state) => {
      state.isDashboardLoading = false;
    });
    builder.addCase(getDashboardData.pending, (state) => {
      state.isDashboardLoading = true;
    });
    builder.addCase(getDashboardData.rejected, (state) => {
      state.isDashboardLoading = false;
    });
  },
});

export const getDashboardData = createAsyncThunk(
  "dashboard/getStats",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      //TODO call api to fetch data
      const {
        count: stores,
        status: status1,
        message: message1,
        ratedStores,
      } = await Dashboard.storesCount();
      const {
        count: products,
        status: status2,
        message: message2,
      } = await Dashboard.productsCount();
      const {
        orderCount: orderPlaced,
        itemsSoldCount: itemsSold,
        status: status3,
        message: message3,
      } = await Dashboard.ordersCount();
      const {
        count: users,
        status: status4,
        message: message4,
      } = await Dashboard.usersCount();

      if ([status1, status2, status3, status4].every((s) => s === 200)) {
        dispatch(
          setData({
            stores,
            products,
            orderPlaced,
            users,
            itemsSold,
            ratedStores,
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message)
      }
    }
  }
);

export default dashboard.reducer;

export const { setData } = dashboard.actions;

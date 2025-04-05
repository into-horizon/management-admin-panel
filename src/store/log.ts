import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RootState } from '.'
import LogService from '../services/Log'
import { updateToast } from './globalToasts'
import { ListResponse, ParamsType, RequestLog } from '../types'

const initialState: ListResponse<RequestLog> & { loading: boolean; params: ParamsType } = {
  data: [],
  count: 0,
  loading: false,
  params: { offset: 0, limit: 10 },
}
const logSlice = createSlice({
  name: 'log',
  initialState,
  reducers: {
    updateParams(state, action) {
      state.params = { ...state.params, ...action.payload }
    },
    resetParams(state) {
      state.params = initialState.params
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLogs.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getLogs.fulfilled, (state, action) => {
      state.data = action.payload.data
      state.count = action.payload.count
      state.loading = false
    })
    builder.addCase(getLogs.rejected, (state) => {
      state.loading = false
    })
  },
})

export const getLogs = createAsyncThunk<ListResponse<RequestLog>, void>(
  'log/getLogs',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { params } = (getState() as RootState).log
      const res = await LogService.getLogs(params)
      return res
    } catch (error) {
      dispatch(updateToast({ message: 'Error fetching logs', type: 'error' }))
      return rejectWithValue((error as Error).message)
    }
  },
)

export const { updateParams, resetParams } = logSlice.actions
export default logSlice.reducer

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConfigurationType, ParamsType } from '../types'
import { RootState } from '.'
import configurationTypesService from '../services/ConfigurationTypes.service'
import { updateToast } from './globalToasts'
import { DialogResponseTypes } from '../enums'
import { Params } from 'react-router-dom'
import { resetParams } from './user'

const initialState: {
  data: ConfigurationType[]
  count: number
  loading: boolean
  limit: number
  offset: number
  typeId?: string
  displayName?: string
} = {
  data: [],
  count: 0,
  loading: false,
  limit: 10,
  offset: 0,
}

const configurationTypesSlice = createSlice({
  name: 'configurationTypes',
  initialState,
  reducers: {
    setParams(state, action: PayloadAction<Partial<ParamsType>>) {
      return { ...state, ...action.payload }
    },
    resetParams(state) {
      state.limit = 10
      state.offset = 0
      state.typeId = undefined
      state.displayName = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConfigurationTypesState.pending, (state) => {
        state.loading = true
      })
      .addCase(getConfigurationTypesState.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.count = action.payload.count
      })
      .addCase(getConfigurationTypesState.rejected, (state) => {
        state.loading = false
      })
  },
})

export const getConfigurationTypesState = createAsyncThunk(
  'configurationTypes/getConfigurationTypesState',
  async (_, thunkAPI) => {
    const { limit, offset, displayName, typeId } = (
      thunkAPI.getState() as RootState
    ).configureTypes
    try {
      const response = await configurationTypesService.getConfigurationTypes({
        limit,
        offset,
        displayName,
        typeId,
      })
      return response
    } catch (error) {
      thunkAPI.dispatch(
        updateToast({
          message: 'Failed to fetch configuration types',
          type: DialogResponseTypes.ERROR,
        })
      )
      return thunkAPI.rejectWithValue('Failed to fetch configuration types')
    }
  }
)

export const {
  setParams: setConfigurationParamsTypes,
  resetParams: resetConfigurationTypesParams,
} = configurationTypesSlice.actions
export default configurationTypesSlice.reducer

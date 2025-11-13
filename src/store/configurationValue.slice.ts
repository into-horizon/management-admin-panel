import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import ConfigurationValueService from '../services/ConfigurationValue.service'
import {
  ConfigurationValueType,
  ListResponse,
  ParamsType,
  PostConfigurationType,
} from '../types'
import { RootState } from '.'
import { updateToast } from './globalToasts'
import { DialogResponseTypes } from '../enums'

const initialState: {
  data: ConfigurationValueType[]
  count: number
  params: ParamsType
  loading: boolean
} = {
  data: [],
  count: 0,
  params: { limit: 10, offset: 0 },
  loading: false,
}

const configurationValueSlice = createSlice({
  name: 'configurationValue',
  initialState,
  reducers: {
    setParams: (state, action: PayloadAction<ParamsType>) => {
      state.params = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getConfigurationValues.pending, (state) => {
        state.loading = true
      })
      .addCase(getConfigurationValues.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload.data
        state.count = action.payload.count
      })
      .addCase(getConfigurationValues.rejected, (state) => {
        state.loading = false
      })
  },
})

export const getConfigurationValues = createAsyncThunk<
  ListResponse<ConfigurationValueType>,
  void
>(
  'configurationValue/getConfigurationValues',
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const { params } = (getState() as RootState).configurationValue
      const res = await ConfigurationValueService.getConfigurationValues(params)
      dispatch(configurationValueSlice.actions.setParams(params))
      return res
    } catch (error) {
      dispatch(configurationValueSlice.actions.setLoading(false))
      return rejectWithValue((error as Error).message)
    }
  }
)

export const createConfigurationValue = createAsyncThunk<
  void,
  PostConfigurationType
>(
  'configurationValue/createConfigurationValue',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const { message } =
        await ConfigurationValueService.createConfigurationValue(payload)
      dispatch(getConfigurationValues())
      dispatch(
        updateToast({
          type: DialogResponseTypes.SUCCESS,
          message,
        })
      )
    } catch (error) {
      dispatch(
        updateToast({
          type: DialogResponseTypes.ERROR,
          message: (error as Error).message,
        })
      )
      dispatch(configurationValueSlice.actions.setLoading(false))
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateConfigurationValue = createAsyncThunk<
  void,
  { id: string; data: ConfigurationValueType }
>(
  'configurationValue/updateConfigurationValue',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const { message } =
        await ConfigurationValueService.updateConfigurationValue(
          payload.id,
          payload.data
        )
      dispatch(getConfigurationValues())
      dispatch(
        updateToast({
          type: DialogResponseTypes.SUCCESS,
          message,
        })
      )
    } catch (error) {
      dispatch(
        updateToast({
          type: DialogResponseTypes.ERROR,
          message: (error as Error).message,
        })
      )

      return rejectWithValue((error as Error).message)
    }
  }
)

export const deleteConfigurationValue = createAsyncThunk<void, string>(
  'configurationValue/deleteConfigurationValue',
  async (payload, { dispatch, getState, rejectWithValue }) => {
    try {
      const { message } =
        await ConfigurationValueService.deleteConfigurationValue(payload)
      dispatch(getConfigurationValues())
      return message
    } catch (error) {
      dispatch(
        updateToast({
          type: DialogResponseTypes.ERROR,
          message: (error as Error).message,
        })
      )
      return rejectWithValue((error as Error).message)
    }
  }
)

export const { setParams, setLoading } = configurationValueSlice.actions
export default configurationValueSlice.reducer

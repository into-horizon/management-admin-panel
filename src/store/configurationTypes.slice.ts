import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ConfigurationType, ParamsType, PostConfigurationType } from '../types'
import { RootState } from '.'
import configurationTypesService from '../services/ConfigurationTypes.service'
import { updateToast } from './globalToasts'
import { DialogResponseTypes } from '../enums'
import { updateParamsHelper } from '../services/helpers'

const initialState: {
  data: ConfigurationType[]
  count: number
  loading: boolean
  isModalVisible: boolean
  params: ParamsType & {
    id?: string
    displayName?: string
  }
} = {
  data: [],
  count: 0,
  loading: false,
  isModalVisible: false,
  params: {
    limit: 10,
    offset: 0,
  },
}

const configurationTypesSlice = createSlice({
  name: 'configurationTypes',
  initialState,
  reducers: {
    setParams(
      state,
      action: PayloadAction<
        Partial<{ page: number; displayName: string; typeId: string }>
      >
    ) {
      state.params = updateParamsHelper(
        { ...state.params, ...action.payload },
        action.payload.page || 1
      )
    },
    resetParams(state) {
      state.params = initialState.params
    },
    setIsModalVisible(state, action: PayloadAction<boolean>) {
      state.isModalVisible = action.payload
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
      .addCase(createConfigurationType.fulfilled, (state) => {
        state.isModalVisible = false
        state.loading = false
      })
      .addCase(createConfigurationType.pending, (state) => {
        state.loading = true
      })
      .addCase(createConfigurationType.rejected, (state) => {
        state.loading = false
      })
      .addCase(updateConfigurationType.pending, (state) => {
        state.loading = true
      })
      .addCase(updateConfigurationType.rejected, (state) => {
        state.loading = false
      })
      .addCase(deleteConfigurationType.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteConfigurationType.rejected, (state) => {
        state.loading = false
      })
  },
})

export const getConfigurationTypesState = createAsyncThunk(
  'configurationTypes/getConfigurationTypesState',
  async (_, thunkAPI) => {
    const { limit, offset, displayName, id, name } = (
      thunkAPI.getState() as RootState
    ).configureTypes.params
    try {
      const response = await configurationTypesService.getConfigurationTypes({
        limit,
        offset,
        displayName,
        id,
        name,
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

export const createConfigurationType = createAsyncThunk<
  void,
  PostConfigurationType
>('configurationTypes/createConfigurationType', async (payload, thunkAPI) => {
  try {
    const { message } = await configurationTypesService.createConfigurationType(
      payload
    )
    thunkAPI.dispatch(
      updateToast({ type: DialogResponseTypes.SUCCESS, message })
    )
    thunkAPI.dispatch(getConfigurationTypesState())
  } catch (error) {
    thunkAPI.dispatch(
      updateToast({
        message: 'Failed to create configuration type',
        type: DialogResponseTypes.ERROR,
      })
    )
  }
})

export const updateConfigurationType = createAsyncThunk<
  void,
  ConfigurationType
>('configurationTypes/updateConfigurationType', async (payload, thunkAPI) => {
  try {
    const { message } = await configurationTypesService.updateConfigurationType(
      payload.id!,
      payload
    )
    thunkAPI.dispatch(
      updateToast({ type: DialogResponseTypes.SUCCESS, message })
    )
    thunkAPI.dispatch(getConfigurationTypesState())
  } catch (error) {
    thunkAPI.dispatch(
      updateToast({
        message: 'Failed to update configuration type',
        type: DialogResponseTypes.ERROR,
      })
    )
  }
})

export const deleteConfigurationType = createAsyncThunk<void, string>(
  'configurationTypes/deleteConfigurationType',
  async (payload, thunkAPI) => {
    try {
      const { message } =
        await configurationTypesService.deleteConfigurationType(payload)
      thunkAPI.dispatch(
        updateToast({ type: DialogResponseTypes.SUCCESS, message })
      )
      thunkAPI.dispatch(getConfigurationTypesState())
    } catch (error) {
      thunkAPI.dispatch(
        updateToast({
          message: 'Failed to delete configuration type',
          type: DialogResponseTypes.ERROR,
        })
      )
    }
  }
)

export const {
  setParams: setConfigurationParamsTypes,
  resetParams: resetConfigurationTypesParams,
  setIsModalVisible: setConfigurationTypesModalVisible,
} = configurationTypesSlice.actions
export default configurationTypesSlice.reducer

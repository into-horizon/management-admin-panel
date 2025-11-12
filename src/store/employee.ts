import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { updateToast } from './globalToasts'
import Employee from '../services/Employee'
import { AppDispatch, RootState } from '.'
import { DialogResponseTypes } from '../enums'
import {
  EmployeeStateType,
  ParamsType,
  EmployeeType,
  ListResponse,
} from '../types'

const initialState: EmployeeStateType = {
  data: [],
  count: 0,
  params: { limit: 10, offset: 0 },
  loading: false,
}
const employee = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setData(state, action) {
      return { ...state, ...action.payload }
    },
    setParams(state, action: PayloadAction<ParamsType>) {
      state.params = { ...state.params, ...action.payload }
    },
    resetParams(state) {
      state.params = { limit: 10, offset: 0 }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getEmployees.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getEmployees.fulfilled, (state, action) => {
      state.loading = false
      state.data = action.payload.data
      state.count = action.payload.count
    })
    builder.addCase(getEmployees.rejected, (state) => {
      state.loading = false
    })
  },
})

export const getEmployees = createAsyncThunk<ListResponse<EmployeeType>, void>(
  'employees/getAll',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { params } = (getState() as RootState).employee
      let { data, status } = await Employee.getEmployees(params)
      if (status === 200) {
        return data
      } else {
        dispatch(
          updateToast({
            type: DialogResponseTypes.ERROR,
            message: 'Failed to fetch employees',
            status,
          })
        )
        return rejectWithValue('Failed to fetch employees')
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: (error as Error).message,
            type: DialogResponseTypes.ERROR,
          })
        )
      }
      return rejectWithValue((error as Error).message)
    }
  }
)

export const updateEmployee = createAsyncThunk<void, EmployeeType>(
  'employees/update',
  async (payload, { dispatch }) => {
    try {
      let { status, message } = await Employee.updateEmployee(payload)
      if (status === 200) {
        dispatch(getEmployees())
        dispatch(
          updateToast({ status, type: DialogResponseTypes.SUCCESS, message })
        )
      } else
        dispatch(
          updateToast({
            type: DialogResponseTypes.ERROR,
            message: message,
            status,
          })
        )
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        )
      }
    }
  }
)

export const addEmployee = createAsyncThunk<
  void,
  Omit<EmployeeType, 'verified'>
>('employee/add', async (payload, { dispatch, getState }) => {
  try {
    const { status, message, data } = await Employee.addEmployee(payload)
    if (status === 200) {
      dispatch(updateToast({ type: DialogResponseTypes.SUCCESS, message }))
      dispatch(getEmployees())
    } else dispatch(updateToast({ type: DialogResponseTypes.ERROR, message }))
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        updateToast({
          status: 403,
          message: error.message,
          type: DialogResponseTypes.ERROR,
        })
      )
    }
  }
})

export const deleteEmployee = createAsyncThunk<void, string>(
  'employees/delete',
  async (payload, { dispatch }) => {
    try {
      const { status, message } = await Employee.deleteEmployee(payload)
      if (status === 200) {
        dispatch(updateToast({ type: DialogResponseTypes.SUCCESS, message }))
        dispatch(getEmployees())
      } else dispatch(updateToast({ type: DialogResponseTypes.ERROR, message }))
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        )
      }
    }
  }
)
export const {
  setData,
  setParams: setEmployeesParams,
  resetParams: resetEmployeesParams,
} = employee.actions

export default employee.reducer

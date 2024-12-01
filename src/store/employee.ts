import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { updateToast } from './globalToasts'
import Employee from 'src/services/Employee'
import { AppDispatch, RootState } from '.'
import { DialogResponseTypes } from 'src/enums'
import { EmployeeStateType, ParamsType, EmployeeType } from 'src/types'

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

export const getEmployees = createAsyncThunk<{ data: EmployeeType[]; count: number }, void>(
  'employees/getAll',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { params } = (getState() as RootState).employee
      let { data, status, message } = await Employee.getEmployees(params)
      if (status === 200) {
        return data
      } else {
        dispatch(updateToast({ type: DialogResponseTypes.ERROR, message }))
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

export const updateEmployee = createAsyncThunk<void, EmployeeType>(
  'employees/update',
  async (payload, { dispatch }) => {
    try {
      let { status, message } = await Employee.updateEmployee(payload)
      if (status === 200) {
        dispatch(getEmployees())
        dispatch(updateToast({ status, type: 'update' }))
      } else dispatch(updateToast({ type: 'error', message: message, status }))
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
      }
    }
  },
)

export const addEmployee = createAsyncThunk<void, Omit<EmployeeType, 'verified'>>(
  'employee/add',
  async (payload, { dispatch, getState }) => {
    try {
      const { status, message, data } = await Employee.addEmployee(payload)
      if (status === 200) {
        dispatch(updateToast({ type: 'create', message }))
        dispatch(getEmployees())
      } else dispatch(updateToast({ type: 'error', message }))
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
      }
    }
  },
)

export const deleteEmployee = createAsyncThunk<void, string>(
  'employees/delete',
  async (payload, { dispatch }) => {
    try {
      const { status, message } = await Employee.deleteEmployee(payload)
      if (status === 200) {
        dispatch(updateToast({ type: 'delete', message }))
        dispatch(getEmployees())
      } else dispatch(updateToast({ type: 'error', message }))
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
  setData,
  setParams: setEmployeesParams,
  resetParams: resetEmployeesParams,
} = employee.actions

export default employee.reducer

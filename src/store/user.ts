import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'

import User from '../services/User'
import { updateToast } from './globalToasts'
import { AppDispatch, RootState } from '.'
import { DialogResponseTypes } from '../enums'
import { ParamsType, UserResponse, UserType } from '../types'

const initialState: UserResponse & { isLoading: boolean } & { params: ParamsType } = {
  count: 0,
  data: [],
  isLoading: false,
  params: { limit: 10, offset: 0 },
}
const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload }
    },
    updateParams(state, action: PayloadAction<ParamsType>) {
      state.params = action.payload
    },
    resetParams(state) {
      state.params = initialState.params
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getUsersHandler.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(
      getUsersHandler.fulfilled,
      (state, { payload }: PayloadAction<UserResponse>) => {
        state.isLoading = false
        state.data = payload.data
        state.count = payload.count
      },
    )
    builder.addCase(getUsersHandler.rejected, (state) => {
      state.isLoading = false
    })
  },
})

export const getUsersHandler = createAsyncThunk<UserResponse, void>(
  'user/getUsers',
  async (_, { dispatch, rejectWithValue, getState }) => {
    try {
      const { params } = (getState() as RootState).user
      const data = await User.getUsers(params)
      return data
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
        )
      }
      return rejectWithValue((error as Error).message)
    }
  },
)

export const updateUserHandler =
  (payload: UserType) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
      let { status, data, message } = await User.updateUser(payload)
      if (status === 200) {
        let { data: users, count } = state().user
        let newState = users.map((user: UserType) => {
          if (user.id === payload.id) {
            return { ...user, ...data }
          } else return user
        })
        dispatch(addData({ data: newState, count: count }))
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }),
        )
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }),
        )
      }
    } catch (error) {
      dispatch(updateToast({ status: 403, message: error, type: DialogResponseTypes.UPDATE }))
    }
  }

export const updateProfileHandler =
  (payload: UserType) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
      let { status, data, message } = await User.updateProfile(payload)
      if (status === 200) {
        let { data: users, count } = state().user
        let newState = users.map((user: UserType) => {
          if (user.profile.id === payload.profile.id) {
            return { ...user, ...data }
          } else return user
        })
        dispatch(addData({ data: newState, count: count }))
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }),
        )
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }),
        )
      }
    } catch (error) {
      dispatch(updateToast({ status: 403, message: error, type: DialogResponseTypes.UPDATE }))
    }
  }

export default user.reducer

export const { addData, updateParams, resetParams } = user.actions

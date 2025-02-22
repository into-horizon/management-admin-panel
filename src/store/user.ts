import { createSlice } from '@reduxjs/toolkit'

import User from '../services/User'
import { updateToast } from './globalToasts'
import { AppDispatch, RootState } from '.'
import { DialogResponseTypes } from '../enums'
import { ParamsType, UserType } from '../types'

const user = createSlice({
  name: 'user',
  initialState: { count: 0, data: [] },
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload }
    },
  },
})

export const getUsersHandler = (payload: ParamsType) => async (dispatch: AppDispatch) => {
  try {
    const { status, data, message } = await User.getUsers(payload)
    if (status === 200) {
      dispatch(addData(data))
    } else
      dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
  } catch (error) {
    if (error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }),
      )
    }
  }
}

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

export const { addData } = user.actions

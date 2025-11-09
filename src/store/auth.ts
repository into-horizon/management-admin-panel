import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import cookie from 'react-cookies'
import Auth from '../services/Auth'
import { updateDialog } from './globalDialog'
import { AppDispatch, RootState } from '.'
import { updateToast } from './globalToasts'
import { DialogResponseTypes } from '../enums'
import { AuthStateType, StoreType } from '../types'
import { socket } from '../socket'
import Update from '../services/Update'

const NewAuth = new Auth()
const NewUpdate = new Update()

const initialState: AuthStateType = {
  loggedIn: false,
  user: {
    id: '',
    first_name: '',
    last_name: '',
    role: '',
    active: false,
    mobile: '',
    created_at: '',
    verified: false,
  },
  message: '',
  loading: true,
  isServerDown: false,
}

type PayloadTypes = {
  email: string
  password: string
}

export const loginHandler = createAsyncThunk(
  'auth/login',
  async (payload: PayloadTypes, { dispatch, rejectWithValue }) => {
    try {
      let response = await NewAuth.basicAuth(payload)
      if (response.status === 200) {
        cookie.save('access_token', response.access_token, { path: '/' })
        cookie.save('refresh_token', response.refresh_token, { path: '/' })
        let user = await NewAuth.getStore()
        dispatch(loginAction({ loggedIn: true, user: { ...user } }))
        return { loggedIn: true, user: { ...user } }
      } else {
        rejectWithValue(response.message)
        dispatch(
          updateDialog({
            message: response.message,
            title: 'incorrect credentials',
            type: DialogResponseTypes.ERROR,
          })
        )
        return initialState
      }
    } catch (err) {
      if (err instanceof Error) {
        rejectWithValue(err.message)
        dispatch(
          updateDialog({
            message: err.message,
            title: 'Login Error',
            type: DialogResponseTypes.ERROR,
          })
        )
      }
    }
  }
)
export const getUser = createAsyncThunk(
  'auth/getUser',
  async (__, { dispatch, rejectWithValue }) => {
    try {
      let user = await NewAuth.getStore()
      if (user?.id) {
        dispatch(loginAction({ loggedIn: true, user: { ...user } }))
      } else {
        dispatch(loginAction(initialState))
        rejectWithValue('invalid token')
      }
    } catch (error) {
      dispatch(loginAction(initialState))
      if (error instanceof Error) {
        rejectWithValue(error.message)
        dispatch(
          updateDialog({
            type: DialogResponseTypes.ERROR,
            message: error.message,
          })
        )
      }
    }
  }
)

export const logout = () => async (dispatch: AppDispatch) => {
  await NewAuth.logout()
  let cookies = cookie.loadAll()
  Object.keys(cookies).forEach((key) => {
    cookie.remove(key, { path: '/' })
  })
  dispatch(loginAction({ ...initialState, loading: false }))
}

export const endSession = () => async (dispatch: AppDispatch) => {
  dispatch(loginAction({ logged: false, user: {} }))
}

export const updateInfo =
  (info: StoreType) =>
  async (dispatch: AppDispatch, state: () => RootState) => {
    try {
      let response = await NewUpdate.updateInfo(info)
      dispatch(
        loginAction({ user: { ...state().login.user, ...response.data } })
      )
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateDialog({
            type: DialogResponseTypes.ERROR,
            message: error.message,
          })
        )
      }
    }
  }

export const updateName =
  (name: string) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
      let response = await NewUpdate.updateStoreName({ store_name: name })
      dispatch(
        loginAction({ user: { ...state().login.user, ...response.data } })
      )
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateDialog({
            type: DialogResponseTypes.ERROR,
            message: error.message,
          })
        )
      }
    }
  }

export const updateStorePicture =
  (data: FormData) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
      let response = await NewUpdate.updateStorePicture(data)
      let { status } = response
      if (status === 200) {
        dispatch(
          loginAction({
            user: {
              ...state().login.user,
              store_picture: response.result.store_picture,
            },
          })
        )
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            type: DialogResponseTypes.ERROR,
            message: error.message,
          })
        )
      }
    }
  }

export const createStoreHandler =
  (payload: {}) => async (dispatch: AppDispatch) => {
    try {
      let res = await NewAuth.createStore(payload)
      let { result, message, status } = res
      if (status === 200) {
        dispatch(loginAction({ user: result, message: message }))
      } else {
        dispatch(loginAction({ message: res }))
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateDialog({
            type: DialogResponseTypes.ERROR,
            message: error.message,
            title: 'create store error',
          })
        )
      }
    }
  }

export const provideReferenceHandler =
  (payload: any) => async (dispatch: AppDispatch) => {
    try {
      let { status, message } = await NewAuth.provideReference(payload)
      if (status === 200) {
        dispatch(loginAction({ message: message }))
      } else {
        dispatch(loginAction({ message: message }))
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateDialog({
            type: DialogResponseTypes.ERROR,
            message: error.message,
            title: 'reset password error',
          })
        )
      }
    }
  }

export const validateTokenHandler =
  (token: string) => async (dispatch: AppDispatch) => {
    try {
      const { status, message } = await NewAuth.validateToken(token)
      if (status === 200) {
        dispatch(loginAction({ message: 'valid' }))
      } else {
        dispatch(loginAction({ message: 'invalid' }))
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateDialog({
            type: DialogResponseTypes.ERROR,
            message: error.message,
            title: 'reset password error',
          })
        )
      }
    }
  }

export const resetPasswordHandler =
  (token: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      let { message, status } = await NewAuth.resetPassword(token, password)
      if (status === 200) {
        dispatch(loginAction({ message: message }))
      } else {
        dispatch(loginAction({ message: message }))
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateDialog({
            type: DialogResponseTypes.ERROR,
            message: error.message,
            title: 'reset password error',
          })
        )
      }
    }
  }

const login = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    loginAction(state, action) {
      return { ...state, ...action.payload }
    },

    deleteMessage(state) {
      return { ...state, message: '' }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginHandler.fulfilled, (state, action) => ({
      ...state,
      ...action.payload,
      loading: false,
    })),
      builder.addCase(loginHandler.pending, (state) => ({
        ...state,
        loading: true,
      })),
      builder.addCase(loginHandler.rejected, () => ({
        ...initialState,
        loading: false,
      })),
      builder.addCase(getUser.rejected, () => ({
        ...initialState,
        loading: false,
      })),
      builder.addCase(getUser.fulfilled, (state) => ({
        ...state,
        loading: false,
      })),
      builder.addCase(getUser.pending, (state) => ({
        ...state,
        loading: true,
      }))
    builder.addCase(checkServer.pending, (state) => {
      state.loading = true
    })
    builder.addCase(
      checkServer.fulfilled,
      (state, action: PayloadAction<boolean>) => {
        state.loading = action.payload
        state.isServerDown = false
      }
    )
    builder.addCase(checkServer.rejected, (state) => {
      state.loading = false
      state.isServerDown = true
    })
  },
})

export const checkServer = createAsyncThunk(
  'auth/checkServer',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await Promise.all([
        Auth.checkAPI(),
        Auth.checkManagementAPI(),
        socket.connect(),
      ])
      if (cookie.load('access_token')) {
        dispatch(getUser())
        return true
      }
      return false
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

export default login.reducer
export const { loginAction, deleteMessage } = login.actions

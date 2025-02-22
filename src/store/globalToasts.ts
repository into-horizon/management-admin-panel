import { createSlice } from '@reduxjs/toolkit'
import { DialogResponseTypes } from '../enums'

const initialState: { message: string; status: number; type: DialogResponseTypes } = {
  message: '',
  status: 0,
  type: DialogResponseTypes.DEFAULT,
}
const globalToasts = createSlice({
  name: 'global toasts',
  initialState: { ...initialState },
  reducers: {
    updateToast(state, action) {
      return { ...action.payload }
    },

    resetState() {
      return { ...initialState }
    },
  },
})

export default globalToasts.reducer

export const { updateToast, resetState } = globalToasts.actions

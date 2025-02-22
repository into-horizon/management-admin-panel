import { createSlice } from '@reduxjs/toolkit'
import { DialogResponseTypes } from '../enums'

const initialState: { message: string; status: number; type: DialogResponseTypes; title: string } =
  {
    message: '',
    status: 0,
    type: DialogResponseTypes.DEFAULT,
    title: '',
  }
const globalDialog = createSlice({
  name: 'dialog',
  initialState: { ...initialState },
  reducers: {
    updateDialog(state, action) {
      return { ...action.payload }
    },
    resetState() {
      return { ...initialState }
    },
  },
})

export default globalDialog.reducer

export const { updateDialog, resetState } = globalDialog.actions

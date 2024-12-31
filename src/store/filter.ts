import { createSlice } from '@reduxjs/toolkit'
import { save, load, remove } from 'react-cookies'
import { setDate } from 'src/services/helpers'
import { AppDispatch } from '.'

const setDefaultDate = () => {
  let date = `${setDate(30)}&${setDate()}`
  save('duration', date, { path: '/' })
  return date
}

const initialState: { store?: { title: string; id: string }; duration: string } = {
  store: load('populated-store') ? load('populated-store') : {},
  duration: load('duration') ?? setDefaultDate(),
}
const filter = createSlice({
  name: 'filter',
  initialState: initialState,
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload }
    },
  },
})

export const populateStore = (payload?: typeof initialState) => (dispatch: AppDispatch) => {
  payload?.store?.id
    ? save('populated-store', payload.store, { path: '/' })
    : remove('populated-store', { path: '/' })
  payload?.duration
    ? save('duration', payload.duration, { path: '/' })
    : remove('duration', { path: '/' })
  window.location.reload()
  dispatch(addData({ populatedStore: payload?.store, duration: payload?.duration }))
}

export const { addData } = filter.actions
export default filter.reducer

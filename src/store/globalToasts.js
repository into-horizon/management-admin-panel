import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message:'', status: 0,type: ''
}
const globalToasts = createSlice({
  name: "global toasts",
  initialState: {...initialState},
  reducers: {
    updateToast(state, action) {
      return { ...action.payload };
    },
    // createToast(state, action) {
    //   return { ...state, create: action.payload };
    // },
    // deleteToast(state, action) {
    //   return { ...state, delete: action.payload };
    // },
    
    resetState(){
      return {...initialState}
    }
  },
});


export default globalToasts.reducer

export const {updateToast,resetState} = globalToasts.actions
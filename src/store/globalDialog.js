import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message:'', status: 0,type: '', title: ''
}
const globalDialog = createSlice({
  name: "dialog",
  initialState: {...initialState},
  reducers: {
    updateDialog(state, action) {
      return { ...action.payload };
    },
    resetState(){
      return {...initialState}
    }
  },
});


export default globalDialog.reducer

export const {updateDialog,resetState} = globalDialog.actions
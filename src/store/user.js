import { createSlice } from "@reduxjs/toolkit";

import User from "src/services/User";
import { updateToast } from "./globalToasts";

const user = createSlice({
    name: 'user',
    initialState: {count: 0, data: []},
    reducers:{
        addData(state,action){
            return {...state,...action.payload}
        }
    }
})

export const getUsersHandler = payload => async (dispatch) =>{
    try {
        let {status, data, message} = await User.getUsers(payload)
        if(status ===200) {
            dispatch(addData(data))
        } else dispatch(updateToast({status: status, message: message, type: 'error'}))
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'error'}))
        
    }
}

export const updateUserHandler = payload => async (dispatch,state) =>{
    try {
        let {status, data, message} = await User.updateUser(payload)
        if(status === 200) {
            let {data: users,count} =  state().user
            let newState =  users.map(user =>{
                if(user.id === payload.id){
                    return {...user,...data}
                 } else return user
            })
            dispatch(addData({data: newState, count:count}))
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        } else {
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'update'}))
    
    }
        
}

export const updateProfileHandler = payload => async (dispatch, state) =>{
    try {
        let {status, data, message} = await User.updateProfile(payload)
        console.log("🚀 ~ file: user.js:53 ~ updateProfileHandler ~ status", status)
        if(status === 200) {
            let {data: users,count} =  state().user
            let newState =  users.map(user =>{
                if(user.profile_id === payload.profile_id){
                    return {...user,...data}
                 } else return user
            })
            dispatch(addData({data: newState, count:count}))
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        } else {
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'update'}))
    }
}

export default user.reducer

export const { addData} = user.actions
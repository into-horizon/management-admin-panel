import { createSlice } from '@reduxjs/toolkit'
import { updateToast } from './globalToasts'
import Employee from 'src/services/Employee'


const employee = createSlice({
    name: 'employee',
    initialState: { employees: { data: [], count: 0 } },
    reducers: {
        setData(state, action) {
            return { ...state, ...action.payload }
        }
    }
})


export const getEmployees = payload => async dispatch => {
    try {
        let { data, status, message } = await Employee.getEmployees(payload)
        if (status === 200) {
            dispatch(setData({ employees: data }))
        } else dispatch(updateToast({ type: 'error', message }))

    } catch (error) {
        dispatch(updateToast({ type: 'error', message: error.message }))
    }
}

export const updateEmployee = payload => async (dispatch, state) => {
    try {
        const { data: employees, count } = state().employee.employees
        let { status, message, data } = await Employee.updateEmployee(payload)
        if (status === 200) {
            let i = employees.findIndex(s => s.id === data.id)
            let newState = employees.with(i, { ...employee[i], ...data })
            dispatch(setData({ employees: { data: newState, count } }))
            dispatch(updateToast({ status, type: 'update' }))
        } else dispatch(updateToast({ type: 'error', message: message, status }))

    } catch (error) {
        dispatch(updateToast({ type: 'error', message: error.message }))
    }
}

 export const addEmployee = payload =>  async (dispatch) =>{
    try {
         const {status, message , data} = await Employee.addEmployee(payload)
         if(status === 200){
            dispatch(updateToast({type: 'create', message }))
         } else dispatch(updateToast({type: 'error', message}))
    } catch (error) {
        dispatch(updateToast({ type: 'error', message: error.message }))
    }
}

export const deleteEmployee =  payload => async dispatch =>{
    try {
        const {status, message , data} = await Employee.deleteEmployee(payload)
        if(status === 200){
            dispatch(updateToast({type: 'delete', message }))
         } else dispatch(updateToast({type: 'error', message}))
    } catch (error) {
        dispatch(updateToast({ type: 'error', message: error.message }))
    }
}
export const { setData } = employee.actions

export default employee.reducer 
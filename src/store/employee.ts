import { createSlice } from '@reduxjs/toolkit'
import { updateToast } from './globalToasts'
import Employee from 'src/services/Employee'
import { AppDispatch, RootState } from '.'
import { DialogResponseTypes } from 'src/enums'
import { EmployeeStateType, ParamsType, EmployeeType } from 'src/types'



const initialState :  EmployeeStateType = {
    data: [],
    count: 0
}
const employee = createSlice({
    name: 'employee',
    initialState: initialState,
    reducers: {
        setData(state, action) {
            return { ...state, ...action.payload }
        }
    }
})


export const getEmployees = (payload : ParamsType) => async (dispatch: AppDispatch) => {
    try {
        let { data, status, message } = await Employee.getEmployees(payload)
        if (status === 200) {
            dispatch(setData( data ))
        } else dispatch(updateToast({ type: 'error', message }))

    } catch (error) {
        if(error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR    })
            );
        }
    }
}

export const updateEmployee = (payload : EmployeeType) => async (dispatch : AppDispatch, state:  ()=> RootState) => {
    try {
        const { data: employees, count } = state().employee
        let { status, message, data } = await Employee.updateEmployee(payload)
        if (status === 200) {
            // let i = employees.findIndex((s :EmployeeType ) => s.id === data.id)
            let newState = employees.map( (e: EmployeeType) => e.id ===data.id ? {...e,...data}: e)
            dispatch(setData({ employees: { data: newState, count } }))
            dispatch(updateToast({ status, type: 'update' }))
        } else dispatch(updateToast({ type: 'error', message: message, status }))

    } catch (error) {
        if(error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}

 export const addEmployee = (payload:  EmployeeType) =>  async (dispatch: AppDispatch) =>{
    try {
         const {status, message , data} = await Employee.addEmployee(payload)
         if(status === 200){
            dispatch(updateToast({type: 'create', message }))
         } else dispatch(updateToast({type: 'error', message}))
    } catch (error) {
        if(error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}

export const deleteEmployee =  (payload: string) => async (dispatch: AppDispatch) =>{
    try {
        const {status, message , data} = await Employee.deleteEmployee(payload)
        if(status === 200){
            dispatch(updateToast({type: 'delete', message }))
         } else dispatch(updateToast({type: 'error', message}))
    } catch (error) {
        if(error instanceof Error) {
            dispatch(
                updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
            );
        }
    }
}
export const { setData } = employee.actions

export default employee.reducer 
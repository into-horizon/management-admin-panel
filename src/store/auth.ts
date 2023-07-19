import { createSlice } from "@reduxjs/toolkit";
import cookie from 'react-cookies';
import Auth from "../services/Auth"
import Update from "src/services/Update";
import { updateDialog } from "./globalDialog";
import { AppDispatch, RootState } from ".";
import { updateToast } from "./globalToasts";
import { DialogResponseTypes } from "src/enums";
import { AuthStateType, StoreType } from "src/types";

const NewAuth = new Auth();
const NewUpdate = new Update();


const initialState: AuthStateType = {
    loggedIn: false, user: {
        id: "",
        first_name: "",
        last_name: "",
        role: "",
        active: false,
        mobile: "",
        created_at: ""
    }, message: ''
}
const login = createSlice({
    name: 'login',
    initialState: initialState,
    reducers: {
        loginAction(state, action) {

            return { ...state, ...action.payload }
        },

        deleteMessage(state, action) {
            return { ...state, message: '' }
        }
    },
})

type PayloadTypes = {
    email: string,
    password: string
}

export const loginHandler = (payload: PayloadTypes) => async (dispatch: AppDispatch) => {
    try {
        let response = await NewAuth.basicAuth(payload)
        if (response.status === 200) {
            cookie.save('access_token', response.access_token, { path: '/' })
            cookie.save('refresh_token', response.refresh_token, { path: '/' })
            let user = await NewAuth.getStore()
            dispatch(loginAction({ loggedIn: true, user: { ...user } }));
        } else {
            dispatch(updateDialog({ message: response.message, title: 'incorrect credentials', type: DialogResponseTypes.ERROR }))
        }
    } catch (err) {
        if (err instanceof Error) {

            dispatch(updateDialog({ message: err.message, title: 'Login Error', type: DialogResponseTypes.ERROR }))
        }
    }
}
export const getUser = () => async (dispatch: AppDispatch) => {
    try {
        let user = await NewAuth.getStore()
        if (user?.id) {
            dispatch(loginAction({ loggedIn: true, user: { ...user } }))
        }
    } catch (error) {
        dispatch(loginAction(initialState))
        if (error instanceof Error) {

            dispatch(updateDialog({ type:DialogResponseTypes.ERROR, message: error.message }))
        }
    }

}

export const logout = () => async (dispatch: AppDispatch) => {
    await NewAuth.logout()
    let cookies = cookie.loadAll()
    Object.keys(cookies).forEach(key => {
        cookie.remove(key, { path: '/' })
    })
    dispatch(loginAction({ loggedIn: false, user: {} }))
}

export const endSession = () => async (dispatch: AppDispatch) => {
    dispatch(loginAction({ logged: false, user: {} }))
}

export const updateInfo = (info: StoreType) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let response = await NewUpdate.updateInfo(info)
        dispatch(loginAction({ user: { ...state().login.user, ...response.data } }))

    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateDialog({ type: DialogResponseTypes.ERROR, message: error.message }))
        }

    }
}

export const updateName = (name: string) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let response = await NewUpdate.updateStoreName({ store_name: name })
        dispatch(loginAction({ user: { ...state().login.user, ...response.data } }))
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateDialog({ type: DialogResponseTypes.ERROR, message: error.message }))
        }

    }
}

export const updateStorePicture = (data: FormData) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let response = await NewUpdate.updateStorePicture(data);
        let { status } = response
        if (status === 200) {

            dispatch(loginAction({ user: { ...state().login.user, store_picture: response.result.store_picture } }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ type: DialogResponseTypes.ERROR, message: error.message }))
        }

    }
}

export const createStoreHandler = (payload: {}) => async (dispatch: AppDispatch) => {
    try {
        let res = await NewAuth.createStore(payload);
        let { result, message, status } = res;
        if (status === 200) {
            dispatch(loginAction({ user: result, message: message }))
        } else {
            dispatch(loginAction({ message: res }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateDialog({ type: DialogResponseTypes.ERROR, message: error.message, title: 'create store error' }))
        }
    }
}

// export const verifiedEmailHandler = payload => async (dispatch : AppDispatch) => {
//     try {
//         let res = await NewAuth.verifyEmail(payload)
//         let { result, message, status } = res
//         if (res.status === 200) {
//             dispatch(loginAction({ user: result, message: message }))
//         } else if (res.status === 403) {
//             dispatch(loginAction({ message: message }))
//         }
//     } catch (error) {
//         console.log("🚀 ~ file: auth.js ~ line 88 ~ updateStorePicture ~ error", error)

//     }
// }

// export const updateVerficationCodeHandler = (payload: {} | string) => async (dispatch : AppDispatch) => {
//     try {
//         let res = await NewAuth.updateCode(payload)
//         let { result, message, status } = res
//         if (status === 200) {
//             dispatch(loginAction({ user: result, message: message }))
//         } else {
//             dispatch(loginAction({ message: res.message }))
//         }
//     } catch (error) {
//         console.log("🚀 ~ file: auth.js ~ line 131 ~ updateVerficationCodeHandler ~ error", error)

//     }
// }

export const provideReferenceHandler = (payload: any) => async (dispatch: AppDispatch) => {
    try {
        let { status, message } = await NewAuth.provideReference(payload)
        if (status === 200) {
            dispatch(loginAction({ message: message }))
        } else {
            dispatch(loginAction({ message: message }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateDialog({ type: DialogResponseTypes.ERROR, message: error.message, title: 'reset password error' }))
        }
    }
}

export const validateTokenHandler = (token: string) => async (dispatch: AppDispatch) => {
    try {
        const { status, message } = await NewAuth.validateToken(token);
        if (status === 200) {
            dispatch(loginAction({ message: 'valid' }))
        } else {
            dispatch(loginAction({ message: 'invalid' }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateDialog({ type: DialogResponseTypes.ERROR, message: error.message, title: 'reset password error' }))
        }

    }
}

export const resetPasswordHandler = (token: string, password: string) => async (dispatch: AppDispatch) => {
    try {
        let { message, status } = await NewAuth.resetPassword(token, password)
        if (status === 200) {
            dispatch(loginAction({ message: message }))
        } else {
            dispatch(loginAction({ message: message }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateDialog({ type: DialogResponseTypes.ERROR, message: error.message, title: 'reset password error' }))
        }

    }
}

export default login.reducer
export const { loginAction, deleteMessage } = login.actions



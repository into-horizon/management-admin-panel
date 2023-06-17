// import { createStore } from 'redux'
import thunk from 'redux-thunk';
import {combineReducers ,configureStore } from '@reduxjs/toolkit';
import login from './auth'
import category from './category'
import products from './product'
import orders from './orders'
import finance from './finance'
import bankAccount from './bankAccount';
import withdrawals from './withdrawal'
import globalToasts from './globalToasts';
import user from './user'
import stores from './store'
import discountCode from './discountCode';
import filter from './filter';
import employee from './employee';
import dialog from './globalDialog'
const initialState = {
  sidebarShow: true,
}


const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest }
    default:
      return state
  }
}

const reducers = combineReducers({changeState, login:login, category: category, products:products, orders:orders, finance:finance,bankAccount:bankAccount,withdrawals:withdrawals,globalToasts:globalToasts,user:user,stores:stores,discountCode:discountCode ,filter, employee,dialog })

const store = configureStore({reducer: reducers,
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(thunk)
}} )
export default store

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
import { createSlice } from "@reduxjs/toolkit";
import cookie from 'react-cookies';

import Product from '../services/ProductService';
import { updateToast } from "./globalToasts";


const products = createSlice({
    name: 'products',
    initialState : {pending: {data: [], count: 0}, overview: {data: [], count: 0}, searched:{}},
    reducers: {
        addProduct(state, action){
            return {...state, message: action.payload.message, products: [...state.product, action.payload.result]}
        },
        errorMessage (state,action){
            return {...state, message: action.payload.message}
        },
        getProducts (state, action){
            return {...state, message: action.payload.message, currentProducts: {...state.currentProducts,count: action.payload.result.count, products: action.payload.result.result}}
        },
        addProductPicture(state, action){
            return {...state, message: action.payload.message, currentProducts: {...state.currentProducts, products:action.payload.result}}
        }, 
        deleteProductPicture(state, action){
            return {...state, message: action.payload.message, currentProducts: {...state.currentProducts, products:action.payload.result}}
        },
        updateProduct(state, action){
            return {...state, message: action.payload.message, currentProducts:{...state.currentProducts, products:action.payload.result}}
        }, 
        addSearchData(state, action){
            return {...state, message: action.payload.message, currentProducts:{...state.currentProducts, searchData: action.payload.result}}
        },
        addSearchedProduct(state, action){
            return {...state, message: action.payload.message, currentProducts:{...state.currentProducts, searched: action.payload.result}}
        
        },
        deleteProduct(state, action){
            return {...state, message: action.payload.message, currentProducts:{...state.currentProducts, products: action.payload.result, count: action.payload.count}}
        },
        addData(state, {payload}){
            return {...state, ...payload}
        }

    }
})

export const addProductHandler = payload => async (dispatch, state) => {
    try {
       let result = await Product.addProduct(payload)
       if(result.status === 201){
           dispatch(addProduct(result))
       } else{
        dispatch(errorMessage({message: result}))
       }
    } catch (error) {
        dispatch(errorMessage(() =>{return{message: 'something went wrong'}}))
    }
}

export const getPendingProducts = payload => async (dispatch) => {
    try {
        let {data, message, status} = await Product.getProducts({...payload, status: 'pending'})
        if (status === 200){
            dispatch(addData({pending:data}))
        } else {
            dispatch(updateToast({status: status, message: message, type: 'error'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error.message, type: 'error'}))
    }
}

export const updateProductStatus = (payload, type = 'pending') => async (dispatch, state) =>{
    try {
        let {status, data, message} =  await Product.updateProductStatus(payload)
        if(status === 200) {
            let {data:products, count} =  state().products[type]
            let newState = products.map(product =>{
                    if (product.id === data.id) return {...product, ...data}
                    return product
            })  
            dispatch(addData({[type]:{data:newState, count:count}}))
            dispatch(updateToast({status: status, message: message, type: 'update'}))
             } else dispatch(updateToast({status: status, message: message, type: 'error'}))
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'error'}))
    }
}

export const getProductsByStatus = payload => async (dispatch, state) =>{
    try {
        let {data, message, status} = await Product.getProducts(payload)
        if (status === 200){
            dispatch(addData({overview:data}))
        } else {
            dispatch(updateToast({status: status, message: message, type: 'error'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error.message, type: 'error'}))
    }
}

export const addProductPictureHandler = payload => async (dispatch, state) => {
    try {
        let {status, data, message} = await Product.addProductPicture(payload)
        if(status === 200){
            let {count, data:overview} = state().products.overview
            let newState = overview.map(product =>{
                if(data.product_id === product.id){
                    let newProduct = {...product}
                    let newPic = {id: data.id, product_picture: data.product_picture}
                    newProduct['pictures'] = [...product.pictures, newPic]
                    return newProduct
                } else return product
                
            })
            dispatch(addData({overview: {count:count, data: newState}}))
            dispatch(updateToast({status: status, message: message, type: 'add'}))
        } else{
            dispatch(updateToast({status: status, message: message, type: 'error'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'error'})) 
    }
}
export const deleteProductPictureHandler = payload => async (dispatch, state) =>{
    try {
        let {status, message, data} = await Product.deleteProductPicture(payload)
        if(status===200){
            let {count, data:overview} = state().products.overview
            let newState = overview.map(product =>{
                let newProduct = {...product}
                 let newPics = product.pictures.filter(picture => picture.id !== payload.picture_id)
                 newProduct['pictures'] = newPics
                 return newProduct
            })
            dispatch(addData({overview:{ data: newState, count:count}}))
            dispatch(updateToast({status: status, message: message, type: 'delete'}))
        } else{
            dispatch(updateToast({status: status, message: message, type: 'error'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'error'})) 
    }
}
export const updateSizeAndQuantity = payload => async (dispatch, state) => {
    try {
        let {result, message, status} = await Product.updateSizeAndQuantity(payload)
        if(status === 200){
            const {data: products, count}  = state().products.overview
            let newProducts = products.map(val => {
                if( val.id === result.id){
                  
                    return {...val,...result}
                }   else return val 
               
            })
            dispatch(addData({overview: {data: newProducts, count: count}}))
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        } else {
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'update'}))  
    }
}



export const updateDiscount = payload => async (dispatch, state) => {
    try {
        let {result, message, status} = await Product.updateDiscount(payload)
        if (status === 200){
            const {data: products, count}  = state().products.overview
            let newProducts = products.map(val => {
                if( val.id === result.id){
                    let product = {...val}
                    product['discount'] = result.discount
                    product['discount_rate'] = result.discount_rate
                   
                    return product
                }   else return val 
               
            })
            dispatch(addData({overview: {data: newProducts, count: count}}))
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        } else {
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        }
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'update'})) 
    }
}
export const getSearchDataHandler = payload => async (dispatch, state) => {
    try {
        let {data, status} = await Product.getSearchData(payload)
        if(status === 200){
            dispatch(addSearchData({message: 'searchData', result: data}))
        } else {
            dispatch(errorMessage({message: {data, status}}))
        }
    } catch (error) {
        dispatch(errorMessage(() =>{return{message: error.message}}))  
    }
}

export const getSearchedProductHandler = payload => async (dispatch, state) => {
    try {
        let {status,data:product, message} = await Product.getProduct(payload)
       
        if(product.id){
            dispatch(addData({searched: product}))
        } else {
            dispatch(updateToast({status: status, message: message, type: 'error'}))
        }
    } catch (error) {
        
        dispatch(updateToast({status: 403, message: error, type: 'error'}))
    }
}

export const updateProductHandler = payload => async (dispatch, state) => {
    try {
        let {message, result:data, status} = await Product.updateProduct(payload)
        if(status === 200){
            dispatch(addData({searched: data}))
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        } else{
            dispatch(updateToast({status: status, message: error, type: 'error'}))
        }
        
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'error'}))
    }
}

export const deleteProductHandler = payload => async (dispatch, state) => {
    try {
        let {status, data, message} = await Product.deleteProduct(payload)
        if(status===200){
            let {count, data:overview} = state().products.overview
            let newState = overview.filter(val=> val.id !== data.id)
            dispatch(addData({overview:{data:newState, count:count}}))
            dispatch(updateToast({status: status, message: message, type: 'update'}))
        } else  dispatch(updateToast({status: status, message: error, type: 'error'}))
    } catch (error) {
        dispatch(updateToast({status: 403, message: error, type: 'error'}))
    }
}
export default products.reducer
export const {addData,addProduct,errorMessage,getProducts,addProductPicture,deleteProductPicture,updateProduct,addSearchData,addSearchedProduct,deleteProduct} = products.actions
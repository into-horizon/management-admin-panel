import { createSlice } from "@reduxjs/toolkit";
import cookie from 'react-cookies';

import Product from '../services/ProductService';
import { updateToast } from "./globalToasts";
import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";
import { ProductStateType, ProductType, ParamsType, ProductPictureType } from "src/types";

const initialState: ProductStateType = {
    pending: {
        data: [],
        count: 0
    },
    overview: {
        data: [],
        count: 0
    },
    searched: {
        id: "",
        store_id: "",
        entitle: "",
        artitle: "",
        parent_category_id: "",
        child_category_id: "",
        grandchild_category_id: null,
        discount: false,
        discount_rate: 0,
        price: 0,
        currency: "",
        brand_name: null,
        endescription: "",
        ardescription: "",
        quantity: 0,
        status: "",
        age: null,
        size_and_color: null,
        display: false,
        created_at: "",
        commission: 0,
        is_commission_included: false,
        store_name: "",
        p_entitle: "",
        p_artitle: "",
        c_entitle: "",
        c_artitle: "",
        g_entitle: null,
        g_artitle: null,
        rate: null,
        pictures: []
    },
    reviews: {
        data: [],
        count: 0
    }
}

const products = createSlice({
    name: 'products',
    initialState: initialState,
    reducers: {
        addData(state, { payload }) {
            return { ...state, ...payload }
        }

    }
})

export const addProductHandler = (payload: ProductType | FormData) => async (dispatch: AppDispatch) => {
    try {
        let { result, status, message } = await Product.addProduct(payload)
        if (status === 201) {
            dispatch(updateToast({ status: 200, message: message, type: DialogResponseTypes.CREATE }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const getPendingProducts = (payload: ParamsType) => async (dispatch: AppDispatch) => {
    try {
        let { data, message, status } = await Product.getProducts({ ...payload, status: 'pending' })
        if (status === 200) {
            dispatch(addData({ pending: data }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const updateProductStatus = (payload: {status: string, id:string}, type: 'pending' | 'overview' = 'pending') => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { status, data, message } = await Product.updateProductStatus(payload)
        if (status === 200) {
            let { data: products, count } = state().products[type]
            let newState = products.map((product: ProductType) => {
                if (product.id === data.id) return { ...product, ...data }
                return product
            })
            dispatch(addData({ [type]: { data: newState, count: count } }))
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
        } else dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const getProductsByStatus = (payload: ParamsType) => async (dispatch: AppDispatch) => {
    try {
        let { data, message, status } = await Product.getProducts(payload)
        if (status === 200) {
            dispatch(addData({ overview: data }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const addProductPictureHandler = (payload: FormData) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { status, data, message } = await Product.addProductPicture(payload)
        if (status === 200) {
            let { count, data: overview } = state().products.overview
            let newState = overview.map((product: ProductType) => {
                if (data.product_id === product.id) {
                    let newProduct = { ...product }
                    let newPic = { id: data.id, product_picture: data.product_picture }
                    newProduct['pictures'] = [...product.pictures, newPic]
                    return newProduct
                } else return product

            })
            dispatch(addData({ overview: { count: count, data: newState } }))
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.CREATE }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}
export const deleteProductPictureHandler = (payload: { picture_id: string }) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { status, message, data } = await Product.deleteProductPicture(payload)
        if (status === 200) {
            let { count, data: overview } = state().products.overview
            let newState = overview.map((product: ProductType) => {
                let newProduct = { ...product }
                let newPics = product.pictures.filter((picture: ProductPictureType) => picture.id !== payload.picture_id)
                newProduct['pictures'] = newPics
                return newProduct
            })
            dispatch(addData({ overview: { data: newState, count: count } }))
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.DELETE }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}
export const updateSizeAndQuantity = (payload: {id: string, quantity: number, size_and_color: string| null}) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { result, message, status } = await Product.updateSizeAndQuantity(payload)
        if (status === 200) {
            const { data: products, count } = state().products.overview
            let newProducts = products.map((val: ProductType) => {
                if (val.id === result.id) {

                    return { ...val, ...result }
                } else return val

            })
            dispatch(addData({ overview: { data: newProducts, count: count } }))
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}



export const updateDiscount = (payload: {id: string, discount: boolean, discount_rate: number}) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { result, message, status } = await Product.updateDiscount(payload)
        if (status === 200) {
            const { data: products, count } = state().products.overview
            let newProducts = products.map((val: ProductType) => {
                if (val.id === result.id) {
                    let product = { ...val }
                    product['discount'] = result.discount
                    product['discount_rate'] = result.discount_rate

                    return product
                } else return val

            })
            dispatch(addData({ overview: { data: newProducts, count: count } }))
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}
// export const getSearchDataHandler = payload => async (dispatch, state) => {
//     try {
//         let {data, status} = await Product.getSearchData(payload)
//         if(status === 200){
//             dispatch(addSearchData({message: 'searchData', result: data}))
//         } else {
//             dispatch(errorMessage({message: {data, status}}))
//         }
//     } catch (error) {
//         if(error instanceof Error ) {

//             dispatch(updateToast({status: 403, message: error.message, type: DialogResponseTypes.ERROR})) 
//         }
//     }
// }

export const getSearchedProductHandler = (payload: any) => async (dispatch: AppDispatch) => {
    try {
        let { status, data: product, message } = await Product.getProduct(payload)

        if (product.id) {
            dispatch(addData({ searched: product }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const updateProductHandler = (payload: ProductType) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { message, result: data, status } = await Product.updateProduct(payload)
        if (status === 200) {
            dispatch(addData({ searched: data }))
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
        } else {
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
        }

    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const deleteProductHandler = (payload: { id: string }) => async (dispatch: AppDispatch, state: () => RootState) => {
    try {
        let { status, data, message } = await Product.deleteProduct(payload)
        if (status === 200) {
            let { count, data: overview } = state().products.overview
            let newState = overview.filter(val => val.id !== data.id)
            dispatch(addData({ overview: { data: newState, count: count } }))
            dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE }))
        } else dispatch(updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR }))
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}

export const getProductReviews = (payload: ParamsType) => async (dispatch: AppDispatch) => {
    try {
        let { message, status, data } = await Product.getProductReviews(payload)
        if (status === 200) {
            dispatch(addData({ reviews: data }))
        }
    } catch (error) {
        if (error instanceof Error) {

            dispatch(updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR }))
        }
    }
}
export default products.reducer
export const { addData } = products.actions
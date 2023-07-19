import { createSlice } from "@reduxjs/toolkit";
import { save, load, remove } from "react-cookies";
import Store from "../services/Stores";
import { updateToast } from "./globalToasts";
import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";
import { ParamsType, StoreType, StoreStateType } from "src/types";

const store = createSlice({
  name: "store",
  initialState: {
    pending: { data: [], count: 0 },
    overview: { data: [], count: 0 },
    searched: [], 
    populatedStore: load('populated-store')?load('populated-store'):{}
  },
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const getPendingStores = (payload :ParamsType) => async (dispatch : AppDispatch) => {
  try {
    const { status, data, message } = await Store.getPendingStores({
      status: "pending",
      ...payload,
    });
    if (status === 200) {
      dispatch(addData({ pending: data }));
    }
  } catch (e) {

    if(e instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: e.message, type: DialogResponseTypes.ERROR })
      );

    }
  }
};

export const updateStoreStatusHandler = (payload : StoreType, type : 'pending' | 'overview') => async (dispatch : AppDispatch, state: ()=> RootState) => {
    try {
      const { status, data, message } = await Store.updateStoreStatus(payload);
      if (status === 200) {
        let { data: pendingData, count } = state().stores[type];
        let newState = pendingData.map((store : StoreType) => {
          if (store.id === data.id) {
            return { ...store, ...data };
          } else return store;
        });
        let x : StoreStateType = {
          pending: {
            data: [],
            count: 0
          },
          overview: {
            data: [],
            count: 0
          },
          searched: [],
          populatedStore: {
            title: undefined,
            id: undefined
          }
        };
        x[type] = { data: newState, count: count };
        dispatch(
          updateToast({ status: 200, message: message, type: DialogResponseTypes.UPDATE })
        );
        dispatch(addData({ ...x }));
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE })
        );
      }
    } catch (e) {
      if(e instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: e.message, type: DialogResponseTypes.ERROR })
        );
  
      }
    }
  };

export const getStoresHandler = (payload : ParamsType) => async (dispatch : AppDispatch) => {
  try {
    const { status, data, message } = await Store.getStores(payload);
    if (status === 200) {
      dispatch(addData({ overview: data }));
    }
  } catch (e) {
    if(e instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: e.message, type: DialogResponseTypes.ERROR })
      );

    }
  }
};

export const updateStoreHandler = (payload : StoreType) => async(dispatch : AppDispatch,state :  ()=> RootState)=>{
  try {
    const { status, data, message } = await Store.updateStore(payload);
    if (status === 200) {
      let { data: overview, count } = state().stores.overview;
      let newState = overview.map((store : StoreType) => {
        if (store.id === data.id) {
          return { ...store, ...data };
        } else return store;
      }); 
      dispatch(
        updateToast({ status: 200, message: message, type: DialogResponseTypes.UPDATE })
      );
      dispatch(addData({ data: newState, count: count }));
    } else {
      dispatch(
        updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE })
      );
    }
  } catch (error) {
    if(error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
      );

    }
  }
}
export const updateStoreNameHandler = (payload : StoreType) => async(dispatch : AppDispatch,state:  () => RootState)=>{
  try {
    const { status, data, message } = await Store.updateStoreName(payload);
    if (status === 200) {
      let { data: overview, count } = state().stores.overview;
      let newState : StoreType[] = overview.map((store : StoreType) => {
        if (store.id === data.id) {
          return { ...store, ...data };
        } else return store;
      }); 
      dispatch(
        updateToast({ status: 200, message: message, type: DialogResponseTypes.UPDATE })
      );
      dispatch(addData({overview:{ data: newState, count: count }}));
    } else {
      dispatch(
        updateToast({ status: status, message: message, type: DialogResponseTypes.UPDATE })
      );
    }
  } catch (error) {
    if(error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
      );

    }
  }
}

export const searchForStore = (payload : any) => async (dispatch : AppDispatch) =>{
  try {
    let {status, data, message} = await Store.getStores(payload)
    if(status === 200){
      dispatch(addData({searched: data.data}))
    } else dispatch(updateToast({status: status, message:message, type: DialogResponseTypes.ERROR}))
  } catch (error) {
    if(error instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
      );

    }
  }
}

export const populateStore = (payload : {id: string , title: string} ) => (dispatch : AppDispatch) =>{
    payload.id ? save('populated-store', payload,{path:'/'}) : remove('populated-store', {path:'/'})
    window.location.reload()
    dispatch(addData({populatedStore: payload}))
}

export default store.reducer;

export const { addData } = store.actions;

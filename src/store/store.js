import { createSlice } from "@reduxjs/toolkit";
import Store from "../services/Stores";
import { updateToast } from "./globalToasts";

const store = createSlice({
  name: "store",
  initialState: {
    pending: { data: [], count: 0 },
    overview: { data: [], count: 0 },
  },
  reducers: {
    addData(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const getPendingStores = (payload) => async (dispatch) => {
  try {
    const { status, data, message } = await Store.getPendingStores({
      status: "pending",
      ...payload,
    });
    if (status === 200) {
      dispatch(addData({ pending: data }));
    }
  } catch (e) {
    console.error(e);
  }
};

export const updateStoreStatusHandler = (payload, type) => async (dispatch, state) => {
    try {
      const { status, data, message } = await Store.updateStoreStatus(payload);
      if (status === 200) {
        let { data: pendingData, count } = state().stores[type];
        let newState = pendingData.map((store) => {
          if (store.id === data.id) {
            return { ...store, ...data };
          } else return store;
        });
        let x = {};
        x[type] = { data: newState, count: count };
        dispatch(
          updateToast({ status: 200, message: message, type: "update" })
        );
        dispatch(addData({ ...x }));
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: "update" })
        );
      }
    } catch (e) {
      dispatch(
        updateToast({ status: 403, message: e.message, type: "update" })
      );
    }
  };

export const getStoresHandler = (payload) => async (dispatch) => {
  try {
    const { status, data, message } = await Store.getStores(payload);
    if (status === 200) {
      dispatch(addData({ overview: data }));
    }
  } catch (e) {
    console.error(e);
  }
};

export const updateStoreHandler = payload => async(dispatch,state)=>{
  try {
    const { status, data, message } = await Store.updateStore(payload);
    if (status === 200) {
      let { data: overview, count } = state().stores.overview;
      let newState = overview.map((store) => {
        if (store.id === data.id) {
          return { ...store, ...data };
        } else return store;
      }); 
      dispatch(
        updateToast({ status: 200, message: message, type: "update" })
      );
      dispatch(addData({ data: newState, count: count }));
    } else {
      dispatch(
        updateToast({ status: status, message: message, type: "update" })
      );
    }
  } catch (error) {
    dispatch(
      updateToast({ status: 403, message: e.message, type: "update" })
    );
  }
}
export const updateStoreNameHandler = payload => async(dispatch,state)=>{
  try {
    const { status, data, message } = await Store.updateStoreName(payload);
    if (status === 200) {
      let { data: overview, count } = state().stores.overview;
      let newState = overview.map((store) => {
        if (store.id === data.id) {
          return { ...store, ...data };
        } else return store;
      }); 
      dispatch(
        updateToast({ status: 200, message: message, type: "update" })
      );
      dispatch(addData({overview:{ data: newState, count: count }}));
    } else {
      dispatch(
        updateToast({ status: status, message: message, type: "update" })
      );
    }
  } catch (error) {
    dispatch(
      updateToast({ status: 403, message: e.message, type: "update" })
    );
  }
}

export default store.reducer;

export const { addData } = store.actions;

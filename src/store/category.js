import { createSlice } from "@reduxjs/toolkit";
import cookie from "react-cookies";

import Category from "../services/CategoryService";
import { updateToast } from "./globalToasts";

const category = createSlice({
  name: "Category",
  initialState: {
    parentCategories: { data: [], count: 0 },
    childCategories: { data: [], count: 0 },
    grandChildCategories: { data: [], count: 0 },
  },
  reducers: {
    getParentCategories(state, action) {
      return { ...state, parentCategories: action.payload };
    },
    getChildCategories(state, action) {
      return { ...state, childCategories: action.payload };
    },
    getGrandChildCategories(state, action) {
      return { ...state, grandChildCategories: action.payload };
    },
  },
});

export const getParentCategoriesHandler =
  (payload) => async (dispatch, state) => {
    try {
      let { data } = await Category.getAllParentCategoires(payload);
      dispatch(getParentCategories(data));
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };

export const getChildCategoriesHandler =
  (payload) => async (dispatch, state) => {
    try {
      let { data } = await Category.getAllChildCategoires(payload);
      dispatch(getChildCategories(data));
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };

export const getGrandChildCategoriesHandler =
  (payload) => async (dispatch, state) => {
    try {
      let { data } = await Category.getAllGrandChildCategoires(payload);
      dispatch(getGrandChildCategories(data));
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };

export const updateGrandChildCategory =
  (payload) => async (dispatch, state) => {
    const { data, count } = state().category.grandChildCategories;
    try {
      let {
        message,
        data: item,
        status,
      } = await Category.updateGrandChildCategory(payload);
      if (status === 200) {
        let newData = data.map((val) => {
          if (item.id === val.id) {
            return { ...val, ...item };
          } else return val;
        });
        dispatch(getGrandChildCategories({ data: newData, count: count }));
        dispatch(
          updateToast({ status: status, message: message, type: "update" })
        );
      } else
        dispatch(
          updateToast({ status: status, message: message, type: "error" })
        );
    } catch (e) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };
export const updateChildCategory = (payload) => async (dispatch, state) => {
  const { data, count } = state().category.childCategories;
  try {
    let {
      message,
      data: item,
      status,
    } = await Category.updateChildCategory(payload);
    if (status === 200) {
      let newData = data.map((val) => {
        if (item.id === val.id) {
          return { ...val, ...item };
        } else return val;
      });
      dispatch(getChildCategories({ data: newData, count: count }));
      dispatch(
        updateToast({ status: status, message: message, type: "update" })
      );
    } else
      dispatch(
        updateToast({ status: status, message: message, type: "error" })
      );
  } catch (e) {
    dispatch(
      updateToast({ status: 403, message: error.message, type: "error" })
    );
  }
};
export const updateParentCategory = (payload) => async (dispatch, state) => {
  const { data, count } = state().category.parentCategories;
  try {
    let {
      message,
      data: item,
      status,
    } = await Category.updateParentCategory(payload);
    if (status === 200) {
      let newData = data.map((val) => {
        if (item.id === val.id) {
          return { ...val, ...item };
        } else return val;
      });
      dispatch(getParentCategories({ data: newData, count: count }));
      dispatch(
        updateToast({ status: status, message: message, type: "update" })
      );
    } else
      dispatch(
        updateToast({ status: status, message: message, type: "error" })
      );
  } catch (e) {
    dispatch(
      updateToast({ status: 403, message: error.message, type: "error" })
    );
  }
};

export const addParentCategoryHandler =
  (payload, params) => async (dispatch) => {
    try {
      let { message, data, status } = await Category.addParentCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "create" })
        );
        dispatch(getParentCategoriesHandler(params));
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: "error" })
        );
      }
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };
export const addChildCategoryHandler =
  (payload, params) => async (dispatch) => {
    try {
      let { message, data, status } = await Category.addChildCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "create" })
        );
        dispatch(getChildCategoriesHandler(params));
      } else
        dispatch(
          updateToast({ status: status, message: message, type: "error" })
        );
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };
export const addGrandchildCategoryHandler =
  (payload, params) => async (dispatch) => {
    try {
      let { message, data, status } = await Category.addGrandChildCategory(
        payload
      );
      if (status === 200) {
        dispatch(updateToast({ status: status, message: message, type: "create" }));
        dispatch(getGrandChildCategoriesHandler(params));
      } else
        dispatch(
          updateToast({ status: status, message: message, type: "error" })
        );
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };

export const deleteGrandchildCategoryHandler = (payload, params) => async (dispatch) => {
    try {
      let { message, data, status } = await Category.deleteGrandChildCategory(payload );
      if (status === 200) {
        dispatch(updateToast({ status: status, message: message, type: "delete" }));
        dispatch(getGrandChildCategoriesHandler(params));
      } else
        dispatch(
          updateToast({ status: status, message: message, type: "error" })
        );
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };

  export const deleteChildCategoryHandler =
  (payload, params) => async (dispatch) => {
    try {
      let { message, data, status } = await Category.deleteChildCategory(payload);
      if (status === 200) {
        dispatch( updateToast({ status: status, message: message, type: "delete" }) );
        dispatch(getChildCategoriesHandler(params));
      } else
        dispatch(
          updateToast({ status: status, message: message, type: "error" })
        );
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };

  export const deleteParentCategoryHandler =
  (payload, params) => async (dispatch) => {
    try {
      let { message, data, status } = await Category.deleteParentCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "delete" })
        );
        dispatch(getParentCategoriesHandler(params));
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: "error" })
        );
      }
    } catch (error) {
      dispatch(
        updateToast({ status: 403, message: error.message, type: "error" })
      );
    }
  };

export default category.reducer;
export const {
  getParentCategories,
  getChildCategories,
  getGrandChildCategories,
} = category.actions;

import { createSlice } from "@reduxjs/toolkit";

import Category from "../services/CategoryService";
import { updateToast } from "./globalToasts";
import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";

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
  (payload : ParamsType) => async (dispatch: AppDispatch) => {
    try {
      let { data } = await Category.getAllParentCategoires(payload);
      dispatch(getParentCategories(data));
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };

export const getChildCategoriesHandler =
  (payload : ParamsType) => async (dispatch: AppDispatch) => {
    try {
      let { data } = await Category.getAllChildCategoires(payload);
      dispatch(getChildCategories(data));
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };

export const getGrandChildCategoriesHandler =
  (payload : ParamsType) => async (dispatch : AppDispatch) => {
    try {
      let { data } = await Category.getAllGrandChildCategoires(payload);
      dispatch(getGrandChildCategories(data));
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };

export const updateGrandChildCategory =
  (payload : ChildAndGrandCategoriesType) => async (dispatch : AppDispatch, state: ()=> RootState) => {
    const { data, count } = state().category.grandChildCategories;
    try {
      let {
        message,
        data: item,
        status,
      } = await Category.updateGrandChildCategory(payload);
      if (status === 200) {
        let newData = data.map((val : ChildAndGrandCategoriesType) => {
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
          updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
        );
    } catch (e) {
      if(e instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: e.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };
export const updateChildCategory = (payload : ChildAndGrandCategoriesType) => async (dispatch: AppDispatch , state: ()=> RootState) => {
  const { data, count } = state().category.childCategories;
  try {
    let {
      message,
      data: item,
      status,
    } = await Category.updateChildCategory(payload);
    if (status === 200) {
      let newData = data.map((val :ChildAndGrandCategoriesType) => {
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
        updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
      );
  } catch (e) {
    if(e instanceof Error) {

      dispatch(
        updateToast({ status: 403, message: e.message, type: DialogResponseTypes.ERROR })
      );
    }
  }
};
export const updateParentCategory = (payload : ParentCategoriesType) => async (dispatch : AppDispatch, state : ()=> RootState) => {
  const { data, count } = state().category.parentCategories;
  try {
    let {
      message,
      data: item,
      status,
    } = await Category.updateParentCategory(payload);
    if (status === 200) {
      let newData = data.map((val :ParentCategoriesType)  => {
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
        updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
      );
  } catch (e) {
    if(e instanceof Error) {
      dispatch(
        updateToast({ status: 403, message: e.message, type: DialogResponseTypes.ERROR })
      );
    }
  }
};

export const addParentCategoryHandler =
  (payload : ParentCategoriesType) => async (dispatch : AppDispatch) => {
    try {
      let { message, data, status } = await Category.addParentCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "create" })
        );
       
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
        );
      }
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };
export const addChildCategoryHandler =
  (payload : ChildAndGrandCategoriesType) => async (dispatch : AppDispatch) => {
    try {
      let { message, data, status } = await Category.addChildCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "create" })
        );
      } else
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
        );
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };
export const addGrandchildCategoryHandler =
  (payload : ChildAndGrandCategoriesType) => async (dispatch : AppDispatch) => {
    try {
      let { message, data, status } = await Category.addGrandChildCategory(
        payload
      );
      if (status === 200) {
        dispatch(updateToast({ status: status, message: message, type: "create" }));
      } else
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
        );
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };

export const deleteGrandchildCategoryHandler = (payload : string) => async (dispatch: AppDispatch) => {
    try {
      let { message, data, status } = await Category.deleteGrandChildCategory(payload );
      if (status === 200) {
        dispatch(updateToast({ status: status, message: message, type: "delete" }));
      } else
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
        );
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };

  export const deleteChildCategoryHandler =
  (payload : string) => async (dispatch :AppDispatch) => {
    try {
      let { message, data, status } = await Category.deleteChildCategory(payload);
      if (status === 200) {
        dispatch( updateToast({ status: status, message: message, type: "delete" }) );
      } else
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
        );
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };

  export const deleteParentCategoryHandler =
  (payload : string ) => async (dispatch :AppDispatch) => {
    try {
      let { message, data, status } = await Category.deleteParentCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "delete" })
        );
      } else {
        dispatch(
          updateToast({ status: status, message: message, type: DialogResponseTypes.ERROR })
        );
      }
    } catch (error) {
      if(error instanceof Error) {
        dispatch(
          updateToast({ status: 403, message: error.message, type: DialogResponseTypes.ERROR })
        )
      }
    }
  };

export default category.reducer;
export const {
  getParentCategories,
  getChildCategories,
  getGrandChildCategories,
} = category.actions;

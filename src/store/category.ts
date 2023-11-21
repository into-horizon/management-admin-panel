import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import Category from "../services/CategoryService";
import { updateToast } from "./globalToasts";
import { AppDispatch, RootState } from ".";
import { DialogResponseTypes } from "src/enums";
import {
  CategoriesStateType,
  ParamsType,
  ChildAndGrandCategoriesType,
  ParentCategoriesType,
} from "src/types";

const initialState: CategoriesStateType = {
  parentCategories: { data: [], count: 0 },
  childCategories: { data: [], count: 0 },
  grandChildCategories: { data: [], count: 0 },
  isLoading: false,
  isProgressing: false,
};
const category = createSlice({
  name: "Category",
  initialState,
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
  extraReducers(builder) {
    builder.addCase(getParentCategoriesHandler.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getParentCategoriesHandler.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getParentCategoriesHandler.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getChildCategoriesHandler.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getChildCategoriesHandler.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getChildCategoriesHandler.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getGrandChildCategoriesHandler.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(getGrandChildCategoriesHandler.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getGrandChildCategoriesHandler.rejected, (state) => {
      state.isLoading = false;
    });
    builder.addCase(updateChildCategory.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(updateChildCategory.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(updateChildCategory.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(updateGrandChildCategory.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(updateGrandChildCategory.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(updateGrandChildCategory.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(updateParentCategory.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(updateParentCategory.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(updateParentCategory.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(addChildCategoryHandler.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(addChildCategoryHandler.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(addChildCategoryHandler.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(addGrandchildCategoryHandler.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(addGrandchildCategoryHandler.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(addGrandchildCategoryHandler.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(addParentCategoryHandler.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(addParentCategoryHandler.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(addParentCategoryHandler.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(deleteChildCategoryHandler.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(deleteChildCategoryHandler.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(deleteChildCategoryHandler.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(deleteGrandchildCategoryHandler.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(deleteGrandchildCategoryHandler.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(deleteGrandchildCategoryHandler.rejected, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(deleteParentCategoryHandler.fulfilled, (state) => {
      state.isProgressing = false;
    });
    builder.addCase(deleteParentCategoryHandler.pending, (state) => {
      state.isProgressing = true;
    });
    builder.addCase(deleteParentCategoryHandler.rejected, (state) => {
      state.isProgressing = false;
    });
  },
});

export const getParentCategoriesHandler = createAsyncThunk(
  "category/getParent",
  async (payload: ParamsType, { dispatch, rejectWithValue }) => {
    try {
      const { data } = await Category.getAllParentCategoires(payload);
      dispatch(getParentCategories(data));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getChildCategoriesHandler = createAsyncThunk(
  "categories/getChild",
  async (payload: ParamsType, { dispatch, rejectWithValue }) => {
    try {
      let { data } = await Category.getAllChildCategoires(payload);
      dispatch(getChildCategories(data));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);

export const getGrandChildCategoriesHandler = createAsyncThunk(
  "categories/getGrandchild",
  async (payload: ParamsType, { dispatch, rejectWithValue }) => {
    try {
      let { data } = await Category.getAllGrandChildCategoires(payload);
      dispatch(getGrandChildCategories(data));
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateGrandChildCategory = createAsyncThunk(
  "categories/updateGrandchild",
  async (
    payload: ChildAndGrandCategoriesType,
    { getState, dispatch, rejectWithValue }
  ) => {
    const { data, count } = (getState() as RootState).category
      .grandChildCategories;
    try {
      let {
        message,
        data: item,
        status,
      } = await Category.updateGrandChildCategory(payload);
      if (status === 200) {
        let newData = data.map((val: ChildAndGrandCategoriesType) => {
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
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
    } catch (e) {
      if (e instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: e.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(e.message);
      }
    }
  }
);

export const updateChildCategory = createAsyncThunk(
  "categories/updateChild",
  async (
    payload: ChildAndGrandCategoriesType,
    { getState, dispatch, rejectWithValue }
  ) => {
    const { data, count } = (getState() as RootState).category.childCategories;
    try {
      let {
        message,
        data: item,
        status,
      } = await Category.updateChildCategory(payload);
      if (status === 200) {
        let newData = data.map((val: ChildAndGrandCategoriesType) => {
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
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
    } catch (e) {
      if (e instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: e.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(e.message);
      }
    }
  }
);
export const updateParentCategory = createAsyncThunk(
  "categories/updateParent",
  async (
    payload: ParentCategoriesType,
    { getState, dispatch, rejectWithValue }
  ) => {
    const { data, count } = (getState() as RootState).category.parentCategories;
    try {
      let {
        message,
        data: item,
        status,
      } = await Category.updateParentCategory(payload);
      if (status === 200) {
        let newData = data.map((val: ParentCategoriesType) => {
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
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
    } catch (e) {
      if (e instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: e.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(e.message);
      }
    }
  }
);

export const addParentCategoryHandler = createAsyncThunk(
  "categories/addParent",
  async (payload: ParentCategoriesType, { dispatch, rejectWithValue }) => {
    try {
      let { message, data, status } = await Category.addParentCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "create" })
        );
      } else {
        dispatch(
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);
export const addChildCategoryHandler = createAsyncThunk(
  "categories/addChild",
  async (
    payload: ChildAndGrandCategoriesType,
    { dispatch, rejectWithValue }
  ) => {
    try {
      let { message, data, status } = await Category.addChildCategory(payload);
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "create" })
        );
      } else
        dispatch(
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);
export const addGrandchildCategoryHandler = createAsyncThunk(
  "categories/addGrandchild",
  async (
    payload: ChildAndGrandCategoriesType,
    { dispatch, rejectWithValue }
  ) => {
    try {
      let { message, data, status } = await Category.addGrandChildCategory(
        payload
      );
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "create" })
        );
      } else
        dispatch(
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteGrandchildCategoryHandler = createAsyncThunk(
  "categories/deleteGrandchild",
  async (payload: string, { dispatch, rejectWithValue }) => {
    try {
      let { message, data, status } = await Category.deleteGrandChildCategory(
        payload
      );
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "delete" })
        );
      } else
        dispatch(
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteChildCategoryHandler = createAsyncThunk(
  "categories/deleteChild",
  async (payload: string, { dispatch, rejectWithValue }) => {
    try {
      let { message, data, status } = await Category.deleteChildCategory(
        payload
      );
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "delete" })
        );
      } else
        dispatch(
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);

export const deleteParentCategoryHandler = createAsyncThunk<void, string>(
  "categories/deleteParent",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      let { message, data, status } = await Category.deleteParentCategory(
        payload
      );
      if (status === 200) {
        dispatch(
          updateToast({ status: status, message: message, type: "delete" })
        );
      } else {
        dispatch(
          updateToast({
            status: status,
            message: message,
            type: DialogResponseTypes.ERROR,
          })
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        dispatch(
          updateToast({
            status: 403,
            message: error.message,
            type: DialogResponseTypes.ERROR,
          })
        );
        return rejectWithValue(error.message);
      }
    }
  }
);

export default category.reducer;
export const {
  getParentCategories,
  getChildCategories,
  getGrandChildCategories,
} = category.actions;

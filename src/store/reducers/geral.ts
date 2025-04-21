import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  infoToast: {
    open: false,
    message: "",
    type: "",
  },
  refreshItens: false,
  refreshCategories: false,
};

const geralReducer = createSlice({
  name: "geral",
  initialState,
  reducers: {
    setInfoToast(state, action) {
      state.infoToast = action.payload;
    },

    setRefreshItens(state, action) {
      state.refreshItens = action.payload;
    },

    resetRefresh(state) {
      state.refreshItens = initialState.refreshItens;
    },

    setRefreshCategories(state, action) {
      state.refreshCategories = action.payload;
    },

    resetRefreshCategories(state) {
      state.refreshCategories = initialState.refreshItens;
    },
  },
});

export default geralReducer.reducer;

export const {
  setInfoToast,
  setRefreshItens,
  resetRefresh,
  setRefreshCategories,
  resetRefreshCategories,
} = geralReducer.actions;

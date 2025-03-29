import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  infoToast: {
    open: false,
    message: "",
    type: "",
  },
  refreshItens: false,
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
  },
});

export default geralReducer.reducer;

export const { setInfoToast, setRefreshItens, resetRefresh } = geralReducer.actions;

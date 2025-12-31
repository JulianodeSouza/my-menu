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
  },
});

export default geralReducer.reducer;

export const { setInfoToast } = geralReducer.actions;

import { createSlice } from "@reduxjs/toolkit";

export type ToastPosition = "top" | "bottom";

export type ToastInfo = {
  open: boolean;
  message: string;
  type: string;
  position: ToastPosition;
};

const initialState = {
  infoToast: {
    open: false,
    message: "",
    type: "",
    position: "bottom" as ToastPosition,
  },
  refreshItens: false,
  refreshCategories: false,
};

const geralReducer = createSlice({
  name: "geral",
  initialState,
  reducers: {
    setInfoToast(state, action: { payload: Partial<ToastInfo> }) {
      state.infoToast = {
        ...state.infoToast,
        ...action.payload,
        position: action.payload.position ?? state.infoToast.position,
      };
    },
  },
});

export default geralReducer.reducer;

export const { setInfoToast } = geralReducer.actions;

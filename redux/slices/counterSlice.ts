import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  value: boolean;
  theme: any;
}

const initialState: CounterState = {
  value: false,
  theme: ``
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    setIsOwner: (state:any, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
    setTheme: (state:any, action: PayloadAction<any>) => {
      state.theme = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setIsOwner, setTheme } = counterSlice.actions;

export default counterSlice.reducer;

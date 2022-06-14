import { configureStore } from "@reduxjs/toolkit";
import { bundlesReducer } from "./slices/bundlesSlice";
import { cellsReducer } from "./slices/cellsSlice";

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
    bundles: bundlesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

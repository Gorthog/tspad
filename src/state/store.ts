import { configureStore } from "@reduxjs/toolkit";
import { cellsReducer } from "./slices/CellsSlice";

export const store = configureStore({
  reducer: { cells: cellsReducer },
});

export type RootState = ReturnType<typeof store.getState>;

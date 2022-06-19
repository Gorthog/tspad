import { configureStore } from "@reduxjs/toolkit";
import { bundlesReducer } from "./slices/bundlesSlice";
import { cellsReducer } from "./slices/cellsSlice";
import persistMiddleware from "./middleware/persist-middleware";

export const store = configureStore({
  reducer: {
    cells: cellsReducer,
    bundles: bundlesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(persistMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;

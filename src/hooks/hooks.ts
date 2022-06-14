import { bindActionCreators } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { bundlesActions } from "../state/slices/bundlesSlice";
import { cellsActions } from "../state/slices/cellsSlice";
import { RootState, store } from "../state/store";
import { useMemo } from "react";

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useActions = () => {
  const dispatch = useAppDispatch();

  return useMemo(() => {
    return bindActionCreators({ ...bundlesActions, ...cellsActions }, dispatch);
  }, [dispatch]);
};

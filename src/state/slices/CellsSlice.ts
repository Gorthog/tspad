import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

type CellType = "code" | "text";

type Direction = "up" | "down";

type Cell = {
  id: string;
  type: CellType;
  content: string;
};

type CellsState = {
  loading: boolean;
  error: string | null;
  order: string[];
  data: { [id: string]: Cell };
};

const initialState: CellsState = {
  loading: false,
  error: null,
  order: [],
  data: {},
};

const cellsSlice = createSlice({
  name: "cells",
  initialState,
  reducers: {
    moveCell: (
      state,
      action: PayloadAction<{ id: string; direction: Direction }>
    ) => {
      const { direction } = action.payload;
      const { order } = state;
      const index = order.indexOf(action.payload.id);
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= order.length) {
        return;
      }

      order[index] = order[targetIndex];
      order[targetIndex] = action.payload.id;
    },
    deleteCell: (state, action: PayloadAction<string>) => {
      let { order, data } = state;

      delete data[action.payload];
      order = order.filter((id) => id !== action.payload);
    },
    insertCellBefore: (
      state,
      action: PayloadAction<{ id: string | null; cellType: CellType }>
    ) => {
      const newCell: Cell = {
        id: nanoid(),
        type: action.payload.cellType,
        content: "",
      };

      const { order, data } = state;

      data[newCell.id] = newCell;

      const foundIndex = order.findIndex((id) => id === action.payload.id);
      if (foundIndex < 0) {
        order.splice(foundIndex, 0, newCell.id);
      } else order.push(newCell.id);
    },
    updateCell: (
      state,
      action: PayloadAction<{ id: string; content: string }>
    ) => {
      const { id, content } = action.payload;
      state.data[id].content = content;
    },
  },
});

export const { deleteCell, insertCellBefore, moveCell, updateCell } =
  cellsSlice.actions;

export const cellsReducer = cellsSlice.reducer;

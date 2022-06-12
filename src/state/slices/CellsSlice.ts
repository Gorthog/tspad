import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

type CellType = "code" | "text";

type Direction = "up" | "down";

export type Cell = {
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
    moveCell: {
      reducer: (
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
      prepare: (id: string, direction: Direction) => {
        return {
          payload: { id, direction },
        };
      },
    },
    deleteCell: {
      reducer: (state, action: PayloadAction<string>) => {
        let { order, data } = state;
        console.log("deleteCell", action.payload);
        delete data[action.payload];
        const index = order.findIndex((id) => id === action.payload);
        if (index > -1) order.splice(index, 1);
      },
      prepare: (id: string) => {
        return {
          payload: id,
        };
      },
    },
    insertCellAfter: {
      reducer: (
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
          order.unshift(newCell.id);
        } else order.splice(foundIndex + 1, 0, newCell.id);
      },
      prepare: (id: string | null, cellType: CellType) => {
        return { payload: { id, cellType } };
      },
    },
    updateCell: {
      reducer: (
        state,
        action: PayloadAction<{ id: string; content: string }>
      ) => {
        const { id, content } = action.payload;
        state.data[id].content = content;
      },
      prepare: (id: string, content: string) => {
        return { payload: { id, content } };
      },
    },
  },
});

export const cellsActions = cellsSlice.actions;

export const cellsReducer = cellsSlice.reducer;

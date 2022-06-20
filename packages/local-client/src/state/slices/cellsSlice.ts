import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import axios from "axios";
import { RootState } from "../store";

type CellType = "code" | "text";

type Direction = "up" | "down";

export type Cell = {
  id: string;
  type: CellType;
  content: string;
};

type CellsState = {
  loading: boolean;
  error?: string;
  order: string[];
  data: { [id: string]: Cell };
};

const initialState: CellsState = {
  loading: false,
  order: [],
  data: {},
};

export const fetchCells = createAsyncThunk<
  Cell[],
  void,
  { rejectValue: Error }
>("cells/fetch", async () => {
  const { data } = await axios.get<Cell[]>("/cells");
  return data;
});

export const saveCells = createAsyncThunk<
  void,
  void,
  { state: RootState; rejectValue: Error }
>("cells/save", async (_, { getState }) => {
  const { data, order } = getState().cells;
  const cells = order.map((id) => data[id]);
  await axios.post("/cells", { cells });
});
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
  extraReducers: (builder) => {
    builder.addCase(fetchCells.fulfilled, (state, action) => {
      state.loading = false;
      state.error = undefined;
      state.order = action.payload.map((cell) => cell.id);
      state.data = action.payload.reduce((acc: CellsState["data"], cell) => {
        acc[cell.id] = cell;
        return acc;
      }, {});
    });

    builder.addCase(fetchCells.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });

    builder.addCase(fetchCells.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    builder.addCase(saveCells.rejected, (state, action) => {
      state.error = action.error.message;
    });
  },
});

export const cellsActions = { ...cellsSlice.actions, fetchCells, saveCells };

export const cellsReducer = cellsSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bundle from "../../bundler";

type Bundle = {
  code?: string;
  error?: string;
};

type BundleWithLoading = Bundle & {
  loading: boolean;
};

type BundleState = {
  data: { [cellId: string]: BundleWithLoading | undefined };
};

const initialState: BundleState = {
  data: {},
};

export const createBundle = createAsyncThunk<
  { cellId: string; bundle: Bundle },
  { cellId: string; input: string },
  { rejectValue: Error }
>("bundles/create", async ({ cellId, input }) => {
  const result = await bundle(input);

  return { cellId, bundle: result };
});

const bundlesSlice = createSlice({
  name: "bundles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createBundle.fulfilled, (state, action) => {
      state.data[action.payload.cellId] = {
        loading: false,
        ...action.payload.bundle,
      };
    });

    builder.addCase(createBundle.pending, (state, action) => {
      state.data[action.meta.arg.cellId] = { loading: true, error: undefined };
    });

    builder.addCase(createBundle.rejected, (state, action) => {
      state.data[action.meta.arg.cellId] = {
        loading: false,
        error: action.payload?.message,
      };
    });
  },
});

export const bundlesActions = {
  ...bundlesSlice.actions,
  createBundle,
};

export const bundlesReducer = bundlesSlice.reducer;

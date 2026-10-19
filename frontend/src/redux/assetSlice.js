import { createSlice } from "@reduxjs/toolkit";
import { assets as initialAssets } from "../data/mockData";

const assetSlice = createSlice({
  name: "assets",

  initialState: initialAssets,

  reducers: {
    addAsset: (state, action) => {
      state.push(action.payload);
    },

    updateAsset: (state, action) => {
      const index = state.findIndex(
        (asset) => asset.id === action.payload.id
      );

      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { addAsset, updateAsset } = assetSlice.actions;

export default assetSlice.reducer;
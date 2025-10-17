import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "channel",
  initialState: {
    channelData: null,
  },
  reducers: {
    setChannelData: (state, action) => {
      state.channelData = action.payload;
    },
    clearChannelData: (state) => {
      state.channelData = null;
    },
  },
});

export const { setChannelData, clearChannelData } = channelSlice.actions;
export default channelSlice.reducer;

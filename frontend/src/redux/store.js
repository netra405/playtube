import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice.js"
// import channelReducer from "./channelSlice";
import contentSlice from "./contentSlice.js"


export const store = configureStore({
    reducer:{
        user:userSlice,
        // channel: channelReducer, // ✅ Add this line
        content: contentSlice
    }
})


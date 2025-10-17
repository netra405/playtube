import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./userSlice.js"
import channelReducer from "./channelSlice";


export const store = configureStore({
    reducer:{
        user:userSlice,
        channel: channelReducer, // ✅ Add this line
    }
})


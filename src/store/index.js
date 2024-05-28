import {configureStore} from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import testSlice from "../slices/testSlice";


const store = configureStore({
    reducer:{
        users:userSlice,
        tests:testSlice
    },
    middleware:getDefaultMiddleware=> getDefaultMiddleware(),
    devTools:process.env.NODE_ENV !== 'production'
});

export default store;
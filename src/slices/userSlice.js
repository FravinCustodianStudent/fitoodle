import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user : {},
    status: "unlogged"
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        userLoaded: (state,action) => {state.user = action.payload
            state.status = "logged"
        },
        userDeleted:(state)=>{state.user = null
            state.status = "unlogged"}
    }
})

const {actions, reducer} = userSlice;

export default reducer;
export const {
    userLoaded,
    userDeleted,
} = actions;
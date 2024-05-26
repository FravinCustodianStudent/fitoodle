import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user: {},
    status: "unlogged"
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.status = "logged";
        },
        deleteUser: (state) => {
            state.user = {};
            state.status = "unlogged";
        }
    }
});

export const { setUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;

// Создаем селекторы для получения данных из состояния
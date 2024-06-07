import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    isEditable: false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchInStart: (state, action) => {
            state.loading = true;
        },
        fetchSuccess: (state, action) => {
            state.loading = false
            state.error = null;
            state.currentUser = action.payload;
        },
        fetchFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateToggle: (state, action) => {
            state.isEditable = !state.isEditable
        },
        deleteUser: (state, action) => {
            state.currentUser = null;
            state.loading = false;
        },
        logoutUser: (state, action) => {
            state.currentUser = null;
            state.loading = false;
        },
    }
})


export const { fetchFailure, fetchInStart, fetchSuccess, updateToggle, deleteUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
import {createSlice} from "@reduxjs/toolkit";



const userRedux = createSlice({
    name: "user",
    initialState: {
        currentUser: null,
        users: [],
        isFetching: false,
        error: null
    },
    reducers: {
        loginStart: (state) => {
            state.isFetching = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.currentUser = action.payload;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.isFetching = false;
            state.error = action.payload || "Login failed";
            state.currentUser = null;
        },
       logout: (state) => {
        state.currentUser = null;
      },

      //GET USERS
      getUsersStart:(state)=>{
        state.isFetching=true;
        state.error = false;
       },
       getUsersSuccess:(state,action)=>{
        state.isFetching=false;
        state.users=action.payload; 
       },
       getUsersFailure:(state)=>{
        state.isFetching=false;
        state.error = true;
       },
       // DELETE USER
       deleteUserStart: (state) => {
        state.isFetching = true;
        state.error = null;
       },
       deleteUserSuccess: (state, action) => {
        state.isFetching = false;
        state.users = state.users.filter(user => user._id !== action.payload);
        state.error = null;
       },
       deleteUserFailure: (state, action) => {
        state.isFetching = false;
        state.error = action.payload;
       },
    },
});

export const {
    loginFailure,
    loginStart,
    loginSuccess,
    logout,
    getUsersStart,
    getUsersSuccess,
    getUsersFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure
} = userRedux.actions;
export default userRedux.reducer;
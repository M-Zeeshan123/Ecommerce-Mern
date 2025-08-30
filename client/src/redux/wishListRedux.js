import { createSlice } from "@reduxjs/toolkit";



const wishListRedux = createSlice({
    name: "wishList",
    initialState: {
        products: [],
        quantity: 0,
    },
    reducers: {
        addWishList: (state, action) => {
            const existingProduct = state.products.find(
                item => item._id === action.payload._id
            );
            if (!existingProduct) {
                state.quantity += 1;
                state.products.push(action.payload);
            }
        },
        removeFromWishList: (state, action) => {
            state.products = state.products.filter(
                item => item._id !== action.payload
            );
            state.quantity -= 1;
        },
        clearWishList: (state) => {
            state.products = [];
            state.quantity = 0;
        },
    }
});


export const { addWishList, removeFromWishList, clearWishList } = wishListRedux.actions;
export default wishListRedux.reducer;
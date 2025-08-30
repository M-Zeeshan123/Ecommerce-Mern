import { createSlice } from "@reduxjs/toolkit";



const cartRedux = createSlice({
    name: "cart",
    initialState: {
        products: [],
        quantity: 0,
        total: 0,
    },
    reducers: {
        addProduct: (state, action) => {
            const existingProductIndex = state.products.findIndex(
                product => product._id === action.payload._id && product.size === action.payload.size
            );

            if (existingProductIndex !== -1) {
                // If product exists, update its quantity
                state.products[existingProductIndex].quantity += action.payload.quantity;
                state.total += action.payload.price * action.payload.quantity;
            } else {
                // If product doesn't exist, add it as new
                state.quantity += 1;
                state.products.push(action.payload);
                state.total += action.payload.price * action.payload.quantity;
            }
        },
        removeProduct: (state, action) => {
            const productToRemove = state.products.find(
                product => product._id === action.payload._id && product.size === action.payload.size
            );
            if (productToRemove) {
                state.quantity -= 1;
                state.total -= productToRemove.price * productToRemove.quantity;
                state.products = state.products.filter(
                    product => !(product._id === action.payload._id && product.size === action.payload.size)
                );
            }
        },
        clearCart: (state) => {
            state.products = [];
            state.quantity = 0;
            state.total = 0;
        },
    }
});




export const { addProduct, removeProduct, clearCart } = cartRedux.actions;
export default cartRedux.reducer;
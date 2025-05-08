import { createSlice } from "@reduxjs/toolkit";

const roundToTwoDecimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

const initialState = {
    cartItems: [],
    totalPrice: 0,
    totalQuantity: 0
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload
            const existingItem = state.cartItems.find(cartItem => cartItem.id === product.id)
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                state.cartItems.push({
                    id: product.id,
                    title: product.title,
                    price: roundToTwoDecimals(product.price),
                    description: product.description,
                    category: product.category,
                    image: product.image,
                    rating: product.rating,
                    quantity: 1
                })
            }

            state.totalQuantity++;
            state.totalPrice = roundToTwoDecimals(state.totalPrice + product.price);
        },

        removeFromCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.cartItems.find(cartItem => product.id === cartItem.id);
            if (product.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                const updatedCartItems = state.cartItems.filter(cartItem => cartItem.id !== product.id);
                state.cartItems = updatedCartItems;
            }

            state.totalQuantity--;
            state.totalPrice = roundToTwoDecimals(state.totalPrice - product.price);
        },

        clearCart: (state) => {
            state.cartItems = [],
            state.totalPrice = 0,
            state.totalQuantity = 0
        }
    }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
// store.js - Update this file in your redux folder
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';
import authReducer from './authSlice';
import ordersReducer from './ordersSlice';

const store = configureStore({
    reducer: {
        products: productsReducer,
        cart: cartReducer,
        auth: authReducer,
        orders: ordersReducer,
    }
});

export default store;
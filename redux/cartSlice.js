import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

// Round price to two decimal places
const roundToTwoDecimals = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (token, { rejectWithValue, getState }) => {
        try {
            const cartItems = await authService.getCart(token);
            console.log('Cart items fetched from server:', cartItems);
            return cartItems;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCart = createAsyncThunk(
    'cart/updateCart',
    async ({ token, items }, { rejectWithValue }) => {
        try {
            console.log('Updating cart on server with items:', items);
            await authService.updateCart(token, items);
            return items;
        } catch (error) {
            console.error('Error updating cart on server:', error);
            return rejectWithValue(error.message);
        }
    }
);

const initialState = {
    cartItems: [],
    totalPrice: 0,
    totalQuantity: 0,
    isLoading: false,
    error: null
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.cartItems.find(cartItem => cartItem.id === product.id);
            
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
                });
            }

            state.totalQuantity++;
            state.totalPrice = roundToTwoDecimals(state.totalPrice + product.price);
        },

        removeFromCart: (state, action) => {
            const product = action.payload;
            const existingItem = state.cartItems.find(cartItem => product.id === cartItem.id);
            
            if (!existingItem) return;
            
            if (existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            } else {
                state.cartItems = state.cartItems.filter(cartItem => cartItem.id !== product.id);
            }

            state.totalQuantity--;
            state.totalPrice = roundToTwoDecimals(state.totalPrice - product.price);
        },

        clearCart: (state) => {
            state.cartItems = [];
            state.totalPrice = 0;
            state.totalQuantity = 0;
        },
        
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Cart
            .addCase(fetchCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.isLoading = false;
                // Safely handle the cart items
                state.cartItems = action.payload || [];
                
                // Recalculate totals
                state.totalQuantity = state.cartItems.reduce((total, item) => 
                    total + (item.quantity || item.count || 0), 0);
                    
                state.totalPrice = roundToTwoDecimals(
                    state.cartItems.reduce((total, item) => 
                        total + ((item.price || 0) * (item.quantity || item.count || 0)), 0)
                );
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            
            // Update Cart
            .addCase(updateCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateCart.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    }
});

export const { addToCart, removeFromCart, clearCart, clearError } = cartSlice.actions;
export default cartSlice.reducer;
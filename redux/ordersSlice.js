// ordersSlice.js - Complete file

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../services/authService';

// Async thunks for order operations
export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (token, { rejectWithValue }) => {
    try {
      const orders = await authService.getOrders(token);
      return orders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ token, items }, { rejectWithValue }) => {
    try {
      const response = await authService.createOrder(token, items);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ token, orderId, isPaid, isDelivered }, { rejectWithValue }) => {
    try {
      console.log('Updating order status:', { orderID: orderId, isPaid, isDelivered });
      
      const response = await authService.updateOrder(token, orderId, isPaid, isDelivered);
      
      if (response.status !== 'OK') {
        throw new Error(response.message || 'Failed to update order status');
      }
      
      return { orderId, isPaid, isDelivered };
    } catch (error) {
      console.error('Error updating order:', error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  orders: [],
  newOrdersCount: 0,
  isLoading: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearOrdersCount: (state) => {
      state.newOrdersCount = 0;
    },
    clearOrdersError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
        
        // Count new/unpaid orders for the badge
        state.newOrdersCount = action.payload.filter(order => 
          order.is_paid === 0 && order.is_delivered === 0
        ).length;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.isLoading = false;
        state.newOrdersCount += 1; // Increment new orders count for badge
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Find the order and update its status
        const orderIndex = state.orders.findIndex(order => order.id === action.payload.orderId);
        if (orderIndex !== -1) {
          state.orders[orderIndex].is_paid = action.payload.isPaid;
          state.orders[orderIndex].is_delivered = action.payload.isDelivered;
        }
        
        // Recalculate new orders count
        state.newOrdersCount = state.orders.filter(order => 
          order.is_paid === 0 && order.is_delivered === 0
        ).length;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearOrdersCount, clearOrdersError } = ordersSlice.actions;
export default ordersSlice.reducer;
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        try{
            const response = await fetch('https://fakestoreapi.com/products');
            if (!response.ok){
                throw new Error(`Error fetching product data: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error){
            throw error;
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'products/fetchCategories',
    async() => {
        try{
            const response = await fetch('https://fakestoreapi.com/products/categories');
            if (!response.ok){
                throw new Error(`Error fetching category data: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error){
            throw error;
        }
    }
);

const initialState = {
    products: [],
    filteredProducts: [],
    selectedProduct: null,
    categories: [],
    isLoading: false,
    error: null
};

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        filterByCategory: (state, action) => {
            if (action.payload === 'all'){
                state.filteredProducts = state.products;
            } else {
                state.filteredProducts = state.products.filter(
                    (product) => (product.category === action.payload)
                );
            }
        },

        setSelectedProduct: (state, action) => {
            state.selectedProduct = action.payload;
        },

        clearError: (state) => {
            state.error= null;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
                state.error = null;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchCategories.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isLoading = false;
                state.categories = action.payload;
                state.error = null;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message
            });
    }
});

export const { filterByCategory, setSelectedProduct, clearError } = productsSlice.actions;
export default productsSlice.reducer;


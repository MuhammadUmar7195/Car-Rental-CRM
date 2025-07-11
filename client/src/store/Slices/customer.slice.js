import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    customers: [],
    singleCustomer: null,
    loading: false,
    error: null,
};

// Post a new customer
export const postCustomer = createAsyncThunk(
    "customer/postCustomer",
    async (customerData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/customer/add`,
                customerData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data.newCustomer;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Get all customers
export const getAllCustomers = createAsyncThunk(
    "customer/getAllCustomers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/customer/all`,
                { withCredentials: true }
            );         
            return response.data.customers;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Get single customer
export const getSingleCustomer = createAsyncThunk(
    "customer/getSingleCustomer",
    async (customerId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/customer/${customerId}`,
                { withCredentials: true }
            );            
            return response.data.customer;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Update a customer
export const updateCustomer = createAsyncThunk(
    "customer/updateCustomer",
    async ({ customerId, customerData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/customer/edit/${customerId}`,
                customerData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data.updatedCustomer;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers: {
        clearCustomerError: (state) => {
            state.error = null;
        },
        clearCustomers: (state) => {
            state.customers = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Post customer
            .addCase(postCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.customers.push(action.payload);
            })
            .addCase(postCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get all customers
            .addCase(getAllCustomers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllCustomers.fulfilled, (state, action) => {
                state.loading = false;
                state.customers = action.payload;
            })
            .addCase(getAllCustomers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Get single customer
            .addCase(getSingleCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.singleCustomer = null;
            })
            .addCase(getSingleCustomer.fulfilled, (state, action) => {
                state.loading = false;
                state.singleCustomer = action.payload;
                const index = state.customers.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                } else {
                    state.customers.push(action.payload);
                }
            })
            .addCase(getSingleCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.singleCustomer = null;
            })

            // Update customer
            .addCase(updateCustomer.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCustomer.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.customers.findIndex(c => c._id === action.payload._id);
                if (index !== -1) {
                    state.customers[index] = action.payload;
                }
                if (state.singleCustomer && state.singleCustomer._id === action.payload._id) {
                    state.singleCustomer = action.payload;
                }
            })
            .addCase(updateCustomer.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearCustomerError, clearCustomers } = customerSlice.actions;
export default customerSlice.reducer;

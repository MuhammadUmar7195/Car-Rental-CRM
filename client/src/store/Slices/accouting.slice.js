import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    accountingData: [],
    assignCustomerAccounting: [],
    loading: false,
    error: null,
};

// Get all customers
export const getAllAccountingData = createAsyncThunk(
    "accounting/getAllAccountingData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/accounting/all`,
                { withCredentials: true }
            );
            return response.data.accounting;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Delete a specific accounting entry
export const deleteAccountingEntry = createAsyncThunk(
    "accounting/deleteAccountingEntry",
    async (entryId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/accounting/${entryId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to assign the detail with customerId
export const assignCustomerToAccounting = createAsyncThunk(
    "accounting/assignCustomerToAccounting",
    async ({ customerId, accountingId }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/accounting/assign-customer`,
                { customerId, accountingId },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to get accounting by customerId
export const getAccountingByCustomerId = createAsyncThunk(
    "accounting/getAccountingByCustomerId",
    async (customerId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/accounting/customer/${customerId}`,
                { withCredentials: true }
            );    
            console.log(response?.data?.payments);   
            return response?.data?.payments || []; 
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const accountingSlice = createSlice({
    name: "accounting",
    initialState,
    reducers: {
        clearAccountingError: (state) => {
            state.error = null;
        },
        clearAccounting: (state) => {
            state.accountingData = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllAccountingData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllAccountingData.fulfilled, (state, action) => {
                state.loading = false;
                state.accountingData = action.payload;
            })
            .addCase(getAllAccountingData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete Accounting Entry
            .addCase(deleteAccountingEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAccountingEntry.fulfilled, (state, action) => {
                state.loading = false;
                state.accountingData = state.accountingData.filter(
                    (entry) => entry._id !== action.meta.arg
                );
            })
            .addCase(deleteAccountingEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Assign Customer to Accounting
            .addCase(assignCustomerToAccounting.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(assignCustomerToAccounting.fulfilled, (state, action) => {
                state.loading = false;
                const updatedEntry = action.payload.data; 
                const entryIndex = state.accountingData.findIndex(
                    (entry) => entry._id === updatedEntry._id
                );
                if (entryIndex !== -1) {
                    state.accountingData[entryIndex] = updatedEntry;
                }
            })
            .addCase(assignCustomerToAccounting.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Accounting by Customer ID
            .addCase(getAccountingByCustomerId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAccountingByCustomerId.fulfilled, (state, action) => {
                state.loading = false;
                state.assignCustomerAccounting = action.payload;
            })
            .addCase(getAccountingByCustomerId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAccountingError, clearAccounting } = accountingSlice.actions;
export default accountingSlice.reducer;

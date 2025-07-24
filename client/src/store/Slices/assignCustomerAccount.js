import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    assignCustomerAccountData: [],
    loading: false,
    error: null,
};

// Assign customer to accounting entry
export const postAssignCustomerAccount = createAsyncThunk(
    "accounting/postAssignCustomerAccount",
    async ({ customerId, accountingId }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/assign-customer/add`,
                { customerId, accountingId },
                { withCredentials: true }
            );
            console.log("Assign Customer Account Response:", response.data);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to delete accounting entry by their ID
export const deleteAccountingEntry = createAsyncThunk(
    "accounting/deleteAccountingEntry",
    async (accountingId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/assign-customer/delete/${accountingId}`,
                { withCredentials: true }
            );
            return response.data;
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
            state.assignCustomerAccountData = [];
        },
    },
    extraReducers: (builder) => {
        builder
            //post assign customer account
            .addCase(postAssignCustomerAccount.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postAssignCustomerAccount.fulfilled, (state, action) => {
                state.loading = false;
                state.assignCustomerAccountData = action.payload;
            })
            .addCase(postAssignCustomerAccount.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //delete accounting entry
            .addCase(deleteAccountingEntry.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteAccountingEntry.fulfilled, (state, action) => {
                state.loading = false;
                state.assignCustomerAccountData = state.assignCustomerAccountData.filter(
                    (entry) => entry._id !== action.payload._id
                );
            })
            .addCase(deleteAccountingEntry.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAccountingError, clearAccounting } = accountingSlice.actions;
export default accountingSlice.reducer;

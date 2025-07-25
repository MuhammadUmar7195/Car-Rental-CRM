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
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to get assign payment by customer Id
export const getAssignAccountByCustomerId = createAsyncThunk(
    "accounting/getAssignCustomerAccountByCustomerId",
    async (customerId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/assign-customer/customer/${customerId}`,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const assignCustomerAccountSlice = createSlice({
    name: "assignCustomerAccount",
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
            //get assign customer account by customer Id
            .addCase(getAssignAccountByCustomerId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAssignAccountByCustomerId.fulfilled, (state, action) => {
                state.loading = false;
                state.assignCustomerAccountData = action.payload || [];
            })
            .addCase(getAssignAccountByCustomerId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearAccountingError, clearAccounting } = assignCustomerAccountSlice.actions;
export default assignCustomerAccountSlice.reducer;

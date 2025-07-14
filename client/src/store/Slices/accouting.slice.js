import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    accountingData: [],
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
            console.log(response.data?.accounting);           
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
            });
    }
});

export const { clearAccountingError, clearAccounting } = accountingSlice.actions;
export default accountingSlice.reducer;

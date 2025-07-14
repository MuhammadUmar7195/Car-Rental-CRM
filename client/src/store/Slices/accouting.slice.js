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
            });
    }
});

export const { clearAccountingError, clearAccounting } = accountingSlice.actions;
export default accountingSlice.reducer;

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    rentals: [],
    singleRental: null,
    loading: false,
    error: null,
};

// Async thunk to get all rentals
export const getAllRental = createAsyncThunk(
    "rental/getAllRental",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/all`,
                { withCredentials: true }
            );
            return response.data.rentals;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Async thunk to get a single rental by ID
export const getSingleRental = createAsyncThunk(
    "rental/getSingleRental",
    async (rentalId, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/rental/${rentalId}`,
                { withCredentials: true }
            );
            return response.data.rental;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const rentalSlice = createSlice({
    name: "rental",
    initialState,
    reducers: {
        clearRentalError: (state) => {
            state.error = null;
        },
        clearRentals: (state) => {
            state.rentals = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All Rentals
            .addCase(getAllRental.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllRental.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.rentals = action.payload;
            })
            .addCase(getAllRental.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get Single Rental
            .addCase(getSingleRental.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.singleRental = null;
            })
            .addCase(getSingleRental.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.singleRental = action.payload;
            })
            .addCase(getSingleRental.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.singleRental = null;
            });
    },
});

export const { clearRentalError, clearRentals } = rentalSlice.actions;
export default rentalSlice.reducer;
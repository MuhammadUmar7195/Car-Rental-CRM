import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    fleets: [],
    loading: false,
    error: null,
};

// Async thunk to post fleet data
export const postFleet = createAsyncThunk(
    "fleet/postFleet",
    async (fleetData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/fleet/add`,
                fleetData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data.newFleet;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to get all fleets
export const getAllFleets = createAsyncThunk(
    "fleet/getAllFleets",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/fleet/all`,
                { withCredentials: true }
            );
            return response.data.fleets;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);


const fleetSlice = createSlice({
    name: "fleet",
    initialState,
    reducers: {
        clearFleetError: (state) => {
            state.error = null;
        },
        clearFleets: (state) => {
            state.fleets = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Post Fleet
            .addCase(postFleet.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postFleet.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.fleets.push(action.payload);
            })
            .addCase(postFleet.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Get All Fleets
            .addCase(getAllFleets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllFleets.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.fleets = action.payload;
            })
            .addCase(getAllFleets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearFleetError, clearFleets } = fleetSlice.actions;
export default fleetSlice.reducer;
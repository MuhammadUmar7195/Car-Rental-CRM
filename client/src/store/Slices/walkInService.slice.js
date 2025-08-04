import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  services: [],
  loading: false,
  error: null,
};

// Async thunk to post walk-in service data
export const postWalkInService = createAsyncThunk(
  "walkInService/postWalkInService",
  async (walkInService, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/walkInService/add`,
        walkInService,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      return response.data.newService;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Async thunk to get all walk-in services
export const getAllWalkInServices = createAsyncThunk(
  "walkInService/getAllWalkInServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/walkInService/get`,
        { withCredentials: true }
      );
      return response.data.serviceOrders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const walkInServiceSlice = createSlice({
  name: "walkInService",
  initialState,
  reducers: {
    clearServiceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Post walk-in service order
      .addCase(postWalkInService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postWalkInService.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.services.push(action.payload);
        }
      })
      .addCase(postWalkInService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all walk-in service orders 
      .addCase(getAllWalkInServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWalkInServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllWalkInServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });    
  }
});

export const { clearServiceError } = walkInServiceSlice.actions;

export default walkInServiceSlice.reducer;
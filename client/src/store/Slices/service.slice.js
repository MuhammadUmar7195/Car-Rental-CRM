import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  services: [],
  singleService: null,
  loading: false,
  error: null,
};

// Async thunk to post service data
export const postService = createAsyncThunk(
  "service/postService",
  async (serviceData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/service/add`,
        serviceData,
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

// Async thunk to get all services
export const getAllServices = createAsyncThunk(
  "service/getAllServices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/service/all`,
        { withCredentials: true }
      );
      return response.data.serviceOrders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Async thunk to update the status of a service order
export const updateServiceStatus = createAsyncThunk(
  "service/updateServiceStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/service/status/${id}`,
        { status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Async thunk to delete single service order by id
export const deleteServiceOrder = createAsyncThunk(
  "service/deleteServiceOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/service/${id}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

// Async thunk to get a service order by fleetId
export const getFleetServiceOrders = createAsyncThunk(
  "service/getFleetServiceOrders",
  async (fleetId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/service/fleet/${fleetId}`,
        { withCredentials: true }
      );
      return response.data.serviceOrders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);

const serviceSlice = createSlice({
  name: "service",
  initialState,
  reducers: {
    resetServiceState: (state) => {
      state.services = [];
      state.singleService = null;
      state.loading = false;
      state.error = null;
    },
    clearServiceError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Post service order
      .addCase(postService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postService.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.services.push(action.payload);
        }
      })
      .addCase(postService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get all service orders 
      .addCase(getAllServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllServices.fulfilled, (state, action) => {
        state.loading = false;
        state.services = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update service order status
      .addCase(updateServiceStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateServiceStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.serviceOrder) {
          const index = state.services.findIndex(service => service._id === action.payload.serviceOrder._id);
          if (index !== -1) {
            state.services[index] = action.payload.serviceOrder;
          }
        }
      })
      .addCase(updateServiceStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete service order
      .addCase(deleteServiceOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteServiceOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different response structures from backend
        const deletedId = action.payload?.serviceOrder?._id || action.payload?.deletedId || action.meta.arg;
        if (deletedId) {
          state.services = state.services.filter(service => service._id !== deletedId);
        }
      })
      .addCase(deleteServiceOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get service by fleetId
      .addCase(getFleetServiceOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFleetServiceOrders.fulfilled, (state, action) => {  
        state.loading = false;
        state.services = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getFleetServiceOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetServiceState, clearServiceError } = serviceSlice.actions;

export default serviceSlice.reducer;
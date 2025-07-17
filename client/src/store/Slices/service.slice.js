import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
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
    async (serviceData, {rejectWithValue}) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/service/add`,
                serviceData,
                {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                }
            );
            return response.data.newService;
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
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postService.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postService.fulfilled, (state, action) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(postService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetServiceState } = serviceSlice.actions;

export default serviceSlice.reducer;
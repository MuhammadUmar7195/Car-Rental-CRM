import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    inventory: [],
    singleInventory: null,
    loading: false,
    error: null,
};

//Aysnc thunk to post inventory data
export const postInventory = createAsyncThunk(
    "inventory/postInventory",
    async (inventoryData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/add`,
                inventoryData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data.newInventory;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to get all inventory
export const getAllInventory = createAsyncThunk(
    "inventory/getAllInventory",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/all`,
                { withCredentials: true }
            );

            return response.data.inventory;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to get a single inventory by ID
export const getSingleInventory = createAsyncThunk(
    "inventory/getSingleInventory",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/get/${id}`,
                { withCredentials: true }
            );
            return response.data.inventoryItem;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to update inventory by ID
export const updateInventoryByID = createAsyncThunk(
    "inventory/updateInventoryByID",
    async ({ inventoryId, inventoryData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/${inventoryId}`,
                inventoryData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data.updatedInventory;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

//Async thunk to dlete the inventory 
export const deleteInventory = createAsyncThunk(
    "inventory/deleteInventory",
    async (inventoryId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/inventory/${inventoryId}`,
                { withCredentials: true }
            );
            return response.data.message;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

const inventorySlice = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        clearInventoryError: (state) => {
            state.error = null;
        },
        clearInventory: (state) => {
            state.inventory = [];
        }
    },
    extraReducers: (builder) => {
        builder
            //post inventory 
            .addCase(postInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(postInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.inventory.push(action.payload);
            })
            .addCase(postInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //get all inventory 
            .addCase(getAllInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.inventory = action.payload;
            })
            .addCase(getAllInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //get single inventory by ID
            .addCase(getSingleInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getSingleInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.singleInventory = action.payload;
            })
            .addCase(getSingleInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //update inventory by ID
            .addCase(updateInventoryByID.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateInventoryByID.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.inventory.findIndex(
                    (item) => item._id === action.payload._id
                );
                if (index !== -1) {
                    state.inventory[index] = action.payload;
                }
                if (state.singleInventory && state.singleInventory._id === action.payload._id) {
                    state.singleInventory = action.payload;
                }
            })
            .addCase(updateInventoryByID.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //delete inventory
            .addCase(deleteInventory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteInventory.fulfilled, (state, action) => {
                state.loading = false;
                state.inventory = state.inventory.filter(
                    (item) => item._id !== action.meta.arg
                );
            })
            .addCase(deleteInventory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearInventoryError, clearInventory } = inventorySlice.actions;
export default inventorySlice.reducer;
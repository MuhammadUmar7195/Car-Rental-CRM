import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: JSON.parse(localStorage.getItem("userInfo")) || null,
    loading: false,
    error: null,
};

// Async thunk for user login
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/login`,
                userData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.admin));
            return response.data.admin;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Login failed");
        }
    }
);

// Async Thunk for user registration
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/register`,
                userData,
                { withCredentials: true }
            );
            localStorage.setItem("userInfo", JSON.stringify(response.data.admin));
            return response.data.admin;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Registration failed");
        }
    }
);

// Async Thunk for forgot-password
export const forgotPassword = createAsyncThunk(
    "auth/forgotPassword",
    async (email, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/forgot-password`,
                { email },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data; // usually just a message
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Forgot password failed");
        }
    }
);

// Async Thunk for verify password
export const verifyPassword = createAsyncThunk(
    "auth/verifyPassword",
    async ({ otp, email }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/verify-password`,
                { email, otp },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Verification failed");
        }
    }
);

// Async Thunk for reset password
export const resetPassword = createAsyncThunk(
    "auth/resetPassword",
    async ({ email, newPassword, confirmPassword }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/reset-password`,
                { email, newPassword, confirmPassword },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response.data; // usually just a message
        } catch (error) {
            return rejectWithValue(error.response.data.message || "Reset password failed");
        }
    }
);

// Thunk for logout
export const logoutUser = createAsyncThunk(
    "auth/logoutUser",
    async (_, { rejectWithValue }) => {
        try {
            await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/admin/logout`,
                {},
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Logout failed");
        }
    }
);

// Auth slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            localStorage.removeItem("userInfo");
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Registration failed";
            })
            // Forgot Password
            .addCase(forgotPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Forgot password failed";
            })
            // Verify Password
            .addCase(verifyPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Verification failed";
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Reset password failed";
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.loading = false;
                state.error = null;
                localStorage.removeItem("userInfo");
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Logout failed";
            });
    },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
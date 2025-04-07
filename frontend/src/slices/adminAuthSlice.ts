import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminAuthService, { Admin, Token } from "./services/adminAuth";

export interface AdminAuthState {
  accessToken: Token | null;
  adminProfile: Admin | null;
  loginLoading: boolean;
  profileLoading: boolean;
}

const initialState: AdminAuthState = {
  accessToken: null,
  adminProfile: null,
  loginLoading: false,
  profileLoading: false,
};

export type SignInInputs = {
  phoneNumber: string;
  password: string;
};

// Async thunk for admin login
export const loginAdmin = createAsyncThunk(
  "adminauth/login",
  async (arg: SignInInputs) => {
    const { phoneNumber, password } = arg;
    const result = await adminAuthService.login(phoneNumber, password);
    return result;
  },
);

// Async thunk for getting admin profile
export const getAdminProfile = createAsyncThunk(
  "adminauth/getAdminProfile",
  async (arg: { token: string }) => {
    const { token } = arg;
    const result = await adminAuthService.getProfile(token);
    return result;
  },
);

const adminauthSlice = createSlice({
  name: "adminauth",
  initialState,
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.adminProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Admin login handling
      .addCase(loginAdmin.pending, (state) => {
        state.loginLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, { payload }: any) => {
        state.loginLoading = false;
        state.accessToken = payload; // Assuming token is returned in payload
      })
      .addCase(loginAdmin.rejected, (state) => {
        state.loginLoading = false;
      })
      // Admin profile handling
      .addCase(getAdminProfile.pending, (state) => {
        state.profileLoading = true;
      })
      .addCase(getAdminProfile.fulfilled, (state, { payload }) => {
        state.profileLoading = false;
        state.adminProfile = payload; // Set the fetched admin profile
      })
      .addCase(getAdminProfile.rejected, (state) => {
        state.profileLoading = false;
      });
  },
});

export const { logout } = adminauthSlice.actions;
export default adminauthSlice.reducer;

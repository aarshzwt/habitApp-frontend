import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    email: string;
    role: string;
    id: number;
}
interface Payload {
    user: User;
    token: string;
    refreshToken: string;
}

interface AuthState {
    isLoggedIn: boolean;
    user: User | null;
    token: string | null;
    isHydrated: boolean;
    refreshToken: string | null;

}

const initialState: AuthState = {
    isLoggedIn: false,
    user: null,
    token: null,
    refreshToken: null,
    isHydrated: false,

};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<Payload>) {
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.refreshToken = action.payload.refreshToken;

            localStorage.setItem("user", JSON.stringify(action.payload.user));
            localStorage.setItem("token", action.payload.token);
            localStorage.setItem("refreshToken", action.payload.refreshToken)
        },
        logout(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.token = null;

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken")
        },
        hydrateAuth: (state) => {
            state.isHydrated = true;
        }
    },
});

export const { login, logout, hydrateAuth } = authSlice.actions;
export default authSlice.reducer;

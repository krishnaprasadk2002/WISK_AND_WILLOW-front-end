import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./login.reducer";

export const selectUserState = createFeatureSelector<AuthState>('user')

export const selectUser = createSelector(
    selectUserState,
    (state)=>state.user
)

export const selectToken = createSelector(
    selectUserState,
    (state) => state.token
)
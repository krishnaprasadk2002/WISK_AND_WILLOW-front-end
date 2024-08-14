import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./login.reducer";
import { AppState } from "../app.state";

// const selectAuth = (state:AppState)=>state.auth
// const selectAuth = createFeatureSelector<AppState>('auth');


// export const selectUser = createSelector(
//     selectAuth,
//     (state)=>state.user
// )

// export const selectToken = createSelector(
//     selectAuth,
//     (state) => state.token
// )



export const selectAuth = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuth,
  (state: AuthState) => state.user
);

export const selectToken = createSelector(
  selectAuth,
  (state: AuthState) => state.token
);
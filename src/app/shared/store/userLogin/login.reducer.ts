import { createReducer, on } from '@ngrx/store';
import * as LoginAction from '../userLogin/login.actions';

export interface AuthState {
  user: any | null;
  token: string | null;
  error: any | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(LoginAction.loginSuccess, (state, { user }) => ({
    ...state,
    user,
    error: null,
  })),
  
  on(LoginAction.loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    error,  
  }))
);

import { createReducer, on } from '@ngrx/store';
import { loginFailure, loginSuccess } from './login.actions';


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
  on(loginSuccess, (state, { user }) => {
    console.log(user,"FROM REDUCERR");
    
    return{
      ...state,
      user:user,
      token:user,
      error: null,
    }
  }),
  
  on(loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    token: null,
    error,  
  }))
);

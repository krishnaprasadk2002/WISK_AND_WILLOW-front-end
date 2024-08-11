import { userLogin } from "./login.model";
import { User } from "../../../core/models/user.model";
import { createAction, props } from '@ngrx/store';


export const login = createAction('[Auth] Login',props<{formData:{email:string,password:string}}>())
export const loginSuccess = createAction('[Auth] Login Success',props<{user:User}>())
export const loginFailure = createAction('[Auth] Login Failed',props<{error:any}>())
import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { AuthServicesService } from '../../../core/services/users/auth-services.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import * as  LoginAction from '../userLogin/login.actions'
import { UserservicesService } from '../../../core/services/users/userservices.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';




@Injectable()
export class AuthEffects {

  constructor(private actions$: Actions, private authService: AuthServicesService, private userService:UserservicesService,private toasterService:ToastrService,private router:Router ) { }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginAction.login),
      switchMap(({ formData: { email, password } }) => 
        this.authService.userLogin(email, password).pipe(
          map((response: any) => {
            console.log(response);

  
            this.userService.setUsertoLocalstorage(response);
            return LoginAction.loginSuccess({ user: response.userData });
          }),
          catchError((error) => of(LoginAction.loginFailure({ error })))
        )
      )
    )
  );
}
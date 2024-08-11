import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {  provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptros/auth.interceptor';
import { provideState, provideStore } from '@ngrx/store';
import { authReducer } from './shared/store/userLogin/login.reducer';
import { AuthEffects } from './shared/store/userLogin/login.effects';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';







export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:"top"})),
     provideHttpClient(withInterceptors([authInterceptor])), 
     provideToastr(),
     provideStoreDevtools(),
     provideStore({user:authReducer}),
     provideState({name:'user',reducer:authReducer}),
     provideEffects(AuthEffects)
    ]
};

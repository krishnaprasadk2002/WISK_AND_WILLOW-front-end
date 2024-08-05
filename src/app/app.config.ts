import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { ExtraOptions, provideRouter, RouterFeatures, withInMemoryScrolling } from '@angular/router';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptros/auth.interceptor';





export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes, withInMemoryScrolling({scrollPositionRestoration:"top"})),provideHttpClient(withInterceptors([authInterceptor])), provideToastr()]
};

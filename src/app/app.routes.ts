import { Routes } from '@angular/router';

export const routes: Routes = [

    // userSide routes
    {
     path:'',
     redirectTo:'home',
     pathMatch:'full'
    },
    {
        path:'home',
        loadComponent:()=>import('./pages/user/home/home.component').then(a=>a.HomeComponent)
    },
    {
        path:'services',
        loadComponent:()=>import('./pages/user/services-page/services-page.component').then(a=>a.ServicesPageComponent)
    },
    {
        path:'wedding',
        loadComponent:()=>import('./pages/user/wedding-event/wedding-event.component').then(a=>a.WeddingEventComponent)
    },
    {
        path:"login",
        loadComponent:()=>import('./pages/user/user-login/user-login.component').then(a=>a.UserLoginComponent)
    },
    {
        path:"register",
        loadComponent:()=>import('./pages/user/user-register/user-register.component').then(a=>a.UserRegisterComponent)
    },
    {
        path:"otp",
        loadComponent:()=>import('./pages/user/otp-page/otp-page.component').then(a=>a.OtpPageComponent)
    }
];

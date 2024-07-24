import { Routes } from '@angular/router';

export const routes: Routes = [
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
    }
];

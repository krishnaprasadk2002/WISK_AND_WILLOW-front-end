import { Routes } from '@angular/router';
import { HomeComponent } from './pages/user/home/home.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AuthenticationComponent } from './pages/user/authentication/authentication.component';
import { UserLoginComponent } from './pages/user/user-login/user-login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponent } from './pages/employee/employee-dashboard/employee-dashboard.component';
import { EmployeeLoginComponent } from './pages/employee/employee-login/employee-login.component';
import { EmployeeRegisterComponent } from './pages/employee/employee-register/employee-register.component';
import { AdminSideBarComponent } from './shared/widgets/admin-side-bar/admin-side-bar.component';
import { AdminAuthComponent } from './pages/admin/admin-auth/admin-auth.component';

export const routes: Routes = [

    //userSide
    {
        path: '', component: HomeComponent, children: [
            {
                path: '',
                loadComponent: () => import('./pages/user/dashboard/dashboard.component').then(a => a.DashboardComponent)
            },
            {
                path: 'services',
                loadComponent: () => import('./pages/user/services-page/services-page.component').then(a => a.ServicesPageComponent)
            },
            {
                path: 'wedding',
                loadComponent: () => import('./pages/user/wedding-event/wedding-event.component').then(a => a.WeddingEventComponent)
            },
            {
                path: 'user-profile',
                loadComponent: () => import('./pages/user/user-profile/user-profile.component').then(a => a.UserProfileComponent)
            }
        ]
    },
    {
        path: "", component: AuthenticationComponent, children: [
            {
                path: "login",
                component:UserLoginComponent
            },
            {
                path: "register",
                loadComponent: () => import('./pages/user/user-register/user-register.component').then(a => a.UserRegisterComponent)
            },
            {
                path: "otp",
                loadComponent: () => import('./pages/user/otp-page/otp-page.component').then(a => a.OtpPageComponent)
            },
            {
                path: "edit-profile",
                loadComponent: () => import('./pages/user/edit-profile/edit-profile.component').then(a => a.EditProfileComponent)
            },
        ]
    },


    //Admin side
    {
        path: 'admin',
        component: AdminDashboardComponent,
        
    },

    {path:'admin',
        component:AdminAuthComponent,
        children:[
            {path:'login',component:AdminLoginComponent}
        ]
        
    },

    //Employee side
    {
        path:'employee',
        component:AuthenticationComponent,
        children:[
            {path:'',component:EmployeeDashboardComponent},
            {path:'login',component:EmployeeLoginComponent},
            {path:'register',component:EmployeeRegisterComponent}
        ]
    }

];

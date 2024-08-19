import { mapToCanActivate, Routes } from '@angular/router';
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
import { AdminAuthComponent } from './pages/admin/admin-auth/admin-auth.component';
import { ForgetpasswordComponent } from './pages/user/forgetpassword/forgetpassword.component';
import { ResetPasswordComponent } from './pages/user/reset-password/reset-password.component';
import { ServicesPageComponent } from './pages/user/services-page/services-page.component';
import { EventComponent } from './pages/user/event/event.component';
import { UserProfileComponent } from './pages/user/user-profile/user-profile.component';
import { UserRegisterComponent } from './pages/user/user-register/user-register.component';
import { OtpPageComponent } from './pages/user/otp-page/otp-page.component';
import { EditProfileComponent } from './pages/user/edit-profile/edit-profile.component';
import { UserManagementComponent } from './pages/admin/user-management/user-management.component';
import { EventManagementComponent } from './pages/admin/event-management/event-management.component';
import { EmployeeManagmentComponent } from './pages/admin/employee-managment/employee-managment.component';
import { PackagesComponent } from './pages/admin/packages/packages.component';
import { PackageDetailsComponent } from './pages/admin/package-details/package-details.component';
import { UserPackagesComponent } from './pages/user/user-packages/user-packages.component';
import { FoodComponent } from './pages/admin/food/food.component';
import { GalleryComponent } from './pages/admin/gallery/gallery.component';
import { adminGuard } from './core/guards/admin.guard';
import { adminLogGuard } from './core/guards/admin-log.guard';
import { ErrorComponent } from './shared/reusable/error/error.component';

export const routes: Routes = [


     {
      path:'error/:errorCode',
      component:ErrorComponent
     },

    //userSide
    {
        path: '', component: HomeComponent, children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'services',
                component: ServicesPageComponent
            },
            {
                path: 'events/:name',
                component: EventComponent
            },
            {
                path: 'user-profile',
                component: UserProfileComponent
            },
            {
                path: 'user-packages',
                component: UserPackagesComponent
            }
        ]
    },
    {
        path: "", component: AuthenticationComponent, children: [
            {
                path: "login",
                component: UserLoginComponent
            },
            {
                path: "register",
                component: UserRegisterComponent
            },
            {
                path: "otp",
                component: OtpPageComponent
            },
            {
                path: "edit-profile",
                component: EditProfileComponent
            },
            {
                path: 'forgetpassword',
                component: ForgetpasswordComponent
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent
            }
        ]
    },

    //Admin side
    {
        path: 'admin',
        component: AdminComponent,
        canActivateChild:[adminGuard],
        children: [
            {
                path: '',
                component: AdminDashboardComponent
            },
            {
                path: 'user-management',
                component: UserManagementComponent,
            },
            {
                path: 'event-managemnt',
                component: EventManagementComponent
            },
            {
                path: 'employee-managemnt',
                component: EmployeeManagmentComponent
            },
            {
                path: 'package-management',
                component: PackagesComponent
            },
            {
                path: 'package-details/:id',
                component: PackageDetailsComponent
            },
            {
                path: 'food-management',
                component: FoodComponent
            },
            {
                path: 'gallery-management',
                component: GalleryComponent
            }
        ]

    },

    {
        path: 'admin',
        component: AdminAuthComponent,
        children: [
            { path: 'login', 
            component: AdminLoginComponent,
            canActivate:[adminLogGuard],
         },

        ]

    },

    //Employee side
    {
        path: 'employee',
        component: AuthenticationComponent,
        children: [
            { path: '', component: EmployeeDashboardComponent },
            { path: 'dashboard', component: EmployeeDashboardComponent },
            { path: 'login', component: EmployeeLoginComponent },
            { path: 'register', component: EmployeeRegisterComponent }
        ]
    }

];

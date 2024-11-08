import { mapToCanActivate, Routes } from '@angular/router';
import { HomeComponent } from './pages/user/home/home.component';
import { DashboardComponent } from './pages/user/dashboard/dashboard.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login.component';
import { AuthenticationComponent } from './pages/user/authentication/authentication.component';
import { UserLoginComponent } from './pages/user/user-login/user-login.component';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { EmployeeDashboardComponentm } from './pages/employee/employee-dashboard/employee-dashboard.component';
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
import { PackagesComponent } from './pages/admin/packages/packages.component';
import { PackageDetailsComponent } from './pages/admin/package-details/package-details.component';
import { UserPackagesComponent } from './pages/user/user-packages/user-packages.component';
import { FoodComponent } from './pages/admin/food/food.component';
import { GalleryComponent } from './pages/admin/gallery/gallery.component';
import { adminGuard } from './core/guards/admin.guard';
import { adminLogGuard } from './core/guards/admin-log.guard';
import { ErrorComponent } from './shared/reusable/error/error.component';
import { userGuard } from './core/guards/user.guard';
import { userAuthGuard } from './core/guards/user-auth.guard';
import { GalleryCategoryComponent } from './pages/user/gallery-category/gallery-category.component';
import { UserGalleryComponent } from './pages/user/user-gallery/user-gallery.component';
import { SpecificPackageComponent } from './pages/user/specific-package/specific-package.component';
import { BookingComponent } from './pages/user/booking/booking.component';
import { PaymentSuccessComponent } from './pages/user/payment-success/payment-success.component';
import { PaymentFailureComponent } from './pages/user/payment-failure/payment-failure.component';
import { BookingManagementComponent } from './pages/admin/booking-management/booking-management.component';
import { BannerManagementComponent } from './pages/admin/banner-management/banner-management.component';
import { ChatComponent } from './pages/user/chat/chat.component';
import { ChatManagementComponent } from './pages/admin/chat-management/chat-management.component';
import { EmployeeManagmentComponent } from './pages/admin/employee-managment/employee-managment.component';
import { HomeEmployeeComponent } from './pages/employee/home/home.component';
import { EmployeeAuthComponent } from './pages/employee/employee-auth/employee-auth.component';
import { employeeGuard } from './core/guards/employee.guard';
import { employeeAuthGuard } from './core/guards/employee-auth.guard';
import { ContactComponent } from './pages/user/contact/contact.component';

export const routes: Routes = [


     {
      path:'error/:errorCode',
      component:ErrorComponent
     },
     {
        path:'payment-success',
        component:PaymentSuccessComponent
     },
     {
       path:'payment-failure',
       component:PaymentFailureComponent
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
                component: UserProfileComponent,
                canActivate:[userGuard]
            },
            {
                path: 'user-packages',
                component: UserPackagesComponent
            },
            {
                path:'package/:name',
                component:SpecificPackageComponent
            },
            {
                path:'gallery-category',
                component:GalleryCategoryComponent
            },
            {
                path:'user-gallery/:category',
                component:UserGalleryComponent
            },
            {
                path:'booking',
                component:BookingComponent,
                canActivate:[userGuard]
            },
            {
                path:'chat',
                component:ChatComponent,
                canActivate:[userGuard]
            },
            {
                path:'contact',
                component:ContactComponent
            }
        ]
    },
    {
        path: "", component: AuthenticationComponent, children: [
            {
                path: "login",
                component: UserLoginComponent,
                canActivate:[userAuthGuard]
            },
            {
                path: "register",
                component: UserRegisterComponent,
                canActivate:[userAuthGuard]
            },
            {
                path: "otp",
                component: OtpPageComponent,
                canActivate:[userAuthGuard]
            },
            {
                path: "edit-profile",
                component: EditProfileComponent
            },
            {
                path: 'forgetpassword',
                component: ForgetpasswordComponent,
                canActivate:[userAuthGuard]
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
            },
            {
                path:'booking-managemnt',
                component:BookingManagementComponent
            },
            {
                path:'banner-mangement',
                component:BannerManagementComponent
            },
            {
                path:'chat-management',
                component:ChatManagementComponent
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
        component: EmployeeAuthComponent,
        children: [
            { path: 'login', component: EmployeeLoginComponent,
                canActivate:[employeeGuard], 
            },
            { path: 'register', component: EmployeeRegisterComponent,
                canActivate:[employeeGuard], 
            }
        ]
    },
    {
        path:'employee',
        component:HomeEmployeeComponent,
        canActivateChild:[employeeAuthGuard],
        children:[
            { path: '', component: EmployeeDashboardComponentm },
            { path: 'dashboard', component: EmployeeDashboardComponentm}
        ]

    }

];

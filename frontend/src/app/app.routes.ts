import { NgModule } from '@angular/core';
import { RouterModule,Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AdminLoginComponent } from './components/admin-login/admin-login.component';
import { AdminHomeComponent } from './components/admin-home/admin-home.component';
import { AdminAddUserComponent } from './components/admin-add-user/admin-add-user.component';
import { AdminEditUserComponent } from './components/admin-edit-user/admin-edit-user.component';
import { isAdminAuthGuard } from './authRoutes/is-admin-auth.guard';
import { isUserAuthGuard } from './authRoutes/is-user-auth.guard';


export const routes: Routes = [
    { path: 'login', component: LoginComponent},
    { path: 'register', component: RegisterComponent },
    { path: '', component: HomeComponent, canActivate: [isUserAuthGuard], },
    { path: 'adminlogin', component: AdminLoginComponent},
    { path: 'adminHome', component: AdminHomeComponent,canActivate: [isAdminAuthGuard], },
    { path: 'adminAddUser', component: AdminAddUserComponent,canActivate: [isAdminAuthGuard], },
    { path: 'adminEditUser/:userId', component: AdminEditUserComponent,canActivate: [isAdminAuthGuard], },

];

import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';

export const routes: Routes = [
  {
    path:"",
    redirectTo:"home",
    pathMatch:"full"
  },

  {
    path:'home',
    component:HomeComponent,
    canActivate:[authGuard]
  },

  {
    path:'authentication',
    children:[
      {
        path:'login',
        component:LoginComponent
      }
    ]
  }
]

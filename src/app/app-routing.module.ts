import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';

const routes: Routes = [
  { path: 'museum', redirectTo: "/", pathMatch: 'full'},
  { path: 'login', component: LoginComponent, data: { title: 'Логовање' } },
  { path: 'registration', component: RegistrationComponent, data: { title: 'Регистрација' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
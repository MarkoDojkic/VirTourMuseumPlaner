import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ExhibitsComponent } from './main/exhibits/exhibits.component';
import { ProfileComponent } from './main/profile/profile.component';
import { ToursComponent } from './main/tours/tours.component';

const routes: Routes = [
  { path: 'exhibits', component: ExhibitsComponent, data: { title: 'Експонати' } },
  { path: 'login', component: LoginComponent, data: { title: 'Логовање' } },
  { path: 'registration', component: RegistrationComponent, data: { title: 'Регистрација' } },
  { path: 'tours', component: ToursComponent, data: { title: 'Мој обиласци' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Профил' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ExhibitionComponent } from './main/exhibitions/exhibitions.component';
import { ProfileComponent } from './main/profile/profile.component';
import { ToursComponent } from './main/tours/tours.component';

const routes: Routes = [
  { path: '', redirectTo: "/exhibitions", pathMatch: 'full' },
  { path: 'exhibitions', component: ExhibitionComponent, data: { title: 'Поставке' } },
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
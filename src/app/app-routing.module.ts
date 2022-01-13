import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ExhibitionComponent } from './main/exhibitions/exhibitions.component';
import { PlanerComponent } from './main/planer/planer.component';
import { ProfileComponent } from './main/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: "/exhibitions", pathMatch: 'full' },
  { path: 'exhibitions', component: ExhibitionComponent, data: { title: 'Поставке' } },
  { path: 'login', component: LoginComponent, data: { title: 'Логовање' } },
  { path: 'registration', component: RegistrationComponent, data: { title: 'Регистрација' } },
  { path: 'planer', component: PlanerComponent, data: { title: 'Мој обиласци' } },
  { path: 'profile', component: ProfileComponent, data: { title: 'Профил' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
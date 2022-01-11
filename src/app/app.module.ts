import { MatPaginatorIntl } from '@angular/material/paginator';
import { NotifierModule } from 'angular-notifier';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CarouselModule } from 'primeng/carousel';
import { MaterialModule } from './material.module';
import { getSerbianPaginatorIntl } from './services/MatPaginatorLocalization';
import { HttpClientModule } from '@angular/common/http';
import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { RegistrationComponent } from './auth/registration/registration.component';
import { ProfileComponent } from './main/profile/profile.component';
import { ExhibitionComponent } from './main/exhibitions/exhibitions.component';
import { ToursComponent } from './main/tours/tours.component';
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerLocalization } from './services/MatDatepickerLocalization';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    ExhibitionComponent,
    ToursComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    FormsModule,
    NgxSliderModule,
    ReactiveFormsModule,
    NotifierModule.withConfig({
      position: {
        horizontal: {
          position: 'right',
          distance: 12
        },
        vertical: {
          position: 'top',
          distance: 12,
          gap: 10
        }
      },
      theme: 'material',
      behaviour: {
        autoHide: 3000,
        onClick: 'hide',
        onMouseover: 'pauseAutoHide',
        showDismissButton: true,
        stacking: 8
      },
      animations: {
        enabled: true,
        show: {
          preset: 'slide',
          speed: 300,
          easing: 'ease'
        },
        hide: {
          preset: 'fade',
          speed: 300,
          easing: 'ease',
          offset: 50
        },
        shift: {
          speed: 300,
          easing: 'ease'
        },
        overlap: 150
      }
    }),
    HttpClientModule,
    CarouselModule,
    MatNativeDateModule,
    NgxMaterialTimepickerModule.setLocale("sr-RS")
  ],
  providers: [Title, { provide: MatPaginatorIntl, useValue: getSerbianPaginatorIntl() }, { provide: MAT_DATE_LOCALE, useValue: 'sr-sp' }, { provide: DateAdapter, useClass: MatDatepickerLocalization }],
  bootstrap: [AppComponent]
})
export class AppModule { }

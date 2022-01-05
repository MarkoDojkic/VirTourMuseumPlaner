import { CryptoService } from './../crypto/crypto.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { Visitor } from 'src/app/model/visitor';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor(private http: HttpClient, private cs:CryptoService, private router:Router) { }

  register(registrationForm: NgForm): void {
    
    var newVisitor: Visitor = {
      id: "",
      name: registrationForm.controls["name"].value,
      surname: registrationForm.controls["surname"].value,
      email: registrationForm.controls["email"].value,
      password: this.cs.encrypt(environment.cryptoKey, registrationForm.controls["password"].value),
      favorites: [],
      phone: registrationForm.controls["phone"].hasError('required') ? undefined : registrationForm.controls["phone"].value,
      mobilePhone: registrationForm.controls["mobilePhone"].hasError('required') ? undefined : registrationForm.controls["mobilePhone"].value,
      planer: []
    };

    this.http.post("http://localhost:21682/register", newVisitor, {responseType: 'text'}).toPromise().then((resolve) => {
      console.log(resolve);
      Swal.fire({
        title: "Регистрација успешна!",
        text: "Успешно сте креирали нови налог.\nСада се можете улоговати\nса унетом адресом електронске поште и лозинком.\nНакон изласка бићете\nпреусмерени на страницу за логовање!",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
      }).then(() => this.router.navigate(["/login"]));
    }, (reject) => {
      console.log(reject);
      Swal.fire({
        title: "Регистрација неуспешна!",
        text: "Највероватније већ постоји корисник са наведеном адресом електронске поште.\nУколико сте заборавили лознику затражите промену лозинке!",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
      });
    });
  }
}

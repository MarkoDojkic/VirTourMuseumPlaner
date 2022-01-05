import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { Visitor } from '../../model/visitor';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {
  constructor(private http: HttpClient, private cs: CryptoService, private router: Router) { }

  login(loginForm: NgForm): void {

    this.http.post<Visitor>("http://localhost:21682/login", { "email": loginForm.controls["email"].value }, { responseType: 'json' }).toPromise().then((resolve) => {
      if (this.cs.encrypt(environment.cryptoKey, loginForm.controls["password"].value).indexOf(resolve.password.toString()) === -1) {
        Swal.fire({
          title: "Логовање неуспешно!",
          text: "Проверите поново да ли сте исправно унели\nВашу адресу електронске поште и лозинку!",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "У реду",
        });

        return;
      }

      Swal.fire({
        title: "Логовање успешно!",
        text: "Успешно сте се улоговали!",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
      }).then(() => {

        sessionStorage.setItem("loggedInUser", this.cs.encrypt(environment.cryptoKey, resolve.id.toString()));
        this.router.navigate(["/profile"]);
      });
    }, (reject) => {
      console.log(reject);
      Swal.fire({
        title: "Логовање неуспешно!",
        text: "Проверите поново да ли сте исправно унели\nВашу адресу електронске поште и лозинку!",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
      });
    });
  }

  signOut(): void {
    sessionStorage.clear();
    this.router.navigate(["login"]);
  }
}

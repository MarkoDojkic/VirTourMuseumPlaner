import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Visitor } from '../../model/visitor';
import { CryptoService } from '../crypto/crypto.service';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private cs: CryptoService, private loginService: LoginService) { }

  getLoggedInVisitor(): Promise<Visitor> {
    return this.http.get<Visitor>("http://localhost:21682/getUser/" + this.cs.decrypt(environment.cryptoKey, sessionStorage.getItem("loggedInUser")!.toString()), { responseType: 'json' }).toPromise();
  }

  updateData(visitorData: Visitor, hasEditedLoginData: Boolean, isPasswordChanged: Boolean) {
    visitorData.id = this.cs.decrypt(environment.cryptoKey, sessionStorage.getItem("loggedInUser")!.toString());
    if (isPasswordChanged) visitorData.password = this.cs.encrypt(environment.cryptoKey, visitorData.password.toString());
    this.http.post("http://localhost:21682/update/" + visitorData.id, visitorData, { responseType: 'text' }).toPromise();
    if (hasEditedLoginData) this.loginService.signOut();
  }
}

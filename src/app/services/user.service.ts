import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Visitor } from '../model/visitor';
import { CryptoService } from './crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private cs: CryptoService, private router: Router) { }

  updateData(visitorData: Visitor) {
    throw new Error('Method not implemented.');
  }
  updatePassword(newPassword: string) {
    throw new Error('Method not implemented.');
  }
  getVisitor(id: string): Promise<Visitor> {
    return this.http.get<Visitor>("http://localhost:21682/getUser/" + this.cs.decrypt(environment.cryptoKey, id), { responseType: 'json' }).toPromise();
  }
}

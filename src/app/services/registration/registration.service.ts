import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  constructor() { }

  register(registrationForm: Form): Boolean {
    //register new user to array or json file
    return false;
  }
}

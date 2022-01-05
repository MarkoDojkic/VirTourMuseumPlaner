import { Component, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { RegistrationService } from 'src/app/services/registration/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})

export class RegistrationComponent implements OnInit {

  constructor(public registrationService: RegistrationService) { }

  ngOnInit(): void { }

  /*checkRequiredFields(form: FormGroup): boolean {
    var isAllValid: boolean = true;

    Object.keys(form.controls).forEach(id => {
      if(form.controls[id]?.hasError('required') || form.controls[id]?.hasError('pattern')) isAllValid = false;
    });

    return isAllValid && !form.controls["password"]?.hasError("minlength") && !form.controls["passwordRepeat"]?.hasError("matched");
  } //NOT WORKING
  */

  checkPasswordRepeat(pass: NgModel, repeatPass: NgModel): void {
    if (pass.value != repeatPass.value) repeatPass.control.setErrors({ "matched": true });
    else repeatPass.control.setErrors(null);
  }
}
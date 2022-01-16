import { Visitor } from 'src/app/model/visitor';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgModel, NgForm, AbstractControl, FormControl } from '@angular/forms';
import { VisitorService } from 'src/app/services/visitor/visitor.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userName!: string;
  userSurname!: string;
  userEmail!: string;
  userPhone!: string;
  userMobilePhone!: string;

  favorites: Array<string> = new Array<string>();
  avaiableFavorites: Array<string> = ["Техника 60-их", "Техника 70-их", "Техника 80-их", "Техника 90-их", "Савремена техника", "Рачунари", "Техника за забаву", "Музички уређаји", "Телевизори", "Телефони", "Рачунарска опрема"];
  filteredFavorites: Observable<Array<string>> = new Observable<Array<string>>();
  favoritesInputControl: FormControl = new FormControl();

  @ViewChild("favoritesInput") favoritesInput!: ElementRef<HTMLInputElement>;

  constructor(private visitorService: VisitorService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.updateFieldData();
    }, 1000);

    this.filteredFavorites = this.favoritesInputControl.valueChanges
      .pipe(map((favoriteProduct: string | null) => favoriteProduct ? this.avaiableFavorites.filter(avaiableFavorite =>
        avaiableFavorite.toLowerCase().indexOf(favoriteProduct.toLowerCase()) === 0) : this.avaiableFavorites.slice())
      );
  }

  checkPasswordRepeat(pass: NgModel, repeatPass: NgModel): void {
    if (pass.value != repeatPass.value) repeatPass.control.setErrors({ "matched": true });
    else repeatPass.control.setErrors(null);
  }

  onUpdate(form: NgForm): void {
    var visitorData!: Visitor;
    var hasEditedLoginData = false;
    var isPasswordChanged = false;

    this.visitorService.getLoggedInVisitor().then((resolve) => visitorData! = resolve).then(() => {
      if (form.controls["name"].dirty && form.controls["name"].valid) visitorData!.name = form.controls["name"].value;
      if (form.controls["surname"].dirty && form.controls["surname"].valid) visitorData!.surname = form.controls["surname"].value;
      if (form.controls["email"].dirty && form.controls["email"].valid) {
        visitorData!.email = form.controls["email"].value;
        hasEditedLoginData = true;
      }
      if (form.controls["phone"].dirty && form.controls["phone"].valid) visitorData!.phone = form.controls["phone"].value;
      if (form.controls["mobilePhone"].dirty && form.controls["mobilePhone"].valid) visitorData!.mobilePhone = form.controls["mobilePhone"].value;
      if (form.controls["password"].dirty && form.controls["password"].valid
        && form.controls["password"].value === form.controls["passwordRepeat"].value) {
        visitorData.password = form.controls["password"].value;
        hasEditedLoginData = true;
        isPasswordChanged = true;
      }

      visitorData.favorites = this.favorites;

      this.visitorService.updateData(visitorData!, hasEditedLoginData, isPasswordChanged);

      setTimeout(() => {
        form.controls["name"].reset();
        form.controls["surname"].reset();
        form.controls["email"].reset();
        form.controls["phone"].reset();
        form.controls["mobilePhone"].reset();
        form.controls["password"].reset();
        form.controls["passwordRepeat"].reset();
        this.updateFieldData();
      })
    });
  }

  updateFieldData() {
    this.visitorService.getLoggedInVisitor().then((resolve) => {
      this.userName = resolve.name.toString();
      this.userSurname = resolve.surname.toString();
      this.userEmail = resolve.email.toString();
      this.userPhone = resolve.phone!.toString();
      this.userMobilePhone = resolve.mobilePhone!.toString();
      this.favorites = resolve.favorites!;
    }, (reject) => {
      console.log(reject);
    });
  }

  addSelectedFavorite(event: MatAutocompleteSelectedEvent): void {
    var selectedFavorite: string = this.avaiableFavorites.find(favorite => event.option.viewValue.startsWith(favorite, 0))!;
    if (!this.favorites.includes(selectedFavorite, 0))
      this.favorites.push(selectedFavorite);
    this.favoritesInputControl.setValue("", { emitEvent: true }); //emitEvent: true will fire valueChanges
    this.favoritesInput.nativeElement.value = "";
  }

  removeSelectedFavorite(selectedFavoriteProduct: string): void {
    this.favorites.splice(this.favorites.indexOf(selectedFavoriteProduct), 1);
  }

}

import { Visitor } from 'src/app/model/visitor';
import { Component, OnInit } from '@angular/core';
import { NgModel, NgForm, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  uid!: string;
  userName!: string;
  userSurname!: string;
  userEmail!: string;
  userPhone!: string;
  userMobilePhone!: string;

  /*favoriteProducts: Array<string> = new Array<string>();
  avaiableFavoriteProducts: Array<string> = ["Монокристални соларни панели", "Поликристални соларни панели",
    "Аморфни соларни панели", "Електрична возила", "PWM контролери пуњења акумулатора",
    "MPPT контролери пуњења акумулатора", "OFF-Grid инвертори", "ON-Grid инвертори", "Хибридни инвертори",
    "Хоризонтални ветрогенератори", "Вертикални ветрогенератори", "Оловни акумулатори",
    "Никл базирани акумулатори", "Литијумски акумулатори", "Специјални акумулатори"];
  filteredFavoriteProducts: Observable<Array<string>> = new Observable<Array<string>>();
  favoriteProductsInputControl: FormControl = new FormControl();

  @ViewChild("favoriteProductInput") favoriteProductInput: ElementRef<HTMLInputElement>;
  */
  constructor(private userService:UserService) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.updateFieldData();
    }, 1000);

    /* this.filteredFavoriteProducts = this.favoriteProductsInputControl.valueChanges
      .pipe(map((favoriteProduct: string | null) => favoriteProduct ? this.avaiableFavoriteProducts.filter(avaiableFavoriteProduct =>
        avaiableFavoriteProduct.toLowerCase().indexOf(favoriteProduct.toLowerCase()) === 0) : this.avaiableFavoriteProducts.slice())
    ); */
  }

  checkPasswordRepeat(pass: NgModel, repeatPass: NgModel): void {
    if (pass.value != repeatPass.value) repeatPass.control.setErrors({ "matched": true });
    else repeatPass.control.setErrors(null);
  }

  onUpdate(form: NgForm): void {
    const newName: string = (form.controls["name"].valid && form.controls["name"].dirty) ? form.controls["name"].value : this.userName;
    const newSurname: string = (form.controls["surname"].valid && form.controls["surname"].dirty) ? form.controls["surname"].value : this.userSurname;
    var visitorData!: Visitor;

    this.userService.getVisitor(sessionStorage.getItem("loggedInUserId")!).then((resolve) => visitorData! = resolve);
    
    if (!newName.includes(this.userName) || !newSurname.includes(this.userSurname)) {
      visitorData!.name = newName;
      visitorData!.surname = newSurname;
    }
        
    visitorData!.mobilePhone = (form.controls["mobilePhone"].valid && form.controls["mobilePhone"].dirty) ? form.controls["mobilePhone"].value : visitorData!.mobilePhone;

    if (form.controls["email"].dirty && form.controls["email"].valid) {
      visitorData!.email = form.controls["email"].value;
      form.controls["email"].reset();
    }

    if (form.controls["password"].dirty && form.controls["password"].valid
          && form.controls["password"].value === form.controls["passwordRepeat"].value) {
      this.userService.updatePassword(form.controls["password"].value);
      form.controls["password"].reset();
      form.controls["passwordRepeat"].reset();
      return;
    }

    //updatedFirestoreData["favoriteProducts"] = this.favoriteProducts;

    this.userService.updateData(visitorData!);

    form.controls["name"].reset();
    form.controls["surname"].reset();
    form.controls["email"].reset();
    form.controls["password"].reset();
    form.controls["passwordRepeat"].reset();

    this.updateFieldData();
  }

  updateFieldData() {
    this.userService.getVisitor(sessionStorage.getItem("loggedInUser")!.toString()).then((resolve) => {
      this.uid = resolve.id.toString();
      this.userName = resolve.name.toString();
      this.userSurname = resolve.surname.toString();
      this.userEmail = resolve.email.toString();
      this.userPhone = resolve.phone!.toString();
      this.userMobilePhone = resolve.mobilePhone!.toString();
    }, (reject) => {  
      console.log(reject);
    });
  }

  /*addSelectedFavoriteProduct(event: MatAutocompleteSelectedEvent): void {
    var selectedFavoriteProduct: string = this.avaiableFavoriteProducts.find(favoriteProduct => event.option.viewValue.startsWith(favoriteProduct, 0));
    if(!this.favoriteProducts.includes(selectedFavoriteProduct, 0))
      this.favoriteProducts.push(selectedFavoriteProduct);
    this.favoriteProductsInputControl.setValue("", { emitEvent: true }); //emitEvent: true will fire valueChanges
    this.favoriteProductInput.nativeElement.value = "";
  }

  removeSelectedFavoriteProduct(selectedFavoriteProduct: string): void {
    const index = this.favoriteProducts.indexOf(selectedFavoriteProduct);
    this.favoriteProducts.splice(index, 1);
  }*/

}

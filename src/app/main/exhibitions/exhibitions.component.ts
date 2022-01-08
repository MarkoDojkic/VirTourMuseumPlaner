import { ExhibitionService } from './../../services/Exhibition/exhibition.service';
import { Exhibition } from '../../model/exhibition';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Exhibit } from 'src/app/model/exhibit';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exhibitions',
  templateUrl: './exhibitions.component.html',
  styleUrls: ['./exhibitions.component.scss']
})
export class ExhibitionComponent implements OnInit {

  exhibitions!: Array<Exhibition>;
  filteredExhibitions!: Array<Exhibition>;
  filterShow = false;
  carouselResponsiveOptions;

  //Filtering values
  /*minPrice: number;
  maxPrice: number;
  minInStock: number;
  voltages: Map<string, boolean>;
  amperages: Map<string, boolean>;
  wattages: Map<string, boolean>;
  amperhours: Map<string, boolean>;
  minDrivingRange: number;
  maxDrivingRange: number;
  priceSliderOptions: Options;
  priceSliderOptionsDrivingRange: Options;
  minRating: number = 0;*/

  //To order when using keyvalue pipe in amperages * otherwise it'll sort like strings *
  /*orderByNumber = (a: KeyValue<number, string>, b: KeyValue<number, string>): number => {
    return parseInt(a.key.toString().slice(0, a.key.toString().length - 1))
              < parseInt(b.key.toString().slice(0, b.key.toString().length - 1)) ? -1 : 1;
  };
  
  _transformer = (node: CategoryNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
      node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
      this._transformer, node => node.level, node => node.expandable, node => node.children);

  categoriesSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  hasChild = (_: number, node: FlatNode) => node.expandable;
  */
  constructor(private exhibitionService: ExhibitionService, private ns: NotifierService, private router: Router) {
    this.carouselResponsiveOptions = [
      {
        breakpoint: '1920px',
        numVisible: 4,
        numScroll: 4
      },
      {
        breakpoint: '1366px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    //this.onResize(null);
    this.displayExhibitions();
  }

  /* onResize(_event: any | null): void {
    if (window.innerWidth > 1920)
      this.numberOfColumns = 5
    else if (window.innerWidth <= 1920 && window.innerWidth > 1300)
      this.numberOfColumns = 4
    else if (window.innerWidth <= 1300 && window.innerWidth > 1000)
      this.numberOfColumns = 3
    else if (window.innerWidth <= 1000 && window.innerWidth > 670)
      this.numberOfColumns = 2
    else if (window.innerWidth <= 670)
      this.numberOfColumns = 1
  } */

  returnTotalCost(exhibits: Array<Exhibit>): Number {
    return exhibits.map(e => e.price).reduce((sum, price) => sum + price, 0);
  }

  returnTotalTime(exhibits: Array<Exhibit>): Number {
    return exhibits.map(e => e.time).reduce((sum, time) => sum + time, 0);
  }

  displayExhibitions(): void {
    this.exhibitionService.getAll().then(resolve => {
      this.exhibitions = resolve;
      console.log(resolve.map(r => r.exhibits));
    }).catch((reject) => console.log(reject));
    setTimeout(() => { /* To give time to firestore to get items */
      /*this.selectedCategory = category;
      this.voltages = this.amperages = this.wattages = this.amperhours = null;

      switch (this.selectedCategory) {
        case "Монокристални":
          this.rowHeight = "1:2.15";
          this.voltages = new Map([["12V", true], ["24V/36V", true], ["48V", true]]);
          break;
        case "Поликристални":
          this.rowHeight = "1:2.1";
          this.voltages = new Map([["12V", true], ["24V", true], ["36V", true]]);
          break;
        case "Аморфни":
          this.rowHeight = "1:2.22";
          this.voltages = new Map([["12V", true], ["24V", true], ["36V", true], ["48V", true], ["84V", true]]);
          break;
        case "PWM":
          this.rowHeight = "1:2.58";
          this.voltages = new Map([["12V/24V", true], ["48V", true]]);
          this.amperages = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимална струја пуњења: "),
              temp.lastIndexOf(" Подразумевани напон искључења"))
            temp = temp.slice(26, temp.length);
            return [temp, true];
          }));
          break;
        case "MPPT":
          this.rowHeight = "1:2.22";
          this.amperages = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимална струја пуњења: "),
              temp.lastIndexOf(" Ефективност конверзије"))
            temp = temp.slice(26, temp.length);
            return [temp, true];
          }));
          break;
        case "OFF-Grid":
          this.rowHeight = "1:2.02";
          this.wattages = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Излазна снага: "),
              temp.lastIndexOf(" Излазна снага у"))
            temp = temp.slice(15, temp.length);
            return [temp, true];
          }));
          break;
        case "ON-Grid":
          this.rowHeight = "1:2.22";
          this.wattages = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимала препоручена снага система:"),
              temp.lastIndexOf(" Улазни напон:"))
            temp = temp.slice(36, temp.length);
            return [temp, true];
          }));
          break;
        case "Хибридни":
          this.rowHeight = "1:2.36";
          this.wattages = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Снага система: "),
              temp.lastIndexOf(" Снага система у пику"))
            temp = temp.slice(15, temp.length);
            return [temp, true];
          }));
          break;
        case "Хоризонтални":
          this.rowHeight = "1:2.84";
          this.wattages = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Излазна снага: "),
              temp.lastIndexOf(" Максимална излазна снага"))
            temp = temp.slice(15, temp.length);
            return [temp, true];
          }));
          break;
        case "Вертикални":
          this.rowHeight = "1:2.75";
          this.wattages = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Излазна снага: "),
              temp.lastIndexOf(" Максимална излазна снага"))
            temp = temp.slice(15, temp.length);
            return [temp, true];
          }));
          break;
        case "Оловни":
          this.rowHeight = "1:1.85";
          this.amperhours = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимални капацитет: "),
              temp.lastIndexOf(" Радна температура"))
            temp = temp.slice(22, temp.length);
            return [temp, true];
          }));
          break;
        case "Никл базирани":
          this.rowHeight = "1:1.9";
          this.amperhours = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимални капацитет: "),
              temp.lastIndexOf(" Радна температура"))
            temp = temp.slice(22, temp.length);
            return [temp, true];
          }));
          break;
        case "Литијумски":
          this.rowHeight = "1:1.97";
          this.amperhours = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимални капацитет: "),
              temp.lastIndexOf(" Максимална дозвољена"))
            temp = temp.slice(22, temp.length);
            return [temp, true];
          }));
          break;
        case "Специјални":
          this.rowHeight = "1:2.1";
          this.amperhours = new Map(this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимални капацитет: "),
              temp.lastIndexOf(" Максимална дозвољена"))
            temp = temp.slice(22, temp.length);
            return [temp, true];
          }));
          break;
        case "Електрична возила":
          this.rowHeight = "1:1.85";
          const minDR = Math.min.apply(Math, this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Домет при пуној батерији: "),
              temp.lastIndexOf(" km Број путника:"))
            temp = temp.slice(26, temp.length);
            return parseInt(temp);
          }));
          const maxDR = Math.max.apply(Math, this.items.map(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Домет при пуној батерији: "),
              temp.lastIndexOf(" km Број путника:"))
            temp = temp.slice(26, temp.length);
            return parseInt(temp);
          }));

          this.minDrivingRange = minDR;
          this.maxDrivingRange = maxDR;

          this.priceSliderOptionsDrivingRange = {
            floor: minDR,
            ceil: maxDR,
            step: (maxDR - minDR) / 10,
            translate: (value: number, label: LabelType): string => {
              switch (label) {
                case LabelType.Low:
                  return "<b>" + value + " километара</b>";
                case LabelType.High:
                  return "<b>" + value + " километара</b>";
                default:
                  return value + " километара";
              }
            },
            hideLimitLabels: true
          };
          break;
        default: this.rowHeight = "1:1";
      }*/

      this.filteredExhibitions = this.exhibitions;
      /*const min = Math.min.apply(Math, this.exhibitions.map(exhibition => { return getMinimalExhibitionPrice(exhibition); }));
      const max = Math.max.apply(Math, this.exhibitions.map(exhibition => { return getMaximalExhibitionPrice(exhibition); }));

      this.minPrice = min;
      this.maxPrice = max;

      this.priceSliderOptions = {
        floor: min,
        ceil: max,
        step: (max - min) / 10,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return "<b>" + value + " динара</b>";
            case LabelType.High:
              return "<b>" + value + " динара</b>";
            default:
              return value + " динара";
          }
        },
        hideLimitLabels: true
      };*/
    }, 1000);
  }

  /* applyFilters(): void {
    this.filteredItems = this.items.filter(item => { // First filter -> use all items array
      return item.price >= this.minPrice && item.price <= this.maxPrice;
    })
  
    if (this.minInStock != null || this.minInStock != undefined)
      this.filteredItems = this.filteredItems.filter(item => item.leftInStock >= this.minInStock); //Every other filter -> use filtered items array
  
    this.filteredItems.forEach(item => {
      var sumOfRatings: number = 0;
      var totalReviews: number = 0;
  
      this.fs.getAllReviewsForProduct(item.id).then(reviews => {
        reviews.forEach(review => {
          sumOfRatings += review.rating
          totalReviews++;
        });
      }).then(() => {
        if (totalReviews !== 0 && Math.round(sumOfRatings / totalReviews) < this.minRating)
          this.filteredItems.splice(this.filteredItems.findIndex(currentItem => currentItem.id === item.id), 1)
      });
    });
  
    if (this.selectedCategory === "Монокристални" || this.selectedCategory === "Поликристални" || this.selectedCategory === "Аморфни") {
      for (const key of Array.from(this.voltages.keys())) {
        if (key === "12V" && !this.voltages.get(key)) this.filterOutVoltage(12, 24);
        if (key === "24V" && !this.voltages.get(key)) this.filterOutVoltage(24, 36);
        if (key === "24V/36V" && !this.voltages.get(key)) this.filterOutVoltage(24, 48);
        if (key === "36V" && !this.voltages.get(key)) this.filterOutVoltage(36, 48);
        if (key === "48V" && !this.voltages.get(key)) this.filterOutVoltage(48, 84);
        if (key === "84V" && !this.voltages.get(key)) this.filterOutVoltage(84, 100);
      }
    }
  
    if (this.selectedCategory === "PWM") {
      for (const key of Array.from(this.voltages.keys())) {
        if (!this.voltages.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Напон система: "),
              temp.lastIndexOf(" Максимални улазни напон:"))
            temp = temp.slice(15, temp.length);
            return temp !== key;
          });
        }
      }
  
      for (const key of Array.from(this.amperages.keys())) {
        if (!this.amperages.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимална струја пуњења: "),
              temp.lastIndexOf(" Подразумевани напон искључења"))
            temp = temp.slice(26, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "MPPT") {
      for (const key of Array.from(this.amperages.keys())) {
        if (!this.amperages.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимална струја пуњења: "),
              temp.lastIndexOf(" Ефективност конверзије"))
            temp = temp.slice(26, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "OFF-Grid") {
      for (const key of Array.from(this.wattages.keys())) {
        if (!this.wattages.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Излазна снага: "),
              temp.lastIndexOf(" Излазна снага у"))
            temp = temp.slice(15, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "ON-Grid") {
      for (const key of Array.from(this.wattages.keys())) {
        if (!this.wattages.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимала препоручена снага система:"),
              temp.lastIndexOf(" Улазни напон:"))
            temp = temp.slice(36, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "Хибридни") {
      for (const key of Array.from(this.wattages.keys())) {
        if (!this.wattages.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Снага система: "),
              temp.lastIndexOf(" Снага система у пику"))
            temp = temp.slice(15, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "Хоризонтални" || this.selectedCategory === "Вертикални") {
      for (const key of Array.from(this.wattages.keys())) {
        if (!this.wattages.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Излазна снага: "),
              temp.lastIndexOf(" Максимална излазна снага"))
            temp = temp.slice(15, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "Оловни" || this.selectedCategory === "Никл базирани") {
      for (const key of Array.from(this.amperhours.keys())) {
        if (!this.amperhours.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимални капацитет: "),
              temp.lastIndexOf(" Радна температура"))
            temp = temp.slice(22, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "Литијумски" || this.selectedCategory === "Специјални") {
      for (const key of Array.from(this.amperhours.keys())) {
        if (!this.amperhours.get(key)) {
          this.filteredItems = this.filteredItems.filter(item => {
            var temp = item.description;
            temp = temp.slice(temp.lastIndexOf("Максимални капацитет: "),
              temp.lastIndexOf(" Максимална дозвољена"))
            temp = temp.slice(22, temp.length);
            return temp !== key;
          });
        }
      }
    }
  
    if (this.selectedCategory === "Електрична возила") {
      this.filteredItems = this.filteredItems.filter(item => {
        var temp = item.description;
        temp = temp.slice(temp.lastIndexOf("Домет при пуној батерији: "),
          temp.lastIndexOf(" km Број путника:"))
        temp = temp.slice(26, temp.length);
        return parseInt(temp) >= this.minDrivingRange && parseInt(temp) <= this.maxDrivingRange;
      })
    }
  } */

  /*updateVoltages(key: string, value: MatCheckboxChange): void {
    this.voltages.set(key, value.checked);
    this.applyFilters();
  }
  
  updateAmperages(key: string, value: MatCheckboxChange): void {
    this.amperages.set(key, value.checked);
    this.applyFilters();
  }
  
  updateWattages(key: string, value: MatCheckboxChange): void {
    this.wattages.set(key, value.checked);
    this.applyFilters();
  }
  
  updateAmperhours(key: string, value: MatCheckboxChange): void {
    this.amperhours.set(key, value.checked);
    this.applyFilters();
  }
  
  updateRating(minRating: number): void {
    this.minRating = minRating;
    for (let i = 1; i <= 5; i++) {
      document.querySelector("#shopRating_" + i).innerHTML = i <= minRating ? "star" : "star_outline";
    }
  }
  
  filterOutVoltage(voltageMin: number, voltageMax: number): void {
    this.filteredItems = this.filteredItems.filter(item => {
      var temp = item.description;
      temp = temp.slice(temp.lastIndexOf("Максимални радни напон: "),
        temp.lastIndexOf("V Струја кратког споја:"))
      temp = temp.slice(24, temp.length);
  
      return parseInt(temp) < voltageMin || parseInt(temp) > voltageMax;
    });
  }
  */
  addToPlaner(exhibitId: string) {
    if (sessionStorage.getItem("loggedInUser") == null) {
      Swal.fire({
        title: "Нисте улоговани!",
        text: "Морате бити улоговани да бисте додали експонат у планер!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Преусмери ме на страницу за логовање",
        cancelButtonText: "Одустани",
      }).then(result => {
        if (result.isConfirmed) this.router.navigate(["/login"]); //If clicked on confirm button
      });

      return;
    }
    //Implement logic here
    /*
  
    new Observable((observer) => {
      this.idb.getObjectStoreItem(this.idb.getIDB(this.localStorageDb),
        "orderedProducts", this.fs.loggedInUserId + "_" + product.id)
        .then(value => { observer.next(value); })
        .catch(error => { observer.next(error); });
  
      return {
        unsubscribe() {
          observer.remove(observer);
        }
      }
    }).subscribe(data => {
  
      var newQuantity = ((data as Array<Item>).length !== 1) ? 0 : data[0]["orderedQuantity"];
  
      if (newQuantity === product.leftInStock) this.ns.notify("error", "Није могуће додати производ! Већ се у корпи налази максимална количина!");
      else this.ns.notify("success", "Производ успешно додат у корпу!");
  
      newQuantity = newQuantity + product.orderedQuantity > product.leftInStock ? product.leftInStock : newQuantity + product.orderedQuantity;
      this.idb.putObjectStoreItem(this.idb.getIDB(this.localStorageDb),
        "orderedProducts", {
        id: this.fs.loggedInUserId + "_" + product.id, title: product.title, orderedQuantity: newQuantity,
        price: product.price, description: product.description, inStock: product.leftInStock, orderedBy: this.fs.loggedInUserId
      });
  
      this.ns.notify("info", "Стање у корпи за производ „" + product.title + "“ је: " + newQuantity + " комад(а)");
    }); */
  }

  showReviews(exhibitId: string) {
    this.exhibitionService.getReviewsForExhibit(exhibitId).then(response => {
      var html: string = `<div _ngcontent-bjf-c268="" fxlayout="column" fxlayoutalign="center stretch" fxlayoutgap="2%" ng-reflect-fx-layout="column" ng-reflect-fx-layout-align="center stretch" ng-reflect-fx-layout-gap="2%" style="flex-direction: column; box-sizing: border-box; display: flex; place-content: stretch center; align-items: stretch; max-width: 100%;" class="mat-card">`;
      var notReviewedCount: number = 0;

      response.forEach(review => {
        if (review.rating === 0 && review.comment === "") {
          notReviewedCount++;
          return;
        } //Not reviewed yet so skip

        setTimeout(() => {

          html += `<section _ngcontent-bjf-s268="" fxlayout="column" fxlayoutalign="center stretch" fxlayoutgap="1%" ng-reflect-fx-layout="column" ng-reflect-fx-layout-align="center stretch" ng-reflect-fx-layout-gap="1%" style="flex-direction: column; box-sizing: border-box; display: flex; place-content: stretch center; align-items: stretch; max-width: 100%; margin-bottom: 5%;">
                    <div _ngcontent-bjf-c268="" fxlayout="row" fxlayoutalign="space-evenly stretch" fxlayoutgap="1%" ng-reflect-fx-layout="row" ng-reflect-fx-layout-align="space-evenly stretch" ng-reflect-fx-layout-gap="1%" style="margin-bottom: 1%; flex-direction: row; box-sizing: border-box; display: flex; place-content: stretch space-evenly; align-items: stretch; max-height: 100%;">
                      <span _ngcontent-bjf-c268="" style="margin-right: 1%; width:45%">`+ review.reviewer.name + " " + review.reviewer.surname + `</span>`;

          for (let i = 1; i <= 5; i++) {
            html += `<mat-icon _ngcontent-bjf-c268="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color ng-star-inserted" aria-hidden="true" data-mat-icon-type="font" style="padding-top: 6px; margin-right: 1%;">`;
            html += i > review.rating ? "star_outline" : "star";
            html += `</mat-icon>`;
          }

          html += `</div>
                  <p style="margin-top: 3%">`+ review.comment + `</p>
              </section>`
        }, 1000);
      });

      setTimeout(() => {
        if (response.length === 0 || response.length === notReviewedCount)
          html += "<p>Нема доступних рецензија</p>"

        html += "</div>" //Closing div

        Swal.fire({
          title: "Приказ рецензија за изабрани експонат",
          html: html,
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        });
      }, 2000);
    }).catch(reject => {
      //console.error(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети податке рецензија за изабрани експонат. Проверите да ли сте повезани на интернет. Уколико се грешка идаље појављује контактирајте администратора.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }
}

//export { Item, CategoryNode, FlatNode }; //To resolve additional export request by Angular
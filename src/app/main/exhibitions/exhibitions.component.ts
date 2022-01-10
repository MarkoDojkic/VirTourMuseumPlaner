import { ExhibitionService } from './../../services/Exhibition/exhibition.service';
import { Exhibition } from '../../model/exhibition';
import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { Router } from '@angular/router';
import { Exhibit } from 'src/app/model/exhibit';
import Swal from 'sweetalert2';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  minPrice!: number;
  maxPrice!: number;
  minExhibitCount!: number;
  maxExhibitCount!: number;
  minTime!: number;
  maxTime!: number;
  exhibitionTypes!: Map<string, boolean>;
  exhibitTypes!: Map<string, boolean>;
  minRating: number = 0;
  priceSliderOptions: Options = {
    "floor": 0,
    "ceil": 0,
    "step": 0,
    "hideLimitLabels": true
  };
  exhibitCountSliderOptions: Options = {
    "floor": 0,
    "ceil": 0,
    "step": 0,
    "hideLimitLabels": true
  };
  timeSliderOptions: Options = {
    "floor": 0,
    "ceil": 0,
    "step": 0,
    "hideLimitLabels": true
  };

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

  returnTotalCost(exhibits: Array<Exhibit>): number {
    return exhibits.map(e => e.price).reduce((sum, price) => sum + price, 0);
  }

  returnTotalTime(exhibits: Array<Exhibit>): number {
    return exhibits.map(e => e.time).reduce((sum, time) => sum + time, 0);
  }

  displayExhibitions(): void {
    this.exhibitionService.getAll().then(resolve => {
      this.exhibitions = resolve;
    }).catch((reject) => console.log(reject));
    setTimeout(() => { /* To give time to firestore to get items */
      this.exhibitionTypes = new Map(this.exhibitions.map(exhibition => {
        return [exhibition.type, true];
      }));

      this.exhibitTypes = new Map(this.exhibitions.map(exhibition => {
        return [exhibition.exhibitsType, true];
      }));

      this.filteredExhibitions = this.exhibitions;

      const minP = Math.min.apply(Math, this.filteredExhibitions.map(exhibition => this.returnTotalCost(exhibition.exhibits)));
      const maxP = Math.max.apply(Math, this.filteredExhibitions.map(exhibition => this.returnTotalCost(exhibition.exhibits)));
      const minEC = Math.min.apply(Math, this.filteredExhibitions.map(exhibition => exhibition.exhibits.length));
      const maxEC = Math.max.apply(Math, this.filteredExhibitions.map(exhibition => exhibition.exhibits.length));
      const minT = Math.min.apply(Math, this.filteredExhibitions.map(exhibition => this.returnTotalTime(exhibition.exhibits)));
      const maxT = Math.max.apply(Math, this.filteredExhibitions.map(exhibition => this.returnTotalTime(exhibition.exhibits)));


      this.minPrice = minP;
      this.maxPrice = maxP;
      this.minExhibitCount = minEC;
      this.maxExhibitCount = maxEC;
      this.minTime = minT;
      this.maxTime = maxT;

      this.priceSliderOptions = {
        floor: minP,
        ceil: maxP,
        step: (maxP - minP) / 10,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return "<b>" + value + " рсд</b>";
            case LabelType.High:
              return "<b>" + value + " рсд</b>";
            default:
              return value + " динара";
          }
        },
        hideLimitLabels: true
      };

      this.exhibitCountSliderOptions = {
        floor: minEC,
        ceil: maxEC,
        step: (maxEC - minEC) / 10,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return "<b>" + value + " експоната</b>";
            case LabelType.High:
              return "<b>" + value + " експоната</b>";
            default:
              return value + " експоната";
          }
        },
        hideLimitLabels: true
      };

      this.timeSliderOptions = {
        floor: minT,
        ceil: maxT,
        step: (maxT - minT) / 10,
        translate: (value: number, label: LabelType): string => {
          switch (label) {
            case LabelType.Low:
              return "<b>" + value + " минута</b>";
            case LabelType.High:
              return "<b>" + value + " минута</b>";
            default:
              return value + " минута";
          }
        },
        hideLimitLabels: true
      };
    }, 1000);
  }

  applyFilters(): void {
    this.filteredExhibitions = this.exhibitions.filter(exhibition => // First filter -> use all items array
      this.returnTotalCost(exhibition.exhibits) >= this.minPrice && this.returnTotalCost(exhibition.exhibits) <= this.maxPrice
    ).filter(exhibition =>
      this.returnTotalTime(exhibition.exhibits) >= this.minTime && this.returnTotalTime(exhibition.exhibits) <= this.maxTime
    ).filter(exhibition =>
      exhibition.exhibits.length >= this.minExhibitCount && exhibition.exhibits.length <= this.maxExhibitCount
    );

    for (const key of Array.from(this.exhibitionTypes.keys())) {
      if (!this.exhibitionTypes.get(key)) {
        this.filteredExhibitions = this.filteredExhibitions.filter(exhibition => exhibition.type !== key);
      }
    }

    for (const key of Array.from(this.exhibitTypes.keys())) {
      if (!this.exhibitTypes.get(key)) {
        this.filteredExhibitions = this.filteredExhibitions.filter(exhibition => exhibition.exhibitsType !== key);
      }
    }

    this.filteredExhibitions.forEach(exhibition => {
      var sumOfRatings: number = 0;
      var totalReviews: number = 0;

      exhibition.exhibits.forEach(e => this.exhibitionService.getReviewsForExhibit(e.id).then(reviews => {
        reviews.forEach(review => {
          sumOfRatings += review.rating;
          totalReviews++;
        });
      }));

      setTimeout(() => {
        if (totalReviews !== 0 && Math.round(sumOfRatings / totalReviews) < this.minRating)
          this.filteredExhibitions.splice(this.filteredExhibitions.findIndex(fE => fE.id === exhibition.id), 1)
      }, 1); //wait forEach
    });
  }

  updateExhibitionTypes(key: string, value: MatCheckboxChange): void {
    this.exhibitionTypes.set(key, value.checked);
    this.applyFilters();
  }

  updateExhibitTypes(key: string, value: MatCheckboxChange): void {
    this.exhibitTypes.set(key, value.checked);
    this.applyFilters();
  }

  updateRating(minRating: number): void {
    this.minRating = minRating;
    for (let i = 1; i <= 10; i++) {
      document.querySelector("#exhibitionRating_" + i)!.innerHTML = i <= minRating ? "star" : "star_outline";
    }
  }

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
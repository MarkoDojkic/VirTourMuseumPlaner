import { NotifierService } from 'angular-notifier';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { TourService } from '../../services/tour/tour.service';
import serbianLocale from '@angular/common/locales/sr-Cyrl';
import { registerLocaleData } from '@angular/common';
import { isSameMonth, isSameDay } from 'date-fns';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Tour } from 'src/app/model/tour';
import { Review } from 'src/app/model/review';
import { Observable } from 'rxjs/internal/Observable';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import 'moment-duration-format';

@Component({
  selector: 'app-planer',
  templateUrl: './planer.component.html',
  styleUrls: ['./planer.component.scss']
})
export class PlanerComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  locale: string = 'sr-Cyrl';
  activeDayIsOpen: boolean = false;
  @ViewChild('planerStepper') private planerStepper!: MatStepper;
  currentViewingTour: Tour | undefined = undefined;
  stepperOrientation!: Observable<StepperOrientation>;
  @ViewChild('timeTemplate', { static: false })
  timeTemplate!: ElementRef;
  refresh: Subject<any> = new Subject();

  constructor(private tourService: TourService, breakpointObserver: BreakpointObserver, private ns: NotifierService) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    registerLocaleData(serbianLocale);
    this.getPlaner();
  }

  getPlaner(): void {
    this.events = [];
    this.tourService.getToursData().then(resolve => {
      resolve.forEach(tour => {
        var totalTime = moment.duration(tour.exhibits.map(e => e.time).reduce((totalTime, time) => totalTime += time, 0), "minutes").format({ precision: 0, template: "hh:mm" });
        var tourStart = new Date(tour.scheduledAt!);
        var tourEnd = tourStart;
        tourEnd!.setTime(tourEnd!.getTime() + parseInt(totalTime));

        var startTimeTitle = "Почетак у: " + tourStart.toLocaleTimeString("sr-RS");
        var exhibitCountTitle = " | Број експоната: " + tour.exhibits.length;
        var totalTimeTitle = " | Трајање: " + tour.exhibits.map(e => e.time).reduce((total, time) => total += time, 0) + " минута";
        var totalCostTitle = " | Укупна цена: " + tour.exhibits.map(e => e.price).reduce((total, price) => total += price, 0) + " динара";
        var averageRatingTitle = tour.status === 'Завршен' ? " | Просечна оцена: " + tour.reviews.map(r => r.rating as number).reduce((total, rating) => total += rating, 0) / tour.reviews.length : "";

        this.events.push({
          title: startTimeTitle + exhibitCountTitle + totalTimeTitle + totalCostTitle + averageRatingTitle,
          start: tourStart!,
          end: tourEnd,
          color: this.getColorByStatus(tour.status),
          draggable: tour.status === 'Текући',
          actions: this.getActions(tour, tourStart),
          meta: {
            id: tour.id,
            status: tour.status
          }
        });
      });
      this.refresh.next();
    }).catch(reject => console.log(null /*reject*/));
  }

  getActions(tour: Tour, date: Date): CalendarEventAction[] {
    switch (tour.status) {
      case "Текући": return [
        {
          label: '<i class="material-icons">edit</i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.currentViewingTour = tour;
            this.planerStepper.selected!.completed = true;
            this.planerStepper.next();
          },
        },
        {
          label: '<i class="material-icons">cancel</i>',
          a11yLabel: 'Cancel',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.tourService.cancelTour(tour.id);
            setTimeout(() => {
              this.getPlaner();
            }, 200);
            setTimeout(() => {
              this.viewDate = date!;
            }, 300);
          },
        },
      ];
      case "Отказан": return [
        {
          label: '<i class="material-icons">visibility</i>',
          a11yLabel: 'View',
          onClick: (): void => {
            this.currentViewingTour = tour;
            this.planerStepper.selected!.completed = true;
            this.planerStepper.next();
          }
        },
        {
          label: '<i class="material-icons">delete_forever</i>',
          a11yLabel: 'Remove',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            Swal.fire({
              title: "Потврда уклањања отказаног обиласка из планера",
              text: "Да ли сте сигурни да желите да уклоните обилазак? Овај процес је неповратан!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Да",
              confirmButtonColor: "red",
              cancelButtonText: "Не",
              cancelButtonColor: "green",
            }).then(result => {
              if (result.isConfirmed) {
                this.tourService.deleteTour(tour.id).then(response => {
                  if (response === "OK") {
                    this.ns.notify("success", "Успешно уклоњен обилазак из планера");
                    this.events.splice(this.events.findIndex(e => e.meta.id === tour.id), 1);
                    this.refresh.next();
                  } else {
                    //console.log(response);
                    this.ns.notify("error", "Догодила се грешка. Проверите да ли сте повезани на интернет. Уколико се грешка идаље појављује контактирајте администратора.");
                  }
                }, reject => console.log(null/*reject*/));
              }
            });
          }
        }
      ];
      case "Завршен": return [
        {
          label: '<i class="material-icons">edit</i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.currentViewingTour = tour;
            this.planerStepper.selected!.completed = true;
            this.setAverageRating(tour.reviews);
            this.planerStepper.next();
          },
        }
      ];
      default: return [];
    }
  }

  filterTours(event: KeyboardEvent): void {
    var filterValue = (<HTMLInputElement>event.target).value;
    this.getPlaner(); //Reload planer
    setTimeout(() => {
      this.events = this.events.filter(event => JSON.stringify(event).includes(filterValue, 0));
    }, 100); //Wait for planer to be fetched
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  rescheduleTour({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        this.tourService.updateTourDateTime(iEvent.meta.id, newStart).then(resolve => {
          //console.log(resolve);
          this.ns.notify("success", "Успешно промењен датум обиласка.");
        }).catch(reject => {
          //console.log(reject);
          this.ns.notify("error", "Догодила се грешка приликом промене датума обилазка. Проверите да ли сте повезани на интернет. Уколико се грешка идаље појављује контактирајте администратора.");
        });

        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }

  getColorByStatus(status: string): import("calendar-utils").EventColor {
    switch (status) {
      case "Текући": return {
        primary: "#ffff80",
        secondary: "#e6e600"
      };
      case "Завршен": return {
        primary: "#4ce600",
        secondary: "#aaff80"
      };
      case "Отказан": return {
        primary: "#e60000",
        secondary: "#ff8080"
      };
      default: return {
        primary: "#000000",
        secondary: "#000000"
      };
    }
  }

  setAverageRating(reviews: Array<Review>): void {
    var html = "";
    var average = reviews.map(r => r.rating as number).reduce((total, rating) => total += rating, 0) / reviews.length;

    for (let i = 1; i <= 10; i++) {
      html += `<mat-icon _ngcontent-bjf-c268="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color ng-star-inserted" aria-hidden="true" data-mat-icon-type="font" style="padding-top: 6px; margin-right: 1%;">`;
      html += i > average ? "star_outline" : "star";
      html += `</mat-icon>`;
    }

    document.querySelector("#averageRatingPlaceholder")!.innerHTML = html;
  }

  removeExhibitFromTour(exhibitId: string): void {
    Swal.fire({
      title: "Потврда уклањања експоната из изабраног текућег обиласка",
      text: "Да ли сте сигурни да желите да уклоните експонат? Овај процес је неповратан!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Да",
      confirmButtonColor: "red",
      cancelButtonText: "Не",
      cancelButtonColor: "green",
    }).then(result => {
      if (result.isConfirmed) {
        this.tourService.removeReviewFromExhibit(this.currentViewingTour?.id!, exhibitId).then(response => {
          if (response === "OK") {
            this.ns.notify("success", "Успешно уклоњен експонат из обиласка");
            this.currentViewingTour?.exhibits.splice(this.currentViewingTour.exhibits.findIndex(e => e.id === exhibitId), 1);
            document.querySelector("#expansionPanel_" + exhibitId)?.remove();
          } else {
            //console.log(response);
            this.ns.notify("error", "Догодила се грешка. Проверите да ли сте повезани на интернет. Уколико се грешка идаље појављује контактирајте администратора.");
          }
        }, reject => console.log(null /*reject*/));
      }
    });
  }

  registerNewTime(newTime: string): void {
    var oldDate = new Date(this.currentViewingTour?.scheduledAt!);
    oldDate.setHours(parseInt(newTime.split(":")[0]));
    oldDate.setMinutes(parseInt(newTime.split(":")[1]));
    this.currentViewingTour!.scheduledAt = oldDate;
  }

  updateTourTime(): void {
    Swal.fire({
      title: "Изаберите ново време изабраног обиласка",
      html: this.timeTemplate!.nativeElement,
      showCancelButton: true,
      confirmButtonText: "Промени време обиласка",
      cancelButtonText: "Одустани од промене времена обиласка",
      allowOutsideClick: false,
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.tourService.checkIfTourTimeSlotIsAvailable(this.currentViewingTour?.scheduledAt!).then(resolve => {
          if (resolve === "WRONG_TIME") throw new Error("timeSlotError");
        }).catch(reject => {
          if (reject.message === "timeSlotError") Swal.showValidationMessage("Изабрани временски слот није слободан.</br>Изаберите други датум или време.");
          else Swal.showValidationMessage("Догодила се грешка. Проверите да ли сте повезани на интернет. Уколико се грешка идаље појављује контактирајте администратора.");
        });
      }
    }).then(choice => {
      if (choice.isDismissed) {
        this.ns.notify("error", "Одустали сте од промене времена обиласка.");
      } else {
        this.tourService.updateTourDateTime(this.currentViewingTour?.id!, this.currentViewingTour?.scheduledAt!).then(resolve => {
          //console.log(resolve);
          this.ns.notify("success", "Успешно сте променили време обиласка.");

          var oldEvent = this.events.find(e => e.meta.id === this.currentViewingTour?.id);
          oldEvent!.start = this.currentViewingTour?.scheduledAt!;
          oldEvent!.title = "Почетак у: " + oldEvent!.start.toLocaleTimeString("sr-RS") + " | Број експоната:" + oldEvent!.title.split(" | Број експоната:")[1];
          this.events.splice(this.events.findIndex(e => e.meta.id === this.currentViewingTour?.id), 1, oldEvent!);
        }).catch(reject => {
          //console.log(reject);
          this.ns.notify("error", "Догодила се грешка приликом промене времена обилазка. Проверите да ли сте повезани на интернет. Уколико се грешка идаље појављује контактирајте администратора.");
        });
      }
    });
  }

  editReview(exhibitId: string): void {
    Swal.fire({
      title: "Приказ и измена рецензије изабраног обиђеног експоната",
      customClass: { popup: "sweetAlertDisplayFix" },
      html: `
      <div _ngcontent-bjf-c268="" fxlayout="column" fxlayoutalign="center center" fxlayoutgap="2%" ng-reflect-fx-layout="column" ng-reflect-fx-layout-align="center stretch" ng-reflect-fx-layout-gap="2%" style="flex-direction: column; box-sizing: border-box; display: flex; place-content: stretch center; align-items: stretch; max-width: 100%;" class="mat-card">      
        <span>Оцена (за негативну оцену пређите мишем лево од прве звездице):</span>
        <div _ngcontent-bjf-c269="" fxlayout="row" fxlayoutalign="center center" fxlayoutgap="2%">
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(0)" style="color: transparent; width: 0.5px;"></button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(1)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_1">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(2)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_2">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(3)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_3">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(4)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_4">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(5)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_5">star_outline</mat-icon>
          </button>
          <br>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(6)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_6">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(7)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_7">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(8)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_8">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(9)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_9">star_outline</mat-icon>
          </button>
          <button _ngcontent-hdn-c273="" mat-icon-button="" class="mat-focus-indicator ng-tns-c273-0 mat-icon-button mat-button-base" onmouseover="onHoverRating(10)">
              <mat-icon _ngcontent-ynd-c273="" role="img" class="mat-icon notranslate material-icons mat-icon-no-color" aria-hidden="true" data-mat-icon-type="font" id="sweetAlertRating_rating_10">star_outline</mat-icon>
          </button>
        </div>
        <span hidden="true" id="sweetAlertRating">`+ this.currentViewingTour?.reviews[this.currentViewingTour.exhibits.findIndex(e => e.id === exhibitId)].rating + `</span>
        
        <span>Коментар (максимална дужина 510 карактера):</span><br>
        <textarea maxlength="510" id="sweetAlertReview" rows="10" cols="50" style="resize:none; font-size:inherit">`+ this.currentViewingTour?.reviews[this.currentViewingTour.exhibits.findIndex(e => e.id === exhibitId)].comment + `</textarea><br>
      </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Измени рецензију",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(response => {
      if (response.isConfirmed) {
        var newRating: any = parseInt(Swal.getPopup()!.querySelector("#sweetAlertRating")!.innerHTML);
        var newComment: string = (Swal.getPopup()!.querySelector("#sweetAlertReview")! as HTMLTextAreaElement).value.trim();
        var oldReview: Review = this.currentViewingTour!.reviews[this.currentViewingTour!.exhibits.findIndex(e => e.id === exhibitId)];

        if (newRating === oldReview.rating && newComment === oldReview.comment) return; /* No new data */

        oldReview.rating = newRating;
        oldReview.comment = newComment;

        this.tourService.updateReview(oldReview).then(() => {
          Swal.fire({
            title: "Подаци рецензије успешно промењени",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          }).finally(() => {
            this.setAverageRating(this.currentViewingTour!.reviews);
          });
        }, reject => {
          /* console.error(reject); */
          Swal.fire({
            title: "Грешка приликом промене података",
            text: "Није могуће променити податке рецензије. Проверите да ли сте повезани на интернет. Уколико се грешка идаље појављује контактирајте администратора.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }
}
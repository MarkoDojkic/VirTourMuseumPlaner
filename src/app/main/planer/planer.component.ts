import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
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

  constructor(private tourService: TourService, breakpointObserver: BreakpointObserver) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    registerLocaleData(serbianLocale);
    this.getPlaner();
    setTimeout(() => {
      this.viewDate = new Date();
    }, 100); //Wait for planer to be fetched
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
        //var statusTitle = " | Статус: " + tour.status;
        var exhibitCountTitle = " | Број експоната: " + tour.exhibits.length;
        var totalTimeTitle = " | Трајање: " + tour.exhibits.map(e => e.time).reduce((total, time) => total += time, 0) + " минута";
        var totalCostTitle = " | Укупна цена: " + tour.exhibits.map(e => e.price).reduce((total, price) => total += price, 0) + " динара";

        this.events.push({
          title: startTimeTitle + exhibitCountTitle + totalTimeTitle + totalCostTitle,
          start: tourStart!,
          end: tourEnd,
          color: this.getColorByStatus(tour.status),
          draggable: true,
          actions: this.getActions(tour, tourStart),
          meta: {
            id: tour.status
          }
        });
      });
    }).catch(reject => console.log(reject));
  }

  getActions(tour: Tour, date: Date): CalendarEventAction[] {
    switch (tour.status) {
      case "Текући": return [
        {
          label: '<i class="material-icons">edit</i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            console.log("----EDIT REQUESTED----");
            console.log(event);
            //this.handleEvent('Edited', event);
          },
        },
        {
          label: '<i class="material-icons">delete_forever</i>',
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
            this.planerStepper.next();
          },
        }
      ];
      case "Завршен": return [
        {
          label: '<i class="material-icons">edit</i>',
          a11yLabel: 'Edit',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            console.log("----EDIT REQUESTED----");
            console.log(event);
            //this.handleEvent('Edited', event);
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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    /* this.handleEvent('Dropped or resized', event); */
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
}
import { Component, OnInit } from '@angular/core';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import * as moment from 'moment';
import { TourService } from '../../services/tour/tour.service';
import serbianLocale from '@angular/common/locales/sr-Cyrl';
import { registerLocaleData } from '@angular/common';
import { isSameMonth, isSameDay } from 'date-fns';

@Component({
  selector: 'app-planer',
  templateUrl: './planer.component.html',
  styleUrls: ['./planer.component.scss']
})
export class PlanerComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  actions: CalendarEventAction[] = [
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
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        console.log("----DELETE REQUESTED----");
        console.log(event);
        /* this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event); */
      },
    },
  ];
  events: CalendarEvent[] = [];
  locale: string = 'sr-Cyrl';
  activeDayIsOpen: boolean = false;

  constructor(private tourService: TourService) { }

  ngOnInit(): void {
    registerLocaleData(serbianLocale);
    this.getPlaner();
  }

  getPlaner(): void {
    this.tourService.getToursData().then(resolve => {
      resolve.forEach(tour => {
        var totalTime = moment.duration(tour.exhibits.map(e => e.time).reduce((totalTime, time) => totalTime += time, 0), "minutes").format({ precision: 0, template: "hh:mm" });
        var tourStart = new Date(tour.scheduledAt!);
        var tourEnd = tourStart;
        tourEnd!.setTime(tourEnd!.getTime() + parseInt(totalTime));

        this.events.push({
          title: tourStart.toLocaleTimeString("sr-RS"),
          start: tourStart!,
          end: tourEnd,
          color: {
            primary: "#f87c6f",
            secondary: "#fee0dd"
          },
          draggable: true,
          actions: this.actions
        });
      });
    }).catch(reject => console.log(reject));
  }

  filterTours(event: KeyboardEvent): void {
    var filterValue = (<HTMLInputElement>event.target).value;
    /* if (filterValue === undefined || filterValue.length === 0)
      this.orders.data = this.listedOrders;
    else
      this.orders.data = this.listedOrders.filter(order => JSON.stringify(Object.values(order)).includes(filterValue, 0));
    this.updatePageSizeOptions(); */
    //Example of search string: ["TE561FLEyixbxHtTjvmi","2020-11-04T03:06:35.000Z",{"item_117":"5$237500","item_52":"4$16700","item_35":"5$19200","item_21":"13$19200","item_36":"13$22300","item_71":"15$21000"},"Булевар Милутина Миланковића 25, Нови Београд","Пошта","Текућа",2657760]
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
}

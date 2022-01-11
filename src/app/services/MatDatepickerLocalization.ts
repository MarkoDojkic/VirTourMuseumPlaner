import { Injectable } from "@angular/core";
import { NativeDateAdapter } from "@angular/material/core";

@Injectable()
export class MatDatepickerLocalization extends NativeDateAdapter {
    getFirstDayOfWeek(): number {
        return 1;
    };
}
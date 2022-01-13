import { Exhibit } from "./exhibit";
import { Review } from "./review";

export interface Tour {
    id: string;
    exhibits: Array<Exhibit>;
    reviews: Array<Review>;
    status: "Текући" | "Завршен" | "Отказан";
    scheduledAt?: Date;
    //Use with: moment.duration(140, "minutes").format({ precision: 0, template: "hh:mm" }) -> returns 02:20
    //For time and price use exhibits array to calcualte, also show name and description of exhibits
    //Reviews are user individual reviews (array ids match exhibits array ids)
}

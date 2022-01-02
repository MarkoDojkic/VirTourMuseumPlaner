import { Exhibit } from "./exhibit";
import { Review } from "./review";

export interface Tour {
    type: String;
    exhibits: Array<Exhibit>;
    exhibitType: String;
    exhibitQuantity: Number;
    time: String; //Use with: moment.duration(140, "minutes").format({ precision: 0, template: "hh:mm" }) -> returns 02:20
    price: String;
    reviews: Array<Review>;
    status: "Текућа" | "Завршена" | "Отказана";
}

import { Exhibit } from "./exhibit";
import { Review } from "./review";

export interface Exhibition {
    id: String;
    type: String;
    exhibitsType: String;
    exhibits: Array<Exhibit>; //Show length also.
    //price is caluclated based on exhibits also with time
    //Use with: moment.duration(140, "minutes").format({ precision: 0, template: "hh:mm" }) -> returns 02:20
    //reviews are used based on exhibits, will only show average of ratings
}

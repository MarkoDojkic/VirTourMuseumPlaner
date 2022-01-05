import { Exhibit } from "./exhibit";
import { Tour } from "./tour";

export interface Visitor {
    id: String;
    name: String;
    surname: String;
    email: String;
    phone: String | undefined;
    mobilePhone: String | undefined;
    password: String;
    planer: Array<Tour>;
    favorites: Array<Exhibit>;
}

import { PlanerInstance } from "./planer-instance";

export interface Visitor {
    id: String;
    name: String;
    surname: String;
    email: String;
    phone: String;
    mobilePhone: String;
    password: String;
    planer: Array<PlanerInstance>;
    favorites: Array<string>;
}

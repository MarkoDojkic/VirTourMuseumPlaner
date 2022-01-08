import { PlanerInstance } from "./planer-instance";

export interface Visitor {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    mobilePhone: string;
    password: string;
    planer: Array<PlanerInstance>;
    favorites: Array<string>;
}

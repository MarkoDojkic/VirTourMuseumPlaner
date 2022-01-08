import { Review } from "./review";

export interface Exhibit {
    id: string;
    title: string;
    description: string;
    imageURL: string;
    price: number; //Will be summed with other exhibits and converted to string (ex. 150 РСД)
    time: number; //Use as minutes, later will be converted when summed with other exhibits
    countryOfOrigin: string;
    reviews: Array<Review>;
}

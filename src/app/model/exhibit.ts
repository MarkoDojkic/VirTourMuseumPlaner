import { Review } from "./review";

export interface Exhibit {
    title: String;
    description: String;
    imageURL: String;
    price: Number; //Will be summed with other exhibits and converted to string (ex. 150 РСД)
    time: Number; //Use as minutes, later will be converted when summed with other exhibits
    countryOfOrigin: String;
    reviews: Array<Review>;
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from 'src/app/model/review';
import { Tour } from 'src/app/model/tour';
import { environment } from 'src/environments/environment';
import { CryptoService } from '../crypto/crypto.service';

@Injectable({
  providedIn: 'root'
})
export class TourService {
  constructor(private http: HttpClient, private cs: CryptoService) { }

  checkIfTourTimeSlotIsAvaiable(timeSlot: string): Promise<string> {
    return this.http.post<string>("http://localhost:21682/checkIfTourTimeSlotIsAvaiable", timeSlot, { responseType: 'json' }).toPromise();
  }

  addNewTour(newTour: any): Promise<string> {
    return this.http.post<string>("http://localhost:21682/addNewTour/" + this.cs.decrypt(environment.cryptoKey, sessionStorage.getItem("loggedInUser")!.toString()), newTour, { responseType: 'json' }).toPromise();
  }

  getReviewsForExhibit(exhibitId: string): Promise<Array<Review>> {
    return this.http.get<Array<Review>>("http://localhost:21682/getReviews/" + exhibitId, { responseType: 'json' }).toPromise();
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exhibition } from 'src/app/model/exhibition';
import { Review } from 'src/app/model/review';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {
  getReviewsForExhibit(exhibitId: string): Promise<Array<Review>> {
    return this.http.get<Array<Review>>("http://localhost:21682/getReviews/" + exhibitId, { responseType: 'json' }).toPromise();
  }
  constructor(private http: HttpClient) { }

  getAll(): Promise<Array<Exhibition>> {
    return this.http.get<Array<Exhibition>>("http://localhost:21682/getExhibitions", { responseType: 'json' }).toPromise();
  }
}

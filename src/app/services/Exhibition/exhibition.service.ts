import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Exhibition } from 'src/app/model/exhibition';

@Injectable({
  providedIn: 'root'
})
export class ExhibitionService {
  constructor(private http: HttpClient) { }

  getAll(): Promise<Array<Exhibition>> {
    return this.http.get<Array<Exhibition>>("http://localhost:21682/getExhibitions", { responseType: 'json' }).toPromise();
  }
}
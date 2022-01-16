import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient: HttpClient) { }

  reply(message: string): Promise<string> {
    return this.httpClient.post<string>("http://localhost:21682/getBotResponse", message, { responseType: 'json' }).toPromise();
  }
}

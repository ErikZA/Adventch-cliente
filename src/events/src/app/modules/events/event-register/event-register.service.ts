import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { EventModel } from 'src/app/models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventRegisterService {

  public uri = environment.eventsApiUrl;

  constructor(
    private http: HttpClient,
  ) { }

  async One(id: string) {
    return await this.http.get(`${this.uri}/Events/${id}`).toPromise();
  }

  async All() {
    return await this.http.get(`${this.uri}/Events`).toPromise();
  }

  async Create(event: EventModel) {
    return await this.http.post(`${this.uri}/Events`, event).toPromise()
  }



}

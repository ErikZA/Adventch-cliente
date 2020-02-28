import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  public uri = environment.eventsApiUrl;

  constructor(
    public http: HttpClient
  ) { }

  OneEvent(id: string) {
    return this.http.get(`${this.uri}/Companies/event/${id}?EventId=${id}`)
  }

  AllEvents(aliasName: string) {
    return this.http.get(`${this.uri}/Companies/${aliasName}?AliasName=${aliasName}`)
  }

}

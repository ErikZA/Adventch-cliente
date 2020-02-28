import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  public uri = environment.eventsApiUrl;

  constructor(
    public http: HttpClient
  ) { }

  getFieldTypes() {
    return this.http.get(`${this.uri}/Fields/fieldtypes`);
  }

}

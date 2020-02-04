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

  async getFieldTypes() {
    return await this.http.get(`${this.uri}/Fields/fieldtypes`).toPromise();
  }

}

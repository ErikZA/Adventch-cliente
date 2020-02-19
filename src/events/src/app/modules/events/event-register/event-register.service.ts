import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { EventModel } from 'src/app/models/event.model';
import { MatSnackBar } from '@angular/material';

@Injectable({
  providedIn: 'root'
})
export class EventRegisterService {

  public uri = environment.eventsApiUrl;

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
  ) { }

  async One(id: string) {
    return await this.http.get(`${this.uri}/Events/${id}`).toPromise();
  }

  async All() {
    return await this.http.get(`${this.uri}/Events`).toPromise();
  }

  Create(event: EventModel) {
    console.log(event)
    this.http.post(`${this.uri}/Events`, JSON.stringify(event)).subscribe(res => {
      console.log(res);
      this.snackbar.open("check_circle", "Eventos criado com success", { duration: 2000 })
    })
  }



}

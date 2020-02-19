import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../../environments/environment';
import { EventModel } from 'src/app/models/event.model';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ReadEvents } from 'src/app/actions/event.action';

@Injectable({
  providedIn: 'root'
})
export class EventRegisterService {

  public uri = environment.eventsApiUrl;

  constructor(
    private store: Store<any>,
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private router: Router,
  ) { }

  async One(id: string) {
    return await this.http.get(`${this.uri}/Events/${id}`).toPromise();
  }

  async All() {
    this.http.get(`${this.uri}/Events`).subscribe((res: any) => {
      this.store.dispatch(ReadEvents(res.data))
    })
  }

  Create(event: EventModel) {
    this.http.post(`${this.uri}/Events`, JSON.stringify(event)).subscribe(res => {
      this.snackbar.open("Eventos criado com success", "Fechar", { duration: 2000 })
      this.router.navigate(['/eventos'])
    })
  }

  Remove(id: string) {
    this.http.delete(`${this.uri}/Events/${id}?Id=${id}`).subscribe(res => {
      this.All();
      this.snackbar.open("Evento removido com success", "Fechar", { duration: 2000 })
    })
  }

}

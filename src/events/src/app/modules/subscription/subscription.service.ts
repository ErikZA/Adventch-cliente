import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material';
import { ConfirmPaymentComponent } from 'src/app/shared/confirm-payment/confirm-payment.component';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loaded } from 'src/app/actions/loading.action';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  public uri = environment.eventsApiUrl;

  constructor(
    public http: HttpClient,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<any>,
  ) { }

  OneEvent(id: string) {
    return this.http.get(`${this.uri}/Companies/event/${id}?EventId=${id}`).toPromise();
  }

  AllEvents(aliasName: string) {
    return this.http.get(`${this.uri}/Companies/${aliasName}?AliasName=${aliasName}`).toPromise();
  }

  Coupon(name: string, idEvent: string) {
    return this.http.get(`${this.uri}/Coupon/validate/${name}/${idEvent}`)
  }

  Subscription(alias: string, subscription) {
    this.store.dispatch(loaded(false));
    this.http.post(`${this.uri}/Registration`, JSON.stringify(subscription)).subscribe((res: any) => {
      const { name, email } = res.resultData;
      this.store.dispatch(loaded(true));
      this.OpenDialogConfirm(name, email)
      this.router.navigate([`/${alias}`])
    })
  }

  OpenDialogConfirm(name: string, email: string) {
    this.dialog.open(ConfirmPaymentComponent, {
      width: '200',
      data: { name, email }
    })
  }

}

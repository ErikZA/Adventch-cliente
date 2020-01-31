import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { IsLogin } from './actions/auth.action';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private auth$: Observable<any>;
  public isLogin: boolean;

  constructor(
    private store: Store<any>,
  ) {
    this.auth$ = store.select('auth');
    const token = JSON.parse(localStorage.getItem("token"))
    localStorage.setItem("token", JSON.stringify("eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2QiOjF9.xvDv5cIn1qck9Xmx9fAW3mi485FsgqRPMTxbK61ODJSByXNlPm5tfmMyj0mGHd4z3Eb4poOBdPYusMtu_1wpRqnSR_XB7xkkBydAEyZWJ40UZ75mT6_i3x1sF_OxLWK00VB2WbwCeGEQExn0rF0S_tK47UYOY6yqTFTPt6_oWQ4"))

    // if (token !== undefined && token !== null) {
    //   this.store.dispatch(IsLogin(true));
    // } else {
    //   this.store.dispatch(IsLogin(false));
    // }
    this.store.dispatch(IsLogin(true));

  }

  ngOnInit() {
    this.auth$.subscribe((res: any) => this.isLogin = res)
  }

}

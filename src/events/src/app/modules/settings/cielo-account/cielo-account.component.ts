import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CieloAccountFormComponent } from './cielo-account-form/cielo-account-form.component';
import { CieloAccountService } from './cielo-account.service';
import { CieloModel } from 'src/app/models/cielo.model';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cielo-account',
  templateUrl: './cielo-account.component.html',
  styleUrls: ['./cielo-account.component.scss']
})
export class CieloAccountComponent implements OnInit {

  public cielo$: Observable<any>;
  public accounts: CieloModel[] = [];

  constructor(
    private dialog: MatDialog,
    private cielo: CieloAccountService,
    private store: Store<any>,
  ) {
    this.cielo$ = store.select('cielo')
  }

  ngOnInit() {
    this.cielo.All();
    this.cielo$.subscribe(res => this.accounts = res);
  }

  OpenFormCieloAccount() {
    this.dialog.open(CieloAccountFormComponent, {
      width: '300'
    })
  }

  UpdateOpenFormCieloAccount(id: string) {
    this.dialog.open(CieloAccountFormComponent, {
      width: '300',
      data: { id }
    })
  }

  Remove(id: string) {
    this.cielo.Delete(id);
  }

}

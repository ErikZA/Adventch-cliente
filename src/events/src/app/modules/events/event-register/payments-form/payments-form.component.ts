import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PaymentModel } from 'src/app/models/event.model';
import { Store } from '@ngrx/store';
import { BankAccountService } from 'src/app/modules/settings/bank-account/bank-account.service';
import { BankAccount } from 'src/app/models/bankAccount.model';
import { CieloModel } from 'src/app/models/cielo.model';
import { CieloAccountService } from 'src/app/modules/settings/cielo-account/cielo-account.service';

@Component({
  selector: 'app-payments-form',
  templateUrl: './payments-form.component.html',
  styleUrls: ['./payments-form.component.scss']
})
export class PaymentsFormComponent implements OnInit {

  @Input('formPayments') formPayments: FormGroup;

  private bankAccount$: Observable<any>;
  private cieloAccount$: Observable<any>;

  public bankAccounts: BankAccount[] = [];
  public cieloAccounts: CieloModel[] = [];
  public methosPayments: any = [];
  public typePayment: string;

  constructor(
    private store: Store<any>,
    private account: BankAccountService,
    private cielo: CieloAccountService
  ) {
    this.cieloAccount$ = store.select('cielo');
    this.bankAccount$ = store.select('bankAccount');
    this.account.All();
    this.cielo.All();
  }

  ngOnInit() {
    this.account.GetMethodPayment().subscribe((res: any) => this.methosPayments = res.data);
    this.bankAccount$.subscribe((res: any) => this.bankAccounts = res);
    this.cieloAccount$.subscribe((res: any) => this.cieloAccounts = res)
  }

}

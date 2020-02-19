import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { PaymentModel } from 'src/app/models/event.model';
import { Store } from '@ngrx/store';
import { BankAccountService } from 'src/app/modules/settings/bank-account/bank-account.service';
import { BankAccount } from 'src/app/models/bankAccount.model';

@Component({
  selector: 'app-payments-form',
  templateUrl: './payments-form.component.html',
  styleUrls: ['./payments-form.component.scss']
})
export class PaymentsFormComponent implements OnInit {

  @Input('formPayments') formPayments: FormGroup;

  private bankAccount$: Observable<any>;

  public bankAccounts: BankAccount[] = [];
  public methosPayments: any = [];

  constructor(
    private store: Store<any>,
    private account: BankAccountService,
  ) {
    this.bankAccount$ = store.select('bankAccount');
    this.account.All();
  }

  ngOnInit() {
    this.account.GetMethodPayment().subscribe((res: any) => this.methosPayments = res.data);
    this.bankAccount$.subscribe((res: any) => {
      this.bankAccounts = res
    });
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Payment } from 'src/app/models/event.model';
import { Store } from '@ngrx/store';
import { AddPayments } from 'src/app/actions/newEvent.action';

@Component({
  selector: 'app-payments-form',
  templateUrl: './payments-form.component.html',
  styleUrls: ['./payments-form.component.scss']
})
export class PaymentsFormComponent implements OnInit {

  @Input('formPayments') formPayments: FormGroup;

  filteredOptions: Observable<Payment[]>;

  public accounts: Payment[] = [
    { name: "guilherme", account: 2334, agency: 34534, bank: '' },
    { name: "vinicius", account: 2334, agency: 34534, bank: '' },
    { name: "mendonça", account: 2334, agency: 34534, bank: '' },
    { name: "ferreira", account: 2334, agency: 34534, bank: '' },
  ]

  constructor(
    private store: Store<any>
  ) { }

  ngOnInit() {
    this.filteredOptions = this.formPayments.controls['bankAccountId'].valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.accounts.slice())
    )
  }

  displayFn(accounts?: any): string | undefined {
    return accounts ? accounts.name : undefined;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.accounts.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

  sendPayments() {
    this.store.dispatch(AddPayments(
      this.formPayments.controls["cashValue"].value,
      this.formPayments.controls["installmentAmount"].value,
      this.formPayments.controls["installmentLimit"].value,
      this.formPayments.controls["bankAccountId"].value,
    ))
  }

}

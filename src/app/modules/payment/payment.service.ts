
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BudgetDataInterface } from './interfaces/budget-data-interface';

@Injectable()
export class PaymentService {
  constructor(
    private http: HttpClient
  ) { }

  getBudgets(id: number): Observable<BudgetDataInterface[]> {
    const url = '/payment/budget/getBudgets/1/year/2018';
    return this.http
      .get<BudgetDataInterface[]>(url);
  }
}

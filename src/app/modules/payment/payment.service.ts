
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BudgetDataInterface } from './interfaces/budget-data-interface';
import { ComboInterface } from './interfaces/combo-interface';
import { NewBudget } from './interfaces/budget-view-model';

@Injectable()
export class PaymentService {
  constructor(
    private http: HttpClient
  ) { }

  getBudgets(idUnit: number, year: number): Observable<BudgetDataInterface[]> {
    const url = `/payment/budget/getBudgets/${idUnit}/year/${year}`;
    return this.http
      .get<BudgetDataInterface[]>(url);
  }

  loadDepartments(idUnit: number): Observable<ComboInterface[]> {
    const url = `/payment/budget/loadDepartments/${idUnit}`;
    return this.http
      .get<ComboInterface[]>(url);
  }

  saveBudget(budget: NewBudget): Observable<any> {
    const url = '/payment/budget/saveBudget';
    return this.http
      .post<any>(url, budget);
  }
}

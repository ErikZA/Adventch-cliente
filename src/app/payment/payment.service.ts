import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

import { Budgets } from './models/budgets';

@Injectable()
export class BudgetService {

  constructor(
    private http: HttpClient
  ) { }

  getBudgets(id?: string) {
    let url = '/budgets' + (id ? '/' + id : '');
    return this.http.get<Budgets[]>(url);
  }

  saveBudgets(id: string, name: string, description: string) {
    let method = id && id != '0' ? this.http.put : this.http.post;
    let url = '/budgets' + (id ? '/' + id : '');
    let body = JSON.stringify({ name: name, description: description });
    return method.bind(this.http)(url, body)
      .toPromise()
      .catch(err => {
        console.log(err.message);
        Promise.reject(err);
      });
  }

  deleteBudgets(id: string) {
    let url = '/budgets/' + id;
    return this.http
      .delete(url)
      .toPromise()
      .catch(err => {
        console.log(err.message);
        Promise.reject(err);
      });
  }

}
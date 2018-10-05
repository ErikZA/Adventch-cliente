import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChurchAvaliationFormInterface } from '../../interfaces/avaliation/church-avaliation-form-interface';

@Injectable({
  providedIn: 'root'
})
export class ChurchService {
  protected baseURL = '/treasury/churches/';

  constructor(
    private http: HttpClient
  ) { }

  public getChurchAvaliationForm(churchId: number): Observable<ChurchAvaliationFormInterface> {
    const url = `${this.baseURL}avaliation/${churchId}`;
    return this.http
      .get<ChurchAvaliationFormInterface>(url);
  }

}

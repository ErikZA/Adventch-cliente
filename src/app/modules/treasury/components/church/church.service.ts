import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChurchAvaliationFormInterface } from '../../interfaces/avaliation/church-avaliation-form-interface';
import { ChurchDataInterface } from '../../interfaces/church/church-data-interface';

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

  public getChurchesData(unitId: number): Observable<ChurchDataInterface[]> {
    const url = `${this.baseURL}unit/${unitId}`;
    return this.http
      .get<ChurchDataInterface[]>(url);
  }

}

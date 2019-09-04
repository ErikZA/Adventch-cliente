import { Injectable } from '@angular/core';
import { TreasurerDataInterface } from '../../interfaces/treasurer/treasurer-data-interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TreasurerService {
  protected baseURl = '/treasury/treasurers/';

  constructor(
    private http: HttpClient
  ) { }

  public getTreasurers(unitId: number, params: HttpParams): Observable<any> {
    const url = `${this.baseURl}unit/${unitId}`;
    return this.http
      .get<any>(url, { params });
  }

}

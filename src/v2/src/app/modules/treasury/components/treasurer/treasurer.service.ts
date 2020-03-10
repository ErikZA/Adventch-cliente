import { Injectable } from '@angular/core';
import { TreasurerDataInterface } from '../../interfaces/treasurer/treasurer-data-interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Treasurer } from '../../models/treasurer';

@Injectable({
  providedIn: 'root'
})
export class TreasurerService {
  protected baseURL = '/treasury/treasurers/';


  constructor(
    private http: HttpClient
  ) { }

  public getTreasurers(unitId: number, params: HttpParams): Observable<any> {
    const url = `${this.baseURL}unit/${unitId}`;
    return this.http
      .get<any>(url, { params });
  }

  public getAllTreasurers(unitId: number): Observable<Treasurer[]> {
    const url = `${this.baseURL}listAll/unit/${unitId}`;
       return this.http
      .get<Treasurer[]>(url);
  }
}

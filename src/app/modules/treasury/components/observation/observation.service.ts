import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ObservationAvaliationFormInterface } from '../../interfaces/observation/observation-avaliation-form-interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  protected baseURL = '/treasury/observations/';

  constructor(
    private http: HttpClient
  ) { }

  public getObservationsAvaliationByChurchIdAndYear(churchId: number, year: number): Observable<ObservationAvaliationFormInterface[]> {
    const url = `${this.baseURL}${churchId}/avaliation/${year}`;
    return this.http
      .get<ObservationAvaliationFormInterface[]>(url);
  }

  public finalizeObservation(data: { id: number }): Observable<boolean> {
    const url = '/treasury/observations/finalize/';
    return this.http
      .put<boolean>(url, data);
  }
}

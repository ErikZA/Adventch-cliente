import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChurchAvaliationDataInterface } from '../../interfaces/avaliation/church-avaliation-data-interface';
import { AvaliationEditInterface } from '../../interfaces/avaliation/avaliation-edit-interface';
import { NewAvaliationInterface } from '../../interfaces/avaliation/new-avaliation-interface';
import { UpdateAvaliationInterface } from '../../interfaces/avaliation/update-avaliation-interface';

@Injectable({
  providedIn: 'root'
})
export class AvaliationService {
  protected baseURl = '/treasury/avaliation/';

  constructor(
    private http: HttpClient
  ) { }

  public getChurchesAvaliations(unitId: number): Observable<ChurchAvaliationDataInterface[]> {
    const url = `${this.baseURl}unit/${unitId}`;
    return this.http
      .get<ChurchAvaliationDataInterface[]>(url);
  }

  public finalizeAnnualAvaliation(avaliationId: number, data: { userId: number }): Observable<boolean> {
    const url = `${this.baseURl}finalize/${avaliationId}/yearly`;
    return this.http
      .put<boolean>(url, data);
  }

  public finalizeMonthlyAvaliation(avaliationId: number, data: { userId: number }): Observable<boolean> {
    const url = `${this.baseURl}finalize/${avaliationId}/monthly`;
    return this.http
      .put<boolean>(url, data);
  }

  public getAvaliationEditById(avaliationId: number): Observable<AvaliationEditInterface> {
    const url = `${this.baseURl}${avaliationId}`;
    return this.http
      .get<AvaliationEditInterface>(url);
  }

  public getYearlyAvaliation(churchId: number): Observable<any> {
    const url = `${this.baseURl}${churchId}/yearly`;
    return this.http
      .get<any>(url);
  }

  public getMonthlyAvaliation(churchId: number, month: number): Observable<any> {
    const url = `${this.baseURl}${churchId}/monthly/${month}`;
    return this.http
      .get<any>(url);
  }

  public postNewAvaliationYearly(avaliation: NewAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURl}yearly`;
    return this.http
      .post<boolean>(url, avaliation);
  }

  public postNewAvaliationMonthly(avaliation: NewAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURl}monthly`;
    return this.http
      .post<boolean>(url, avaliation);
  }

  public putUpdateAvaliationYearly(id: number, avaliation: UpdateAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURl}${id}/yearly`;
    return this.http
      .put<boolean>(url, avaliation);
  }

  public putUpdateAvaliationMonthly(id: number, avaliation: UpdateAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURl}${id}/monthly`;
    return this.http
      .put<boolean>(url, avaliation);
  }
}

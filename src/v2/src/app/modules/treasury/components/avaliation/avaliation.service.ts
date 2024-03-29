import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChurchAvaliationDataInterface } from '../../interfaces/avaliation/church-avaliation-data-interface';
import { AvaliationEditInterface } from '../../interfaces/avaliation/avaliation-edit-interface';
import { NewAvaliationInterface } from '../../interfaces/avaliation/new-avaliation-interface';
import { UpdateAvaliationInterface } from '../../interfaces/avaliation/update-avaliation-interface';
import { PagedResult } from '../../../../shared/paged-result';
import { NewAvaliationInterfaceWeek } from '../../interfaces/avaliation/new-avaliation-interface-week';
import { UpdateAvaliationInterfaceWeekly } from '../../interfaces/avaliation/update-avaliation-interface-week';

import {AvaliationRequirementsInterface} from '../../interfaces/avaliation/avaliation-requirements-interface';


@Injectable({
  providedIn: 'root'
})
export class AvaliationService {
  protected baseURL = '/treasury/avaliation/';

  constructor(
    private http: HttpClient
  ) { }

  public getChurchesAvaliations(unitId: number, params: HttpParams): Observable<PagedResult<ChurchAvaliationDataInterface>> {
    const url = `${this.baseURL}units/${unitId}`;
    return this.http
      .get<PagedResult<ChurchAvaliationDataInterface>>(url, { params });
  }

  public getEvaliationAndRequirementsForm(churchId: number, month: number, year: number ): Observable<AvaliationRequirementsInterface[]> {
    const url = `${this.baseURL}monthly/yearly/${churchId}/${month}/${year}`;
    return this.http
      .get<AvaliationRequirementsInterface[]>(url);
  }

  public getEvaliationAndRequirementsSumYearForm(churchId: number, year: number ): Observable<AvaliationRequirementsInterface[]> {
    const url = `${this.baseURL}sumYearly/${churchId}/${year}`;
    return this.http
      .get<AvaliationRequirementsInterface[]>(url);
  }

  public finalizeAnnualAvaliation(avaliationId: number, data: { userId: number }): Observable<boolean> {
    const url = `${this.baseURL}finalize/${avaliationId}/yearly`;
    return this.http
      .put<boolean>(url, data);
  }

  public finalizeMonthlyAvaliation(avaliationId: number, data: { userId: number }): Observable<boolean> {
    const url = `${this.baseURL}finalize/${avaliationId}/monthly`;
    return this.http
      .put<boolean>(url, data);
  }

  public getAvaliationEditById(avaliationId: number): Observable<AvaliationEditInterface> {
    const url = `${this.baseURL}${avaliationId}`;
    return this.http
      .get<AvaliationEditInterface>(url);
  }

  public getYearlyAvaliation(churchId: number): Observable<any> {
    const url = `${this.baseURL}${churchId}/yearly`;
    return this.http
      .get<any>(url);
  }

  public getMonthlyAvaliation(churchId: number, month: number): Observable<any> {
    const url = `${this.baseURL}${churchId}/monthly/${month}`;
    return this.http
      .get<any>(url);
  }

  public postNewAvaliationYearly(avaliation: NewAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURL}yearly`;
    return this.http
      .post<boolean>(url, avaliation);
  }

  public postNewAvaliationMonthly(avaliation: NewAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURL}monthly`;
    return this.http
      .post<boolean>(url, avaliation);
  }

  public postNewAvaliationWeekly(avaliation: NewAvaliationInterfaceWeek): Observable<boolean> {
    const url = `${this.baseURL}weekly`;
    return this.http
      .post<boolean>(url, avaliation);
  }

  public putUpdateAvaliationWeekly(id: number, avaliation: UpdateAvaliationInterfaceWeekly): Observable<boolean> {
    const url = `${this.baseURL}${id}/weekly`;
    return this.http
      .put<boolean>(url, avaliation);
  }

  public putUpdateAvaliationYearly(id: number, avaliation: UpdateAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURL}${id}/yearly`;
    return this.http
      .put<boolean>(url, avaliation);
  }

  public putUpdateAvaliationMonthly(id: number, avaliation: UpdateAvaliationInterface): Observable<boolean> {
    const url = `${this.baseURL}${id}/monthly`;
    return this.http
      .put<boolean>(url, avaliation);
  }
}

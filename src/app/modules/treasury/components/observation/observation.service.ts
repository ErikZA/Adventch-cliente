import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ObservationAvaliationFormInterface } from '../../interfaces/observation/observation-avaliation-form-interface';
import { Observable } from 'rxjs';
import { ObservationDataInterface } from '../../interfaces/observation/observation-data-interface';
import { PagedResult } from '../../../../shared/paged-result';
import { ChurchObservationListFilterInterface } from '../../interfaces/observation/church-observation-list-filter-interface';
import { ResponsibleObservationListFilterInterface } from '../../interfaces/observation/responsible-observation-list-filter-interface';
import { AnalystDistrictChurchObservationListFilterInterface } from '../../interfaces/observation/analyst-district-church-observation-list-filter-interface';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {
  protected baseURL = '/treasury/observations/';

  constructor(
    private http: HttpClient
  ) { }

  public getObservations(unitId: number, params: HttpParams): Observable<PagedResult<ObservationDataInterface>> {
    const url = `${this.baseURL}units/${unitId}`;
    return this.http
      .get<PagedResult<ObservationDataInterface>>(url, { params });
  }

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

  public getChurchObservations(unitId: number): Observable<ChurchObservationListFilterInterface[]> {
    const url = `${this.baseURL}units/${unitId}/churches`;
    return this.http
      .get<ChurchObservationListFilterInterface[]>(url);
  }

  public getResponsibleObservations(unitId: number): Observable<ResponsibleObservationListFilterInterface[]> {
    const url = `${this.baseURL}units/${unitId}/responsibles`;
    return this.http
      .get<ResponsibleObservationListFilterInterface[]>(url);
  }

  public getAnalystDistrictChurchObservations(unitId: number): Observable<AnalystDistrictChurchObservationListFilterInterface[]> {
    const url = `${this.baseURL}units/${unitId}/churches/districts/analysts`;
    return this.http
      .get<AnalystDistrictChurchObservationListFilterInterface[]>(url);
  }
}

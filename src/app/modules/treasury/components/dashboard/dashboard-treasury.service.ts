import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnalystDistrictListInterface } from '../../interfaces/district/analyst-district-list-interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardTreasuryService {
  protected baseURl = '/treasury/dasboard/';

  constructor(
    private http: HttpClient
  ) { }

  public getAnalystsOfTheDistrict(unitId: number): Observable<AnalystDistrictListInterface[]> {
    const url = `/treasury/districts/analyst/unit/${unitId}`;
    return this.http
      .get<AnalystDistrictListInterface[]>(url);
  }
}

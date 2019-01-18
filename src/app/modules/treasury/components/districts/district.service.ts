import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DistrictNewInterface } from '../../interfaces/district/district-new-interface';
import { DistrictUpdateInterface } from '../../interfaces/district/district-update-interface';
import { DistrictDataInterface } from '../../interfaces/district/district-data-interface';
import { DistrictListInterface } from '../../interfaces/district/district-list-interface';
import { DistrictEditInterface } from '../../interfaces/district/district-edit-interface';
import { UserDistrictListInterface } from '../../interfaces/district/user-district-list-interface';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  protected baseURl = '/treasury/districts/';

  constructor(
    private http: HttpClient
  ) { }

  public getDistrictsList(unitId: number): Observable<DistrictListInterface[]> {
    const url = `${this.baseURl}unit/${unitId}/list`;
    return this.http
      .get<DistrictListInterface[]>(url);
  }

  public getDistricts(unitId: number): Observable<DistrictDataInterface[]> {
    const url = `${this.baseURl}unit/${unitId}`;
    return this.http
      .get<DistrictDataInterface[]>(url);
  }

  public getDistrictEdit(districtId: number): Observable<DistrictEditInterface> {
    const url = `${this.baseURl}${districtId}`;
    return this.http
      .get<DistrictEditInterface>(url);
  }

  public postDistrict(district: DistrictNewInterface): Observable<boolean> {
    return this.http
      .post<boolean>(this.baseURl, district);
  }
  public putDistrict(districtId: number, district: DistrictUpdateInterface): Observable<boolean> {
    const url = `${this.baseURl}${districtId}`;
    return this.http
      .put<boolean>(url, district);
  }

  public deleteDistrict(districtId: number): Observable<boolean> {
    const url = `${this.baseURl}${districtId}`;
    return this.http
      .delete<boolean>(url);
  }

  public getUsersDistrictsList(unitId: number): Observable<UserDistrictListInterface[]> {
    const url = `${this.baseURl}user/unit/${unitId}`;
    return this.http
      .get<UserDistrictListInterface[]>(url);
  }
}

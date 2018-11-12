import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DistrictNewInterface } from '../../interfaces/district/district-new-interface';
import { Observable } from 'rxjs';
import { DistrictUpdateInterface } from '../../interfaces/district/district-update-interface';

@Injectable({
  providedIn: 'root'
})
export class DistrictService {
  protected baseURl = '/treasury/districts/';

  constructor(
    private http: HttpClient
  ) { }

  public postDistrict(district: DistrictNewInterface): Observable<boolean> {
    return this.http
      .post<boolean>(this.baseURl, district);
  }
  public putDistrict(districtId: number, district: DistrictUpdateInterface): Observable<boolean> {
    const url = `${this.baseURl}${districtId}`;
    return this.http
      .put<boolean>(url, district);
  }

}

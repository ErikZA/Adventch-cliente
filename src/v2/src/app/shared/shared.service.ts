import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Release } from './models/release.model';
import { Unit } from './models/unit.model';
import { User } from './models/user.model';
import { Profile } from '../modules/administration/models/profile/profile.model';

@Injectable()
export class SharedService {

  constructor(
    private http: HttpClient
  ) { }

  public getUnits(id): Observable<Unit[]> {
    const url = `/shared/getUnits/${id}`;
    return this.http
      .get<Unit[]>(url);
  }

  generateReport(data) {
    const url = '/shared/generateReport';
    return this.http
      .post<any>(url, data);
  }

  getReleaseNotes() {
    const url = '/shared/getReleasesNotes/';
    return this.http
      .get<Release[]>(url);
  }

  public getCurrentRelease(): Observable<Release> {
    const url = '/shared/getCurrentRelease/';
    return this.http
      .get<Release>(url);
  }

  insertReleaseNotes(data) {
    const url = '/shared/insertReleaseNotes';
    return this.http
      .post<any>(url, data);
  }

  public getUser(id: number): Observable<User> {
    const url = `/usermanagement/${id}/`;
    return this.http
      .get<User>(url);
  }

  public saveUser(user: any): Observable<User> {
    if (!user.id || !user.unitId) {
      throw new Error('user id is invalid for edit');
    }
    const url = `/usermanagement/${user.id}/`;
    return this.http
      .put<User>(url, user);
  }

  public getProfilesUser(id: number, unitId: number): Observable<Profile[]> {
    const url = `/usermanagement/${id}/profile/unit/${unitId}`;
    return this.http
      .get<Profile[]>(url);
  }

  public passwordReset(password: { token: string, password: string }): Observable<any> {
    const url = '/auth/password-reset';
    return this.http
      .post<any>(url, password);
  }
}

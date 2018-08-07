import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

import { Unit } from './models/unit.model';
import { EModules } from './models/modules.enum';
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
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getUnitModules(unitId: number): Observable<EModules[]> {
    const url = `/shared/getModules/${unitId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  generateReport(data) {
    const url = '/shared/generateReport';
    return this.http
      .post(url, data)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getReleaseNotes() {
    const url = '/shared/getReleasesNotes/';
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getCurrentRelease() {
    const url = '/shared/getCurrentRelease/';
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  insertReleaseNotes(data) {
    const url = '/shared/insertReleaseNotes';
    return this.http
      .post(url, data)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getUser(id: number): Observable<User> {
    const url = `/usermanagement/${id}/`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public saveUser(user: any): Observable<User> {
    if (!user.id || !user.unitId) {
      throw new Error('user id is invalid for edit');
    }
    const url = `/usermanagement/${user.id}/`;
    return this.http
      .put(url, user)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProfilesUser(id: number, unitId: number): Observable<Profile[]> {
    const url = `/usermanagement/${id}/profile/unit/${unitId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public passwordReset(password: { token: string, password: string }): Observable<any> {
    const url = '/auth/password-reset';
    return this.http
      .post(url, password)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

import { NewProfile } from './models/profile/new-profile.model';
import { Feature } from './models/feature.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Role } from './models/role.model';
import { EModules } from '../../shared/models/modules.enum';
import { User } from '../../shared/models/user.model';
import { Profile } from './models/profile/profile.model';
import { EditProfile } from './models/profile/edit-profile.model';

@Injectable()
export class AdministrationService {

  constructor(
    private http: HttpClient
  ) { }

  /**
   * Rotas Novas
   */

  public getFeaturesBySoftware(software: EModules): Observable<any> {
    const url = `/profile/features/software/${software}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProfiles(unitId: number): Observable<Profile[]> {
    const url = `/profile/unit/${unitId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProfile(id: number): Observable<Profile> {
    const url = `/profile/${id}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getEditProfile(id: number): Observable<EditProfile> {
    const url = `/profile/${id}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public deleteProfile(profileId: number): Observable<any> {
    const url = `/profile/${profileId}`;
    return this.http
      .delete(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public postProfile(profile: NewProfile): Observable<any> {
    const url = '/profile/';
    return this.http
      .post(url, profile)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public putProfile(profile: EditProfile, id: number): Observable<any> {
    const url = `/profile/${id}`;
    return this.http
      .put(url, profile)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  /**
   * Rotas Antigas
   */

  public getRoles(unitId: number): Observable<Role[]> {
    const url = `/administration/role/getRoles/${unitId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getFeatures(modules: EModules[]): Observable<Feature[]> {
    const url = `/administration/role/getFeatures/${modules}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getRole(id: number): Observable<Role> {
    const url = `/administration/role/getRole/${id}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public saveRole(role: any): Observable<any> {
    const url = '/administration/role/saveRole';
    return this.http
      .post(url, role)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public deleteRole(roleId: number): Observable<any> {
    const url = `/administration/role/removeRole/${roleId}`;
    return this.http
      .delete(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  /*
  Users
  */

  public getUser(id: number, unitId: number): Observable<User> {
    const url = `/usermanagement/${id}/unit/${unitId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getUsers(unitId: number): Observable<User[]> {
    const url = `/usermanagement/unit/${unitId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getModules(unitId: number): Observable<EModules[]> {
    const url = `/administration/user/getModules/${unitId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public saveUser(user: any): Observable<any> {
    const url = '/usermanagement/';
    return this.http
      .post(url, user)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  public editUser(user: any, userId: number): Observable<any> {
    const url = `/usermanagement/${userId}`;
    return this.http
      .put(url, user)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public deleteUser(userId: number): Observable<any> {
    const url = `/administration/user/removeUser/${userId}`;
    return this.http
      .delete(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

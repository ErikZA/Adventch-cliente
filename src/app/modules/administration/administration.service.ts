
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { NewProfile } from './models/profile/new-profile.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { EModules } from '../../shared/models/modules.enum';
import { User } from '../../shared/models/user.model';
import { Profile } from './models/profile/profile.model';
import { EditProfile } from './models/profile/edit-profile.model';
import { Feature } from './models/feature.model';

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
      .get<any>(url);
  }

  public getProfiles(unitId: number): Observable<Profile[]> {
    const url = `/profile/unit/${unitId}`;
    return this.http
      .get<Profile[]>(url);
  }

  public getProfile(id: number): Observable<Profile> {
    const url = `/profile/${id}`;
    return this.http
      .get<Profile>(url);
  }

  public getEditProfile(id: number): Observable<EditProfile> {
    const url = `/profile/${id}`;
    return this.http
      .get<EditProfile>(url);
  }

  public deleteProfile(profileId: number): Observable<any> {
    const url = `/profile/${profileId}`;
    return this.http
      .delete<any>(url);
  }

  public postProfile(profile: NewProfile): Observable<any> {
    const url = '/profile/';
    return this.http
      .post<any>(url, profile);
  }

  public putProfile(profile: EditProfile, id: number): Observable<any> {
    const url = `/profile/${id}`;
    return this.http
      .put<any>(url, profile);
  }


  /*
  Users
  */

  public getUser(id: number, unitId: number): Observable<User> {
    const url = `/usermanagement/${id}/unit/${unitId}`;
    return this.http
      .get<User>(url);
  }

  public getUsers(unitId: number): Observable<User[]> {
    const url = `/usermanagement/unit/${unitId}`;
    return this.http
      .get<User[]>(url);
  }

  public getModules(unitId: number): Observable<EModules[]> {
    const url = `/administration/user/getModules/${unitId}`;
    return this.http
      .get<EModules[]>(url);
  }

  public saveUser(user: any): Observable<any> {
    const url = '/usermanagement/';
    return this.http
      .post<any>(url, user);
  }
  public editUser(user: any, userId: number): Observable<any> {
    const url = `/usermanagement/${userId}`;
    return this.http
      .put<any>(url, user);
  }

  public deleteUser(userId: number): Observable<any> {
    const url = `/administration/user/removeUser/${userId}`;
    return this.http
      .delete<any>(url);
  }
}

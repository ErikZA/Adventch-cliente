import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserDataInterface } from '../../interfaces/user/user-data-interface';
import { Observable } from 'rxjs';
import { UserEditInterface } from '../../interfaces/user/user-edit-interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  protected baseURl = '/usermanagement/';

  constructor(
    private http: HttpClient
  ) { }

  public getUsers(unitId: number): Observable<UserDataInterface[]> {
    const url = `${this.baseURl}unit/${unitId}`;
    return this.http
      .get<UserDataInterface[]>(url);
  }

  public getUserEdit(idUser: number, unitId: number) {
    const url = `${this.baseURl}${idUser}/unit/${unitId}`;
    return this.http
      .get<UserEditInterface>(url);
  }

}

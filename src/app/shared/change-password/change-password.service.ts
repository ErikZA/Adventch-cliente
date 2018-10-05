
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';



@Injectable()
export class ChangePasswordService {

  constructor(
    private http: HttpClient
  ) { }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const body = JSON.stringify({ userId: userId, currentPassword: currentPassword, newPassword: newPassword });
    return this.http
      .put('/shared/updatePassword/', body)

  }

}

import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ChangePasswordService {

  constructor(
    private http: HttpClient
  ) { }

  changePassword(userId: number, currentPassword: string, newPassword: string): Observable<any> {
    const body = JSON.stringify({ userId: userId, currentPassword: currentPassword, newPassword: newPassword });
    return this.http
      .put('/shared/updatePassword/', body)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

}

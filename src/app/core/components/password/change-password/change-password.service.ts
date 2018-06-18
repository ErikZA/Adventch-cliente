import { Injectable } from '@angular/core';
import { Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
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
      .catch((error: any) => Observable.throw(error || 'Server error'));
      // .toPromise()
      // .then((res: Response) => res.json())
      // .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Promise.reject(errMsg);
  }

}

import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ChangePasswordService {

  constructor(
    private http: Http
  ) { }

  changePasswordCooperated(currentPassword: string, newPassword: string): Promise<any> {
    let body = JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword });
    return this.http
      .put('/cooperated/changePassword/', body)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError);
  }

  changePasswordAdmin(currentPassword: string, newPassword: string): Promise<any> {
    let body = JSON.stringify({ currentPassword: currentPassword, newPassword: newPassword });
    return this.http
      .put('/admin/changePassword/', body)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError);
  }

  managerChangePassword(userId: string, newPassword: string): Promise<any> {
    let body = JSON.stringify({ userId: userId, newPassword: newPassword });
    return this.http
      .put('/admin/managerChangePassword/', body)
      .toPromise()
      .then((res: Response) => res.json())
      .catch(this.handleError);
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

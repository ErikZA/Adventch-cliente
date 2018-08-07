import { Injectable } from '@angular/core';
import { AuthService } from '../../../auth.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class RecoverStore {

  constructor(
    private service: AuthService
  ) { }

  public sendEmailResetPasswordRecovery(data: { email: string }): Observable<any> {
    return this.service.passwordRecovery(data);
  }

}

import { Observable } from 'rxjs';
import { ICommand, CommandsHandlerService, ICommandResult, EErrorCode } from '@adventech/ngx-adventech/handlers/public-api';
import { environment } from 'src/environments/environment';

export class LoginRequestCommand implements ICommand {

  constructor(
    public client_id?: string,
    public redirect_uri?: string,
    public response_type?: string,
    public scope?: number[],
    public remote_ip_address?: string,
    public expires_in?: number,
    public email?: boolean,
    public password?: string,
  ) { }

  getError(handler: CommandsHandlerService): ICommandResult {
    if (!this.client_id) {
      return { errorCode: EErrorCode.invalidParameters, errorMessage: 'Parameter client_id cannot be null.' } as IQexCommandResult;
    }
    if (!this.redirect_uri) {
      return { errorCode: EErrorCode.invalidParameters, errorMessage: 'Parameter redirect_uri cannot be null.' } as IQexCommandResult;
    }
    if (!this.email) {
      return { errorCode: EErrorCode.invalidParameters, errorMessage: 'Parameter email cannot be null.' } as IQexCommandResult;
    }
    if (!this.password) {
      return { errorCode: EErrorCode.invalidParameters, errorMessage: 'Parameter password cannot be null.' } as IQexCommandResult;
    }

    return null;
  }

  hasPermission(handler: CommandsHandlerService): boolean {
    return true;
  }

  execute(handler: CommandsHandlerService): Observable<ICommandResult> {
    const url = `${environment.identityApiUrl}users/login/`;

    return handler.http.post<ICommandResult>(url, this);
  }
}

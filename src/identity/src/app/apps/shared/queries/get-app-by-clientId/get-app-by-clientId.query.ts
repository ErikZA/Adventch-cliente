import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { IApp } from './view-model/app.interface';
import { environment } from 'src/environments/environment';
import { IQuery, QueriesHandlerService, IQueryResult } from '@adventech/ngx-adventech/handlers';

export class GetAppByClientIdQuery implements IQuery<IApp> {

  constructor(
    public clientId: string
  ) { }

  isValid(): boolean {
    return true;
  }

  hasPermission(queriesHandler: QueriesHandlerService): boolean {
    return true;
  }

  execute(queriesHandler: QueriesHandlerService): Observable<IQueryResult<IApp>> {
    const url = `${environment.identityApiUrl}apps/clientId/${this.clientId}`;

    return queriesHandler.http.get<IQueryResult<IApp>>(url)
      .pipe(
        map((result: IQueryResult<IApp>) => {
          return result;
        })
      );
  }
}

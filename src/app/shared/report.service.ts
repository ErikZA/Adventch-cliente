import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { EModules } from './models/modules.enum';
import { auth } from '../auth/auth';

@Injectable()
export class ReportService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public reportProcess(processId, password): Observable<any> {
    const urlConsult = document.location.origin + '/educacao';
    const params = JSON.stringify({ processId: processId, url: urlConsult, password: password });
    return this.viewReport('process', EModules.Scholarship, params);
  }

  public reportProcesses(data: any): Observable<any> {
    const urlConsult = document.location.origin + '/educacao';
    data.url = urlConsult;
    const params = JSON.stringify(data);
    return this.viewReport('processGeral', EModules.Scholarship, params);
  }

  private viewReport(reportName: string, moduleId: number, params: any): Observable<any> {
    const currentUserId = auth.getCurrentUser().id;
    const currentUnit = auth.getCurrentUnit();
    // tslint:disable-next-line:max-line-length
    const url = `${environment.apiUrlReport}/reports/view/${reportName}?userId=${currentUserId}&module=${moduleId}&values=${params}&unitId=${currentUnit.id}&unitName=${currentUnit.name}`;
    return this.http
      .get(url, { responseType: 'blob' })
      .map(res => new Blob([res], { type: 'application/pdf' }))
      .catch(err => Observable.throw(new Error(err)));
  }

  /* Relatório de tesouraria */
  public reportObservationsGeral(data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.viewReport('observationsGeral', EModules.Treasury, params);
  }

}

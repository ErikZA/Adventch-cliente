import { Injectable } from '@angular/core';
import { Http, ResponseContentType } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { EModules } from './models/modules.enum';

@Injectable()
export class ReportService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  reportProcess(processId, password): Observable<any> {
    const urlConsult = document.location.origin + '/educacao';
    const params = JSON.stringify({ processId: processId, url: urlConsult, password: password });
    return this.viewReport('process', EModules.Scholarship, params);
  }

  private viewReport(reportName: string, moduleId: number, params: any): Observable<any> {
    const currentUserId = this.authService.getCurrentUser().id;
    const url = `${environment.apiUrlReport}/reports/view/${reportName}?userId=${currentUserId}&module=${moduleId}&values=${params}`;
    return this.http
      .get(url, { responseType: 'blob' })
      .map(res => new Blob([res], { type: 'application/pdf' }))
      .catch(err => Observable.throw(new Error(err)));
  }

}


import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';




import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { EModules } from './models/modules.enum';
import { auth } from '../auth/auth';
import { Filter } from '../core/components/filter/Filter.model';

@Injectable()
export class ReportService {

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  public reportProcess(processId): Observable<any> {
    const urlConsult = document.location.origin + '/educacao';
    const params = JSON.stringify({ processId: processId, url: urlConsult });
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
      .get(url, { responseType: 'blob' });
      // .map(res => new Blob([res], { type: 'application/pdf' }))
      // .catch(err => observableThrowError(new Error(err)));
  }

  /* Relatório de tesouraria */
  public reportObservationsGeral(data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.viewReport('observationsGeral', EModules.Treasury, params);
  }

  public reportAvaliationsGeral(data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.viewReport('avaliationsGeral', EModules.Treasury, params);
  }

  public reportAvaliationsDetail(data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.viewReport('avaliationsDetails', EModules.Treasury, params);
  }

  public reportRequirementsGeral(data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.viewReport('requirementsGeral', EModules.Treasury, params);
  }

  public reportChurchesGeral(data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.viewReport('churchesGeral', EModules.Treasury, params);
  }

  public reportAvaliationDashboard(data: any): Observable<any> {
    const params = JSON.stringify(data);
    return this.viewReport('avaliationsDashboard', EModules.Treasury, params);
  }


  /**
   * Método para selecionar e formatar os parâmetros dos filtros avançados. O retorno será [TODOS] ou [Filtro1, Filtro2]
   * @param selecteds lista de ids selecionados
   * @param data lista com o conteúdo do filtro
   */
  public getParams(selecteds: number[], data: Filter[]): string {
    if (selecteds.length === 0 || selecteds.length === data.length) {
      return '[TODOS]';
    }
    const cities = data.filter(f => selecteds.includes(Number(f.id)));

    return this.formatString(String(cities.map(m => m.name)));
  }

  private formatString(str: string): string {
    const newStr = str.replace(new RegExp(',', 'g'), ', ');
    return `[${newStr}]`;
  }

}

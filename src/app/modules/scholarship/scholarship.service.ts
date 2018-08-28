import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';

import { Process } from './models/process';
import { Responsible } from './models/responsible';
import { StudentSerie } from './models/studentSerie';
import { ProcessDocument } from './models/processDocument';
import { ProcessResponsibleInterface } from './interfaces/process-responsible-interface';
import { ProcessCountStatusInterface } from './interfaces/process-count-status-interface';
import { SchoolProcessInterface } from './interfaces/school-process-interface';
import { ProcessDataInterface } from './interfaces/process-data-interface';
import { EditProcessViewModel, NewProcessViewModel } from './interfaces/process-view-models';

@Injectable()
export class ScholarshipService {
  schoolSelected = -1;
  statusSelected = 0;
  scholarshipReport: any;
  refresh$: Observable<boolean>;
  public refresh: Subject<boolean>;
  currentResponsible = new EventEmitter<Responsible>();
  showApp = new EventEmitter<boolean>();


  constructor(
    private http: HttpClient
  ) {
    this.refresh = new Subject<boolean>();
    this.refresh$ = this.refresh.asObservable();
  }

  update(t) {
    this.refresh = t;
  }

  updateSchool(id) {
    this.schoolSelected = id;
  }

  updateStatus(status) {
    this.statusSelected = status;
  }

  setReport(any) {
    this.scholarshipReport = any;
  }

  getReport() {
    return this.scholarshipReport;
  }



  // New
  public getProcessCountStatus(unitId: number): Observable<ProcessCountStatusInterface> {
    const url = `/scholarship/process/status/unit/${unitId}/count`;
    const params = new HttpParams().set('schoolId', this.schoolSelected.toString());
    return this.http
      .get<ProcessCountStatusInterface>(url, { params: params })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getSchools(): Observable<SchoolProcessInterface[]> {
    const url = `/scholarship/school`;
    return this.http
      .get<SchoolProcessInterface[]>(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  private setParamsProcessByUnit(status: number[]): HttpParams {
    const params = new HttpParams();
    return this.appendStatusParamsToProcess(params, status);
  }

  private appendStatusParamsToProcess(params: HttpParams, status: number[]): HttpParams {
    if (status.length > 0) {
      status.forEach(s => {
        params.append('statusIds', s.toString());
      });
    }
    return params;
  }

  public getProcessesByUnit(schools: number[], status: number[], query: string): Observable<ProcessDataInterface[]> {
    let params = new HttpParams();
    if (query) { params = params.set('query', query); }
    if (status.length > 0) {
      status.forEach(s => {
        params = params.append('statusIds', String(s));
      });
    }
    if (schools.length > 0) {
      schools.forEach(s => {
        params = params.append('ids', String(s));
      });
    }
    const url = `/scholarship/process/schools`;
    return this.http
      .get<ProcessDataInterface[]>(url, { params: params })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcessesBySchool(schoolId: number, status: number[], query: string): Observable<ProcessDataInterface[]> {
    let params = new HttpParams();
    if (query) { params = params.set('query', query); }
    if (status.length > 0) { params = params.set('statusIds', String(status)); }
    const url = `/scholarship/process/school/${schoolId}`;
    return this.http
      .get<ProcessDataInterface[]>(url, { params: params })
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getResponsibles(schoolId: number): Observable<Responsible[]> {
    const url = `/scholarship/process/getAllResponsibles/${schoolId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getResponsible(responsibleCPF: string): Observable<Responsible> {
    const url = `/scholarship/responsible/cpf/${responsibleCPF}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public saveProcess(process: NewProcessViewModel): Observable<any> {
    const url = '/scholarship/process/';
    return this.http
      .post(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  public editProcess(processId: number, process: NewProcessViewModel): Observable<any> {
    const url = `/scholarship/process/${processId}`;
    return this.http
      .put(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcessById(id: number): Observable<EditProcessViewModel> {
    const url = `/scholarship/process/${id}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcessByIdentity(identity: string): Observable<Process> {
    const url = `/scholarship/process/getProcessByIdentity/${identity}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public changeProcessStatus(processId: number, status: number, model: { userId: number }): Observable<any> {
    const url = `/scholarship/process/${processId}/status/${status}`;
    return this.http
      .put<any>(url, model)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public saveVacancy(processId: number, model: { userId: number, status: number, dataRegistration: Date }): Observable<any> {
    const url = `/scholarship/process/${processId}/status/approve`;
    return this.http
      .put<any>(url, model)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public savePendency(processId: number, model: { userId: number, pendency: string }): Observable<Process> {
    const url = `/scholarship/process/${processId}/status/pending/`;
    return this.http
      .put<any>(url, model)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public saveReject(processId: number, model: { userId: number, motiveReject: string }) {
    const url = `/scholarship/process/${processId}/status/rejected/`;
    return this.http
      .put<any>(url, model)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public sentDocuments(processId: number, model: { userId: number }): Observable<any> {
    const url = `/scholarship/process/${processId}/sentDocuments/`;
    return this.http
      .put<any>(url, model)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public deleteProcess(processId): Observable<any> {
    const url = `/scholarship/process/${processId}`;
    return this.http
      .delete<any>(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getStudentSeries(): Observable<StudentSerie[]> {
    const url = '/scholarship/process/series';
    return this.http
      .get<StudentSerie[]>(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getAllDocuments(): Observable<ProcessDocument[]> {
    const url = '/scholarship/process/documents';
    return this.http
      .get<ProcessDocument[]>(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  /*
  Consult
   */

  public generateNewPasswordResponsible(model: { userId: number, responsibleId: number }): Observable<any> {
    const url = '/scholarship/responsible/password/new';
    return this.http
    .put<any>(url, model)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcessesResponsible(responsibleId): Observable<ProcessResponsibleInterface[]> {
    const url = `/scholarship/process/responsible/${responsibleId}`;
    return this.http
      .get<ProcessResponsibleInterface[]>(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

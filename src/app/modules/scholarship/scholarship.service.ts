
import { Observable, Subject } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';


import { Process } from './models/process';
import { Responsible } from './models/responsible';
import { StudentSerie } from './models/studentSerie';
import { ProcessDocument } from './models/processDocument';
import { ProcessResponsibleInterface } from './interfaces/process-responsible-interface';
import { ProcessCountStatusInterface } from './interfaces/process-count-status-interface';
import { SchoolProcessInterface } from './interfaces/school-process-interface';
import { ProcessDataInterface } from './interfaces/process-data-interface';
import { EditProcessViewModel, NewProcessViewModel, ProcessUploadViewModel } from './interfaces/process-view-models';
import { DocumentProcessDataInterface } from './interfaces/document-process-data-interface';
import { ShiftInterface } from './interfaces/shift-interface';

@Injectable()
export class ScholarshipService {
  schoolSelected = -1;
  statusSelected = 0;
  yearSelected = 1;
  schoolYearSelected = [];
  scholarshipReport: any;
  refresh$: Observable<boolean>;
  public refresh: Subject<boolean>;
  currentResponsible = new EventEmitter<Responsible>();
  showApp = new EventEmitter<boolean>();
  idUnit = -1;

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

  updateSchoolYearSelected(schoolYear) {
    this.schoolYearSelected = schoolYear;
  }

  updateStatus(status) {
    this.statusSelected = status;
  }
  updateYear(year) {
    this.yearSelected = year;
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
    let params = new HttpParams().set('schoolId', this.schoolSelected.toString());
    if (this.schoolYearSelected.length > 0) {
          params = params.append('schoolYearSelected', `[${this.schoolYearSelected.toString()}]`);
      }
    return this.http
      .get<ProcessCountStatusInterface>(url, { params: params });
  }

  public getSchools(): Observable<SchoolProcessInterface[]> {
    const url = `/scholarship/school`;
    return this.http
      .get<SchoolProcessInterface[]>(url);
  }
  private appendStatusParamsToProcess(params: HttpParams, status: number[]): HttpParams {
    if (status.length > 0) {
      status.forEach(s => {
        params.append('statusIds', s.toString());
      });
    }
    return params;
  }

  public getProcessesByUnit(schools: number[], status: number[], year: number[], schoolYear: number[],
    query: string): Observable<ProcessDataInterface[]> {
    let params = new HttpParams();
    if (query) { params = params.set('query', query); }
    if (year.length > 0) {
      year.forEach(s => {
        params = params.append('year', String(s));
      });
    }
    if (schoolYear.length > 0) {
      schoolYear.forEach(s => {
        params = params.append('schoolYear', String(s));
      });
    }
    if (status.length > 0) {
      status.forEach(s => {
        params = params.append('statusIds', String(s));
      });
    }
    if (schools.length > 0) {
      schools.forEach(s => {
        params = params.append('schoolsIds', String(s));
      });
    }
    const url = `/scholarship/process/schools`;
    return this.http
      .get<ProcessDataInterface[]>(url, { params: params });
  }

  public getProcessesBySchool(schoolId: number, status: number[], year: number[], schoolYear: number[],
    query: string): Observable<ProcessDataInterface[]> {
    let params = new HttpParams();
    if (query) { params = params.set('query', query); }
    if (status.length > 0) {
      status.forEach(s => {
        params = params.append('statusIds', String(s));
      });
    }
    if (year.length > 0) {
      year.forEach(s => {
        params = params.append('year', String(s));
      });
    }
    if (schoolYear.length > 0) {
      schoolYear.forEach(s => {
        params = params.append('schoolYear', String(s));
      });
    }
    const url = `/scholarship/process/school/${schoolId}`;
    return this.http
      .get<ProcessDataInterface[]>(url, { params: params });
  }

  public getResponsibles(schoolId: number): Observable<Responsible[]> {
    const url = `/scholarship/process/getAllResponsibles/${schoolId}`;
    return this.http
      .get<Responsible[]>(url);
  }

  public getResponsible(responsibleCPF: string): Observable<Responsible> {
    const url = `/scholarship/responsible/cpf/${responsibleCPF}`;
    return this.http
      .get<Responsible>(url);
  }

  public saveProcess(process: NewProcessViewModel): Observable<any> {
    const url = '/scholarship/process/';
    return this.http
      .post<any>(url, process);
  }
  public editProcess(processId: number, process: NewProcessViewModel): Observable<any> {
    const url = `/scholarship/process/${processId}`;
    return this.http
      .put<any>(url, process);
  }

  public getProcessById(id: number): Observable<EditProcessViewModel> {
    const url = `/scholarship/process/${id}`;
    return this.http
      .get<EditProcessViewModel>(url);
  }

  public getProcessByIdentity(identity: string): Observable<Process> {
    const url = `/scholarship/process/getProcessByIdentity/${identity}`;
    return this.http
      .get<Process>(url);
  }

  public changeProcessStatus(processId: number, status: number, model: { userId: number, sendMail: boolean }): Observable<boolean> {
    const url = `/scholarship/process/${processId}/status/${status}`;
    return this.http
      .put<boolean>(url, model);
  }

  public saveVacancy(processId: number,
    model: { userId: number, status: number, dataRegistration: Date, shiftId: number }
    ): Observable<boolean> {
    const url = `/scholarship/process/${processId}/status/approve`;
    return this.http
      .put<boolean>(url, model);
  }

  public savePendency(processId: number, model: { userId: number, pendency: string }): Observable<boolean> {
    const url = `/scholarship/process/${processId}/status/pending/`;
    return this.http
      .put<boolean>(url, model);
  }

  public saveReject(processId: number, model: { userId: number, motiveReject: string }): Observable<boolean> {
    const url = `/scholarship/process/${processId}/status/rejected/`;
    return this.http
      .put<boolean>(url, model);
  }

  public sentDocuments(processId: number, model: { userId: number }): Observable<boolean> {
    const url = `/scholarship/process/${processId}/sentDocuments/`;
    return this.http
      .put<any>(url, model);
  }

  public deleteProcess(processId): Observable<any> {
    const url = `/scholarship/process/${processId}`;
    return this.http
      .delete<any>(url);
  }

  public getStudentSeries(): Observable<StudentSerie[]> {
    const url = '/scholarship/process/series';
    return this.http
      .get<StudentSerie[]>(url);
  }

  public getAllShifts(): Observable<ShiftInterface[]> {
    const url = '/scholarship/process/shifts';
    return this.http
      .get<ShiftInterface[]>(url);
  }

  public getAllDocuments(): Observable<ProcessDocument[]> {
    const url = '/scholarship/process/documents';
    const params = new HttpParams().set('unitId', this.idUnit.toString());
    return this.http
      .get<ProcessDocument[]>(url, { params: params });
  }

  public getProcessDocuments(processId: number): Observable<DocumentProcessDataInterface[]> {
    const url = `/scholarship/process/${processId}/documents`;
    return this.http
      .get<DocumentProcessDataInterface[]>(url);
  }

  public getProcessUploads(processId: number): Observable<ProcessUploadViewModel[]> {
    const url = `/scholarship/process/${processId}/files`;
    return this.http
      .get<ProcessUploadViewModel[]>(url);
  }

  public getFile(fileId: number, unitId: number): Observable<any> {
    const url = `/scholarship/process/download/${fileId}/container/${unitId}`;
    return this.http
      .get(url, { responseType: 'blob' });
  }
  /*
  Consult
   */

  public generateNewPasswordResponsible(model: { userId: number, responsibleId: number }): Observable<any> {
    const url = '/scholarship/responsible/password/new';
    return this.http
    .put<any>(url, model);
  }

  public getProcessesResponsible(responsibleId): Observable<ProcessResponsibleInterface[]> {
    const url = `/scholarship/process/responsible/${responsibleId}`;
    return this.http
      .get<ProcessResponsibleInterface[]>(url);
  }
}

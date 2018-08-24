import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';

import { AuthService } from '../../shared/auth.service';

import { Student } from './models/student';
import { Process } from './models/process';
import { Responsible } from './models/responsible';
import { StudentSerie } from './models/studentSerie';
import { ProcessDocument } from './models/processDocument';
import { ProcessResponsibleInterface } from './interfaces/process-responsible-interface';
import { ProcessCountStatusInterface } from './interfaces/process-count-status-interface';
import { SchoolProcessInterface } from './interfaces/school-process-interface';
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

  public getSchools(unitId: number): Observable<SchoolProcessInterface[]> {
    const url = `/scholarship/school/unit/${unitId}`;
    return this.http
      .get<SchoolProcessInterface[]>(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcesses(schoolId: number[], unitId: number): Observable<Process[]> {
    const url = `/scholarship/process/${unitId}`;
    const params = new HttpParams().set('schools', schoolId.toString());
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getResponsibles(schoolId: number): Observable<Responsible[]> {
    const url = `/scholarship/process/getAllResponsibles/${schoolId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getChildrenStudents(responsibleId: number): Observable<Student[]> {
    const url = `/scholarship/process/getAllChildrenStudents/${responsibleId}`;
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

  public savePendency(pendencyDataProcess: any): Observable<Process> {
    const url = '/scholarship/Process/savePendency/';
    return this.http
      .post(url, pendencyDataProcess)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public updateToStatus(processStatusChanged: any): Observable<any> {
    const url = '/scholarship/Process/changeStatus/';
    return this.http
      .post(url, processStatusChanged)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public saveVacancy(vacancyDataProcess: any): Observable<any> {
    const url = '/scholarship/Process/saveVacancy/';
    return this.http
      .post(url, vacancyDataProcess)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public deleteProcess(processId, userId): Observable<any> {
    const url = `/scholarship/Process/deleteProcess?idProcess=${processId}&idUser=${userId}`;
    return this.http
      .delete(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  saveReject(rejectDataProcess: any) {
    const url = '/scholarship/Process/saveReject/';
    return this.http
      .post(url, rejectDataProcess)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getStudentSeries(): Observable<StudentSerie[]> {
    const url = '/scholarship/process/series';
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  sendDocument(submittedDocuments: any): Observable<Process> {
    const url = '/scholarship/process/sendDocument/';
    return this.http
      .post(url, submittedDocuments)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  getAllDocuments(): Observable<ProcessDocument[]> {
    const url = '/scholarship/process/documents';
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  /*
  Consult
   */
  public getPasswordResponsible(processId: number): Observable<Responsible> {
    const url = `/scholarship/responsible/getPasswordByProcess/${processId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public generateNewPasswordResponsible(dataNewPassword: any): Observable<string> {
    const url = '/scholarship/responsible/generateNewPassword/';
    return this.http
    .post(url, dataNewPassword)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcessesResponsible(responsibleId): Observable<ProcessResponsibleInterface[]> {
    const url = `/scholarship/responsible/${responsibleId}/processes`;
    return this.http
      .get<ProcessResponsibleInterface[]>(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/catch';

import { AuthService } from '../../shared/auth.service';

import { School } from './models/school';
import { Student } from './models/student';
import { Process } from './models/process';
import { Responsible } from './models/responsible';
import { StudentSerie } from './models/studentSerie';

@Injectable()
export class ScholarshipService {
  schoolSelected = -1;
  processSelected: Process;
  statusSelected = 0;
  processEdit: Process;
  scholarshipReport: any;
  refresh$: Observable<boolean>;
  public refresh: Subject<boolean>;
  currentResponsible = new EventEmitter<Responsible>();
  showApp = new EventEmitter<boolean>();


  constructor(
    private http: HttpClient,
    private auth: AuthService
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

  updateProcess(process) {
    this.processSelected = process;
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
  public getSchools(): Observable<School[]> {
    const url = '/scholarship/Process/getAllSchools/';
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

  public getResponsible(schoolId: number, responsibleCPF: string): Observable<Responsible> {
    const url = `/scholarship/process/getResponsible?schoolId=${schoolId}&responsibleCPF=${responsibleCPF}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public postProcess(process: Process): Observable<any> {
    const url = '/scholarship/process/saveProcess';
    return this.http
      .post(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcesses(schoolId: number): Observable<Process[]> {
    const url = `/scholarship/process/getProcesses/${schoolId}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  public getProcessById(processId: number): Observable<Process> {
    const url = `/scholarship/Process/getProcess/${processId}`;
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

  saveReject(rejectDataProcess: any) {
    const url = '/scholarship/Process/saveReject/';
    return this.http
      .post(url, rejectDataProcess)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getStudentSeries(): Observable<StudentSerie[]> {
    const url = '/scholarship/process/getAllStudentsSeries';
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

  /*
  Consult
   */

  login(cpf: string, password: string) {
    const body = JSON.stringify({ cpf: cpf, password: password });
    return this.http
      .post<any>('/scholarship/responsible/login', body)
      .retry(3)
      .toPromise()
      .then(data => {
        let responsible = data.responsible as Responsible;
        if (responsible) {
          // user.photoUrl = `${environment.apiUrl}/users/photo/${user.identifier}/${user.photoDate}`;
          localStorage.setItem('currentResponsible', JSON.stringify(responsible));
          localStorage.setItem('tokenResponsible', data.token);
          this.currentResponsible.emit(responsible);
          this.showApp.emit(true);
        } else {
          responsible = new Responsible();
          this.currentResponsible.emit(responsible);
          this.showApp.emit(false);
        }
        return responsible;
      }).catch((error: any) => {
        Promise.reject(error);
      });
  }

  getPasswordResponsible(processId): Observable<Responsible> {
    const url = '/scholarship/responsible/getPasswordByProcess/' + processId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  generateNewPasswordResponsible(idResponsible): Observable<string> {
    const url = '/scholarship/responsible/generateNewPassword/';
    const data = {
      id: idResponsible,
      idUser: this.auth.getCurrentUser().id
    };
    return this.http
    .post(url, data)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getProcessesResponsible(responsibleId): Observable<Process[]> {
    const url = '/scholarship/responsible/getAllProcesses/' + responsibleId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

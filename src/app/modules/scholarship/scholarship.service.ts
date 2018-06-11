import { Http, Response, Headers, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { School } from './models/school';
import { Responsible } from './models/responsible';
import { Student } from './models/student';
import { Process } from './models/process';
import { AuthService } from '../../shared/auth.service';
import { Subject } from 'rxjs/Subject';
import { StudentSerie } from './models/studentSerie';
import { environment } from '../../../environments/environment';

@Injectable()
export class ScholarshipService {
  schoolSelected = '-1';
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

  getSchools(): Observable<School[]> {
    const url = '/scholarship/Process/getAllSchools/';
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getResponsibles(schoolId): Observable<Responsible[]> {
    const url = '/scholarship/process/getAllResponsibles/' + schoolId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getChildrenStudents(responsibleId): Observable<Student[]> {
    const url = '/scholarship/process/getAllChildrenStudents/' + responsibleId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getResponsible(schoolId, responsibleCPF): Observable<Responsible> {
    const url = `/scholarship/process/getResponsible?schoolId=${schoolId}&responsibleCPF=${responsibleCPF}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  postProcess(data): Observable<any> {
    const url = '/scholarship/process/saveProcess';
    return this.http
      .post(url, data)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getProcesses(schoolId): Observable<Process[]> {
    const url = '/scholarship/process/getProcesses/' + schoolId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getProcessById(processId): Observable<Process> {
    const url = '/scholarship/Process/getProcess/' + processId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  savePendency(pendency): Observable<Process> {
    const url = '/scholarship/Process/savePendency/';
    const processPendency: any = {
      id: this.processSelected.id,
      pendency: pendency,
      user: this.auth.getCurrentUser().identifier,
      status: 3,
      isSendDocument: false,
      description: 'Adicionando pendência'
    };
    this.processSelected.pendency = pendency;
    this.processSelected.status = 3;
    return this.http
      .post(url, processPendency)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  updateToStatus(idProcess, idStatus, description) {
    const url = '/scholarship/Process/changeStatus/';
    const process = {
      id: idProcess,
      status: idStatus,
      description: description,
      user: this.auth.getCurrentUser().identifier,
    };
    return this.http
      .post(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  saveVacancy(dateRegistration, idStatus, description) {
    const url = '/scholarship/Process/saveVacancy/';
    const process = {
      id: this.processSelected.id,
      status: idStatus,
      description: description,
      dateRegistration: dateRegistration,
      user: this.auth.getCurrentUser().identifier
    };
    this.processSelected.status = idStatus;
    this.processSelected.dateRegistration = dateRegistration;
    return this.http
      .post(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  saveReject(idProcess, idStatus, description, motive) {
    const url = '/scholarship/Process/saveReject/';
    const process = {
      id: idProcess,
      status: idStatus,
      description: description,
      motive: motive,
      user: this.auth.getCurrentUser().identifier,
    };
    return this.http
      .post(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getStudentSeries(): Observable<StudentSerie[]> {
    const url = '/scholarship/process/getAllStudentsSeries';
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  sendDocument(process: Process): Observable<Process> {
    const url = '/scholarship/process/sendDocument/';
    const submittedDocuments: any = {
      id: process.id,
      user: this.auth.getCurrentUser().identifier,
      isSendDocument: process.isSendDocument,
      description: process.isSendDocument ? 'Documentos Pendentes Enviados' : 'Documentos Pendentes Não Enviados'
    };
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

  getProcessesResponsible(responsibleId): Observable<Process[]> {
    const url = '/scholarship/responsible/getAllProcesses/' + responsibleId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

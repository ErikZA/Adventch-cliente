import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { School } from './models/school';
import { Responsible } from './models/responsible';
import { Student } from './models/student';
import { Process } from './models/process';
import { AuthService } from '../shared/auth.service';
import { Subject } from 'rxjs';

@Injectable()
export class ScholarshipService {
  schoolSelected: string = '-1';
  processSelected: Process;
  statusSelected: number = 0;
  refresh$: Observable<boolean>;
  public refresh: Subject<boolean>;


  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {     
    this.refresh = new Subject<boolean>();
    this.refresh$ = this.refresh.asObservable();
  }

  update(t){
    this.refresh = t;
  }

  updateSchool(id){
    this.schoolSelected = id;
  }

  updateProcess(process){
    this.processSelected = process;
  }

  updateStatus(status){
    this.statusSelected = status;
  }

  getSchools(): Observable<School[]> {
    let url = '/scholarship/Process/getAllSchools/';
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getResponsibles(schoolId): Observable<Responsible[]> {
    let url = '/scholarship/process/getAllResponsibles/' + schoolId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getChildrenStudents(responsibleId): Observable<Student[]> {
    let url = '/scholarship/process/getAllChildrenStudents/' + responsibleId;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getResponsible(schoolId, responsibleCPF): Observable<Responsible> {
    let url = `/scholarship/process/getResponsible?schoolId=${schoolId}&responsibleCPF=${responsibleCPF}`;
    return this.http
      .get(url)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  postProcess(data): Observable<any>{
    let url = `/scholarship/process/newProcess`;
    return this.http.post(url, data)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getProcess(schoolId): Observable<Process[]> {
    let url = '/scholarship/Process/getAllProcesses/' + schoolId;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  savePendency(pendency): Observable<Process> {
    let url = '/scholarship/Process/savePendency/';
    let processPendency: any = {
      id: this.processSelected.id,
      pendency: pendency,
      user: this.auth.getCurrentUser().identifier,
      status: 3,
      description: 'Adicionando pendência'
    };
    this.processSelected.pendency = pendency;
    this.processSelected.status = 3;
    return this.http
      .post(url, processPendency)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  updateToStatus(idProcess, idStatus, description){
    let url = '/scholarship/Process/changeStatus/';
    let process = {
      id: idProcess,
      status: idStatus,
      description: description,
      user: this.auth.getCurrentUser().identifier,
    };
    return this.http
      .post(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));

  }

  saveVacancy(dateRegistration, idStatus, description){
    let url = '/scholarship/Process/saveVacancy/';
    let process = {
      id: this.processSelected.id,
      status: idStatus,
      description: description,
      dateRegistration: dateRegistration,
      user: this.auth.getCurrentUser().identifier
    }
    this.processSelected.status = idStatus;
    this.processSelected.dateRegistration = dateRegistration;
    return this.http
      .post(url, process)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  saveReject(idProcess, idStatus, description, motive){
    let url = '/scholarship/Process/saveReject/';
    let process = {
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
}

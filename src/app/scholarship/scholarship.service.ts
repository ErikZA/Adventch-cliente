import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { School } from './models/school';
import { Responsible } from './models/responsible';
import { Process } from './models/process';
import { AuthService } from '../shared/auth.service';

@Injectable()
export class ScholarshipService {
  schoolSelected: String = '-1';
  processSelected: Process;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  updateSchool(id){
    this.schoolSelected = id;
  }

  updateProcess(process){
    this.processSelected = process;
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

  getChildrenStudents(responsableId): Observable<Responsible[]> {
    let url = '/scholarship/process/getAllResponsibles/' + responsableId;
    return this.http
      .get(url)
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
    let processPendency = {
      id: this.processSelected[0].id,
      pendency: pendency,
      user: this.auth.getCurrentUser().identifier
    };
    this.processSelected[0].pendency = pendency;
    this.processSelected[0].status = 3;
    return this.http
      .post(url, processPendency)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

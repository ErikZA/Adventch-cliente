import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { School } from './models/school';
import { Responsible } from './models/responsible';
import { Student } from './models/student';

@Injectable()
export class ScholarshipService {

  constructor(
    private http: HttpClient
  ) { }

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
}

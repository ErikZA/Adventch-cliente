import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from './models/user.model';
import { Unit } from './models/unit.model';
import { Permission } from './models/permission.model';

@Injectable()
export class SharedService {

  constructor(
    private http: HttpClient
  ) { }

  getUnits(id): Observable<Unit[]> {
    let url = '/shared/getUnits/' + id;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  generateReport(data){    
    let url = '/shared/generateReport';
    return this.http
      .post(url, data)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getPermissions(idUser, idUnit): Observable<Permission[]>{
    let url = '/shared/getPermissions/' + idUser + '/' + idUnit;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}
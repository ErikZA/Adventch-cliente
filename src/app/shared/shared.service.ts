import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from './models/user.model';
import { Unit } from './models/unit.model';

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
}
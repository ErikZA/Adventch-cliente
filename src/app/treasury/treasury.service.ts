import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { Treasurer } from './models/treasurer';
import { Church } from './models/church';

@Injectable()
export class TreasuryService {
  constructor(
    private http: HttpClient
  ) { }

  getTreasurers(): Observable<Treasurer[]> {
    let url = '/treasury/treasurers/getAllTreasurers/1';
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getChurches(unitId): Observable<Church[]> {
    let url = '/treasury/treasurers/getAllChurches/' + unitId;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  saveNewTreasurer(treasure): Observable<any> {
    let url = '/treasury/treasurers/newTreasurer';
    return this.http
      .post(url, treasure)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

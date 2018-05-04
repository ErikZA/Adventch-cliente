import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Treasurer } from './models/treasurer';
import { Church } from './models/church';

@Injectable()
export class TreasuryService {
  constructor(
    private http: HttpClient
  ) { }

  getTreasurers(unitId): Observable<Treasurer[]> {
    let url = '/treasury/treasurers/getAllTreasurers/' + unitId;
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

  saveTreasurer(treasure): Observable<any> {
    let url = (treasure.id == null ? '/treasury/treasurers/newTreasurer' : '/treasury/treasurers/updateTreasurer');
    return this.http
      .post(url, treasure)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteTreasurer(id): Observable<any> {
    return this.http
      .delete('/treasury/treasurers/deleteTreasurer/' + id)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteTreasurers(ids): Observable<Church[]> {
    let url = '/treasury/treasurers/deleteTreasurers/\'' + ids + '\'';
    return this.http
      .delete(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

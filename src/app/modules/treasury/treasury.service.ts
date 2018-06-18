import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Treasurer } from './models/treasurer';
import { Church } from './models/church';

@Injectable()
export class TreasuryService {
  treasurer: Treasurer = new Treasurer();
  constructor(
    private http: HttpClient
  ) { }

  getTreasurer() {
    return this.treasurer;
  }

  setTreasurer(treasurer) {
    this.treasurer = treasurer;
  }

  getTreasurers(unitId): Observable<Treasurer[]> {
    const url = '/treasury/treasurers/getAllTreasurers/' + unitId;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getChurches(unitId): Observable<Church[]> {
    const url = '/treasury/treasurers/getAllChurches/' + unitId;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  saveTreasurer(treasure): Observable<any> {
    const url = (treasure.id == null ? '/treasury/treasurers/newTreasurer' : '/treasury/treasurers/updateTreasurer');
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
    const url = '/treasury/treasurers/deleteTreasurers/\'' + ids + '\'';
    return this.http
      .delete(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
}

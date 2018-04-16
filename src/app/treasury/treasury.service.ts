import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';
import { Treasurer } from './models/treasurer';

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
}

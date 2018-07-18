import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { Treasurer } from './models/treasurer';
import { Church } from './models/church';
import { Districts } from './models/districts';
import { State } from '../../shared/models/state.model';
import { City } from '../../shared/models/city.model';

@Injectable()
export class TreasuryService {
  treasurer: Treasurer = new Treasurer();
  district: Districts = new Districts();
  constructor(
    private http: HttpClient
  ) { }

  getTreasurer() {
    return this.treasurer;
  }

  setTreasurer(treasurer) {
    this.treasurer = treasurer;
  }

  getDistrict() {
    return this.district;
  }

  setDistrict(districts) {
    this.district = districts;
  }

  getTreasurers(unitId): Observable<Treasurer[]> {
    const url = '/treasury/treasurers/getAllTreasurers/' + unitId;
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

  /*
    Igrejas
  */
  getChurches(unitId): Observable<Church[]> {
    const url = '/treasury/churches/getAllChurches/' + unitId;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  saveChurch(data): Observable<any> {
    const url = '/treasury/churches/saveChurch';
    return this.http
      .post(url, data)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  deleteChurch(id): Observable<Church[]> {
    const url = '/treasury/churches/deleteChurch/' + id;
    return this.http
      .delete(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  /*
    Distritos
  */
 getDistricts(unitId): Observable<Districts[]> {
  const url = '/treasury/districts/getAllDistricts/' + unitId;
  return this.http
    .get(url)
    .map((res: Response) => res)
    .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  saveDistricts(data): Observable<any> {
    const url = '/treasury/districts/newDistrict';
    return this.http
      .post(url, data)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }
  removeDistricts(id): Observable<Districts[]> {
    const url = '/treasury/districts/removeDistrict/' + id;
    return this.http
      .delete(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getUsers() {
    const url = '/treasury/districts/getAllUsers/';
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getStates(): Observable<State[]> {
    const url = '/treasury/churches/getAllStates/';
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

  getCities(stateId): Observable<City[]> {
    const url = '/treasury/churches/getAllCitiesByState/' + stateId;
    return this.http
      .get(url)
      .map((res: Response) => res)
      .catch((error: any) => Observable.throw(error || 'Server error'));
  }

}

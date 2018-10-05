
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Treasurer } from './models/treasurer';
import { Church } from './models/church';
import { Districts } from './models/districts';
import { State } from '../../shared/models/state.model';
import { City } from '../../shared/models/city.model';
import { Observation } from './models/observation';
import { User } from '../../shared/models/user.model';
import { Avaliation, ChurchAvaliation } from './models/avaliation';
import { Requirement } from './models/requirement';
import { AvaliationRequirement } from './models/avaliationRequirement';

@Injectable()
export class TreasuryService {
  treasurer: Treasurer = new Treasurer();
  district: Districts = new Districts();
  constructor(
    private http: HttpClient
  ) { }

  getTreasurer(id: number): Observable<Treasurer> {
    const url = '/treasury/treasurers/getTreasurer/' + id;
    return this.http
      .get<Treasurer>(url);
  }

  setTreasurer(treasurer) {
    this.treasurer = treasurer;
  }

  getDistrict(id: number): Observable<Districts> {
    const url = '/treasury/districts/getDistrict/' + id;
    return this.http
      .get<Districts>(url);
  }

  setDistrict(districts) {
    this.district = districts;
  }

  getTreasurers(unitId): Observable<Treasurer[]> {
    const url = '/treasury/treasurers/getAllTreasurers/' + unitId;
    return this.http
      .get<Treasurer[]>(url);
  }

  saveTreasurer(treasure): Observable<any> {
    const url = (treasure.id == null ? '/treasury/treasurers/newTreasurer' : '/treasury/treasurers/updateTreasurer');
    return this.http
      .post<any>(url, treasure);
  }

  deleteTreasurer(id): Observable<any> {
    return this.http
      .delete<any>('/treasury/treasurers/deleteTreasurer/' + id);
  }

  deleteTreasurers(ids): Observable<Church[]> {
    const url = '/treasury/treasurers/deleteTreasurers/\'' + ids + '\'';
    return this.http
      .delete<any>(url);
  }

  /*
    Igrejas
  */
  getChurches(unitId): Observable<Church[]> {
    const url = '/treasury/churches/getAllChurches/' + unitId;
    return this.http
      .get<Church[]>(url);
  }
  getChurch(unitId): Observable<Church> {
    const url = '/treasury/churches/getChurch/' + unitId;
    return this.http
      .get<Church>(url);
  }
  loadChurches(unitId): Observable<Church[]> {
    const url = '/treasury/churches/loadChurches/' + unitId;
    return this.http
      .get<Church[]>(url);
  }

  saveChurch(data): Observable<any> {
    const url = '/treasury/churches/saveChurch';
    return this.http
      .post<any>(url, data);
  }

  deleteChurch(id): Observable<Church[]> {
    const url = '/treasury/churches/deleteChurch/' + id;
    return this.http
      .delete<any>(url);
  }

  getUsers2(unitId): Observable<User[]> {
    const url = '/treasury/churches/getUsers/' + unitId;
    return this.http
      .get<User[]>(url);
  }
  /*
    Distritos
  */
 getDistricts(unitId): Observable<Districts[]> {
  const url = '/treasury/districts/getAllDistricts/' + unitId;
  return this.http
    .get<Districts[]>(url);
  }
  saveDistricts(data): Observable<any> {
    const url = '/treasury/districts/newDistrict';
    return this.http
      .post<any>(url, data);
  }
  removeDistricts(id): Observable<any> {
    const url = '/treasury/districts/removeDistrict/' + id;
    return this.http
      .delete<any>(url);
  }

  getUsers(unit) {
    const url = '/treasury/districts/getAllUsersAnalysts/' + unit;
    return this.http
      .get<any>(url);
  }

  loadAnalysts(unit): Observable<User[]> {
    const url = '/treasury/districts/loadAnalysts/' + unit;
    return this.http
      .get<User[]>(url);
  }

  getStates(): Observable<State[]> {
    const url = '/treasury/churches/getAllStates/';
    return this.http
      .get<State[]>(url);
  }

  getCities(stateId): Observable<City[]> {
    const url = '/treasury/churches/getAllCitiesByState/' + stateId;
    return this.http
      .get<City[]>(url);
  }
  /*
    Observações
  */
  getObservations(unitId): Observable<Observation[]> {
    const url = '/treasury/observations/GetAllObservations/' + unitId;
    return this.http
      .get<Observation[]>(url);
  }
  getObservation(id: number): Observable<Observation> {
    const url = '/treasury/observations/GetObservation/' + id;
    return this.http
      .get<Observation>(url);
  }

  saveObservation(data): Observable<Observation> {
    const url = '/treasury/observations/saveObservation';
    return this.http
      .post<Observation>(url, data);
  }

  deleteObservation(id): Observable<boolean> {
    const url = '/treasury/observations/deleteObservation/' + id;
    return this.http
      .delete<boolean>(url);
  }

  finalizeObservation(data: { id: number }): Observable<Observation> {
    const url = '/treasury/observations/finalizeObservation/';
    return this.http
      .post<Observation>(url, data);
  }

  loadAllChurches(unitId): Observable<Church[]> {
    const url = '/treasury/churches/loadAllChurches/' + unitId;
    return this.http
      .get<Church[]>(url);
  }

  // Dashboard
  getTreasuryDashboard(unitId, idAnalyst) {
    const url = '/treasury/dashboard/getTreasuryDashboard/' + unitId + '/' + idAnalyst;
    return this.http
      .get<any>(url);
  }


  getAvaliationRaking(unitId) {
    const url = '/treasury/dashboard/getAvaliationsRanking/' + unitId;
    return this.http
      .get(url);
  }

  /* Avaliações */
  getAvaliations(unitId): Observable<ChurchAvaliation[]> {
    const url = '/treasury/avaliation/getAvaliations/' + unitId;
    return this.http
      .get<ChurchAvaliation[]>(url);
  }
  getAnualAvaliation(churchId, year): Observable<Avaliation> {
    const url = '/treasury/avaliation/getAnualAvaliation/' + churchId + '/' + year;
    return this.http
      .get<Avaliation>(url);
  }

  // Avaliações
  getRequirements(unitId): Observable<Requirement[]> {
    const url = `/treasury/requirement/getRequirements/${unitId}`;
    return this.http
      .get<Requirement[]>(url);
  }

  getRequirement(requirementId: number): Observable<Requirement> {
    const url = `/treasury/requirement/${requirementId}`;
    return this.http
      .get<Requirement>(url);
  }

  saveRequirements(data): Observable<Requirement> {
    const url = '/treasury/requirement/AddRequirement/' + data;
    return this.http
      .post<Requirement>(url, data);
  }

  deleteRequirement(data): Observable<Requirement> {
    const url = '/treasury/requirement/RemoveRequirement/' + data;
    return this.http
      .post<Requirement>(url, data);
  }

  getAvaliationRequirements(avaliationId): Observable<AvaliationRequirement[]> {
    const url = '/treasury/avaliation/getAvaliationRequirements/' + avaliationId;
    return this.http
      .get<AvaliationRequirement[]>(url);
  }

  postAvaliation(data): Observable<any> {
    const url = '/treasury/avaliation/postAvaliation';
    return this.http
      .post<any>(url, data);
  }

  finalizeAvaliation(data): Observable<any> {
    const url = '/treasury/avaliation/finalizeAvaliation/';
    return this.http
      .put<any>(url, data);
  }
}

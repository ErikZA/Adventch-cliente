import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { auth } from './../../auth/auth';
import { Unit } from './../../shared/models/unit.model';

@Injectable({
  providedIn: 'root'
})
export class UnitService {

  private unitSource: BehaviorSubject<Unit> =  new BehaviorSubject(this.checkIfContainsUnitLocal());
  currentUnit: Observable<Unit> = this.unitSource.asObservable();

  constructor() { }

  public changeUnit(unit: Unit): void {
    this.unitSource.next(unit);
  }


  private checkIfContainsUnitLocal() {
    const unitLocal = auth.getCurrentUnit();
    if (unitLocal) {
      return unitLocal;
    }
    return null;
  }
}

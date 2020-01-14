import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { auth } from './../../../../auth/auth';
import { SharedService } from '../../../../shared/shared.service';
import { Unit } from '../../../../shared/models/unit.model';
import { AuthService } from '../../../../shared/auth.service';
import { UnitService } from './../../../services/unit.service';

@Component({
  selector: 'app-button-unit',
  templateUrl: './button-unit.component.html',
  styleUrls: ['./button-unit.component.scss']
})
export class ButtonUnitComponent implements OnInit {
  loading = true;
  units: Unit[] = [];
  unit: Unit;

  constructor(
    private service: SharedService,
    private authService: AuthService,
    private unitService: UnitService,
    private router: Router

  ) { }

  ngOnInit() {
    this.getUnitsOfUser();
  }

  private getUnitsOfUser() {
    this.loading = true;
    const localUnits = auth.getUserUnits();
    const userId = auth.getCurrentDecodedToken().userId;
    this.unit = auth.getCurrentUnit();
    if (!Array.isArray(localUnits) && typeof userId === 'number') {
      this.getUnits(userId);
    } else if ((this.unit === undefined || this.unit === null) && typeof userId === 'number' && Array.isArray(localUnits)) {
      this.updateUnit(localUnits[0]);
      this.setUnits(localUnits);
    } else if (!(this.unit === undefined || this.unit === null)) {
      this.setUnits(localUnits);
    }
  }

  private setUnits(localUnits: any[]) {
    this.units = localUnits;
    this.loading = false;
  }

  private getUnits(userId: number) {
    this.service.getUnits(userId)
      .pipe(takeWhile(u => u !== null && u !== undefined), distinctUntilChanged()).subscribe(units => {
        auth.setUserUnits(units);
        this.setUnits(units);
        this.updateUnit(units[0]);
      }, () => {
        auth.logoffMain();
        this.router.navigate(['**']);
      });
  }

  public updateUnit(unit: Unit): void {
    this.unit = unit;
    this.unitService.changeUnit(unit);
    this.authService.setCurrentUnit(unit);
  }
}

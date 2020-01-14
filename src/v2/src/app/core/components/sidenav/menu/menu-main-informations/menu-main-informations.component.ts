import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Unit } from '../../../../../shared/models/unit.model';
import { UnitService } from '../../../../services/unit.service';
import { tap, debounceTime } from 'rxjs/operators';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-menu-main-informations',
  templateUrl: './menu-main-informations.component.html',
  styleUrls: ['./menu-main-informations.component.scss']
})
@AutoUnsubscribe()
export class MenuMainInformationsComponent implements OnInit, OnDestroy {

  loading = true;
  unit: Unit;
  subscribeUnit: Subscription;
  constructor(
    private unitService: UnitService
  ) { }

  ngOnInit() {
    this.getCurrentUnit();
  }

  ngOnDestroy(): void {

  }

  public getCurrentUnit(): void {
    this.loading = true;
    this.subscribeUnit = this.unitService
      .currentUnit
      .pipe(
        tap(() => this.loading = true),
        debounceTime(600)
      ).subscribe(unit => {
        if (unit) {
          this.unit = unit;
          this.loading = false;
        }
      });
  }

}

import { auth } from './../../../../../auth/auth';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Districts } from '../../../models/districts';
import { Router } from '@angular/router';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { utils } from '../../../../../shared/utils';

@Component({
  selector: 'app-districts-data',
  templateUrl: './districts-data.component.html',
  styleUrls: ['./districts-data.component.scss']
})
export class DistrictsDataComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  subscribeUnit: Subscription;

  districtsCache: Districts[] = [];
  districts: Districts[] = [];

  constructor(
    private router: Router,
    private treasureService: TreasuryService,
    private snackBar: MatSnackBar,
    private confirmDialogService: ConfirmDialogService,
  ) { }

  ngOnInit() {
    const unit = auth.getCurrentUnit();

    if (!Number.isInteger(unit.id) || unit.id === 0) {
      throw new Error('unit id is invalid');
    }
    this.getData(unit.id);
    this.search$.subscribe(
      value => {
        this.districts = this.districtsCache.filter(d => utils.buildSearchRegex(value).test(d.name));
      }
    );
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  getData(unitId: number) {
    this.treasureService.getDistricts(unitId).subscribe(districts => {
      this.districtsCache = districts;
      this.districts = districts;
    });
  }

  /* Usados pelo component */
  closeSidenav() {
    this.treasureService.setDistrict(new Districts());
    this.sidenavRight.close();
    this.router.navigate(['tesouraria/distritos']);
  }

  onScroll() {
    this.showList += 15;
  }

  remove(district: Districts) {
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover este distrito?', 'REMOVER')
      .subscribe(res => {
        if (res) {
          this.treasureService.removeDistricts(district.id).subscribe(data => {
            this.snackBar.open('Distrito removido com sucesso.', 'OK', { duration: 5000 });
            this.getData(auth.getCurrentUnit().id);
          });
        }
      });
  }

  edit(district: Districts) {
    if (district.id === undefined) {
      return;
    }
    this.router.navigate(['tesouraria/distritos/' + district.id + '/editar']);
  }
}

import { auth } from './../../../../../auth/auth';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';


import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { distinctUntilChanged } from 'rxjs/operators';

import { Districts } from '../../../models/districts';
import { DistrictsStore } from '../districts.store';
import { Router } from '@angular/router';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';

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

  districts$: Observable<Districts[]>;
  districts: Districts[] = new Array<Districts>();

  constructor(
    // private store: DistrictsStore,
    private router: Router,
    private treasureService: TreasuryService,
    // private sidenavService: SidenavService,
    private snackBar: MatSnackBar,
    private confirmDialogService: ConfirmDialogService,
  ) { }

  ngOnInit() {
    const unit = auth.getCurrentUnit();

    if (!Number.isInteger(unit.id) || unit.id === 0) {
      throw new Error('unit id is invalid');
    }
    this.getData(unit.id);
    // this.search$.subscribe(search => {
    //   this.districts$ = Observable.of(this.store.search(search));
    // });
    // this.getData();
    // this.subscribeUnit = auth.currentUnit.pipe(distinctUntilChanged()).subscribe(() => {
    //   this.getData();
    // });
    // this.sidenavService.setSidenav(this.sidenavRight);
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  private getData(unitId: number) {
    this.treasureService.getDistricts(unitId).subscribe(districts => {
      this.districts = districts;
    });
    // this.districts$ = this.store.districts$;
    // this.store.loadAll();
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

  // openSidenav() {
  //   this.treasureService.setDistrict(new Districts());
  //   // this.sidenavService.open();
  // }

  remove(district: Districts) {
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover este distrito?', 'REMOVER')
      .subscribe(res => {
        if (res) {
          // this.store.remove(district.id);
          this.treasureService.removeDistricts(district.id).subscribe(data => {
            this.snackBar.open('Distrito removido com sucesso.', 'OK', { duration: 5000 });
          });
        }
      });
  }

  edit(district: Districts) {
    if (district.id === undefined) {
      return;
    }
    // this.store.openDistrict(district);
    this.router.navigate(['tesouraria/distritos/' + district.id + '/editar']);
    // this.searchButton = false;
    // this.districts$ = this.store.districts$;
    // this.sidenavRight.open();
  }
}

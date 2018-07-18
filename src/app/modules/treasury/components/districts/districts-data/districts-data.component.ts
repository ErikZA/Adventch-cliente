import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Districts } from '../../../models/districts';
import { DistrictsStore } from '../districts.store';
import { AuthService } from '../../../../../shared/auth.service';
import { Router } from '@angular/router';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { MatSidenav } from '@angular/material';
import { TreasuryService } from '../../../treasury.service';

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
  district: Districts[] = new Array<Districts>();

  constructor(
    private store: DistrictsStore,
    private authService: AuthService,
    private router: Router,
    private treasureService: TreasuryService,
    private sidenavService: SidenavService,
  ) { }

  ngOnInit() {
    this.search$.subscribe(search => {
      this.store.searchProcess(search);
      this.districts$ = this.store.districts$;
    });
    // this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
    //   this.getData();
    //   this.closeSidenav();
    // });
    this.getData();
    this.sidenavService.setSidenav(this.sidenavRight);
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  private getData() {
    this.districts$ = this.store.districts$;
    this.store.loadAll();
  }

  /* Usados pelo component */
  closeSidenav() {
    this.treasureService.setDistrict(new Districts());
    this.sidenavService.close();
    this.router.navigate(['tesouraria/distritos']);
  }

  onScroll() {
    this.showList += 15;
  }

  openSidenav() {
    this.treasureService.setDistrict(new Districts());
    this.sidenavService.open();
  }

  remove(district: Districts) {
    this.store.remove(district.id);
  }

  edit(district: Districts) {
    if (district.id === undefined) {
      return;
    }
    this.store.openDistrict(district);
    this.router.navigate(['tesouraria/distritos/' + district.id + '/editar']);
    this.sidenavRight.open();
  }
}

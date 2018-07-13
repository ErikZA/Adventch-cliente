import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { Subject, Observable, Subscription } from 'rxjs';

import { Church } from '../../../models/church';
import { ChurchStore } from '../church.store';
import { AuthService } from '../../../../../shared/auth.service';

@Component({
  selector: 'app-church-data',
  templateUrl: './church-data.component.html',
  styleUrls: ['./church-data.component.scss']
})
export class ChurchDataComponent implements OnInit, OnDestroy {

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  subscribeUnit: Subscription;

  churches$: Observable<Church[]>;
  churches: Church[] = new Array<Church>();

  constructor(
    private store: ChurchStore,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.search$.subscribe(search => {
      this.store.searchProcess(search);
      this.churches$ = this.store.churches$;
    });
    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.getData();
      this.closeSidenav();
    });
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  private getData() {
    this.churches$ = this.store.churches$;
    this.store.loadAll();
  }

  /* Usados pelo component */
  closeSidenav() {
    //this.treasureService.setTreasurer(new Treasurer());
    //this.sidenavService.close();
    //this.router.navigate(['tesouraria/tesoureiros']);
  }

  onScroll() {
    this.showList += 15;
  }

  openSidenav() {
    //this.treasureService.setTreasurer(new Treasurer());
    //this.sidenavService.open();
  }

  remove(church: Church) {
  }

  edit(church: Church) {
  }
}

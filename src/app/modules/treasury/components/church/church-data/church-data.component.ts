import { Component, OnInit, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject, Observable, Subscription } from 'rxjs';

import { Church } from '../../../models/church';
import { ChurchStore } from '../church.store';
import { AuthService } from '../../../../../shared/auth.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';

@Component({
  selector: 'app-church-data',
  templateUrl: './church-data.component.html',
  styleUrls: ['./church-data.component.scss']
})
export class ChurchDataComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  subscribeUnit: Subscription;

  churches$: Observable<Church[]>;
  churches: Church[] = new Array<Church>();

  constructor(
    private store: ChurchStore,
    private authService: AuthService,
    private confirmDialogService: ConfirmDialogService,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.navigate([this.router.url.replace(/.*/, 'tesouraria/igrejas')]);
    this.search$.subscribe(search => {
      this.store.searchProcess(search);
      this.churches$ = this.store.churches$;
    });
    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.getData();
      this.closeSidenav();
    });
    this.sidenavService.setSidenav(this.sidenavRight);
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
    this.sidenavService.open();
  }

  remove(church: Church) {
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a igreja?', 'REMOVER')
      .subscribe(res => { this.store.remove(church.id) });
  }

  edit(church: Church) {
    this.store.church = church;
    this.router.navigate([church.id, 'editar'], { relativeTo: this.route });
    this.openSidenav();
  }
}

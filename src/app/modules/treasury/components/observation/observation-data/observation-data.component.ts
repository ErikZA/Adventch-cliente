import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../../../shared/auth.service';
import { Observation } from '../../../models/observation';
import { ObservationStore } from '../observation.store';

@Component({
  selector: 'app-observation-data',
  templateUrl: './observation-data.component.html',
  styleUrls: ['./observation-data.component.scss']
})
export class ObservationDataComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  subscribeUnit: Subscription;

  observations$: Observable<Observation[]>;
  observations: Observation[] = new Array<Observation>();

  constructor(
    private authService: AuthService,
    private store: ObservationStore,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate([this.router.url.replace(/.*/, 'tesouraria/observacoes')]);
    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.getData();
    });
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  private getData() {
    this.observations$ = this.store.observations$;
    this.store.loadAll();
  }

  /* Usados pelo component */
  public closeSidenav() {
    //this.sidenavService.close();
    this.router.navigate(['tesouraria/observacoes']);
  }

  public onScroll() {
    this.showList += 15;
  }

  public openSidenav() {
    //this.sidenavService.open();
  }

  public remove(observation: Observation) {
    //this.confirmDialogService
    //  .confirm('Remover', 'Você deseja realmente remover a igreja?', 'REMOVER')
    //  .subscribe(res => { this.store.remove(church.id) });
  }

  public edit(observation: Observation) {
    //this.store.church = church;
    //this.router.navigate([church.id, 'editar'], { relativeTo: this.route });
    //this.openSidenav();
  }
}

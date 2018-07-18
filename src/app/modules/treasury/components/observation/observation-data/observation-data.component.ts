import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../../../shared/auth.service';
import { Observation } from '../../../models/observation';
import { ObservationStore } from '../observation.store';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { Church } from '../../../models/church';
import { User } from '../../../../../shared/models/user.model';

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
  //observations: Observation[] = new Array<Observation>();
  churches$: Observable<Church[]>;
  analysts$: Observable<User[]>;
  responsibles$: Observable<User[]>;

  filterText: string;
  filterStatus: number;
  filterChurch: number;
  filterAnalyst: number;
  filterResponsible: number;
  filterPeriodStart: Date = new Date(new Date().getFullYear(), 0, 1);
  filterPeriodEnd: Date = new Date(new Date().getFullYear(), 11, 31);

  constructor(
    private authService: AuthService,
    public store: ObservationStore,
    private router: Router,
    private confirmDialogService: ConfirmDialogService
  ) { }

  ngOnInit() {
    this.router.navigate([this.router.url.replace(/.*/, 'tesouraria/observacoes')]);
    this.subscribeUnit = this.authService.currentUnit.subscribe(() => {
      this.getData();
      this.setObservables();
    });
    this.search$.subscribe(search => {
      this.filterText = search;
      this.search();
    });
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  private getData() {
    this.observations$ = this.store.observations$;
    this.store.loadAll();
  }

  private setObservables() {
    this.churches$ = Observable.of(this.store.churches);
    this.analysts$ = Observable.of(this.store.analysts);
    this.responsibles$ = Observable.of(this.store.responsibles);
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
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a observação?', 'REMOVER')
      .subscribe(res => {
        if (res) {
          this.store.remove(observation.id)
        }
      });
  }

  public edit(observation: Observation) {
    //this.store.church = church;
    //this.router.navigate([church.id, 'editar'], { relativeTo: this.route });
    //this.openSidenav();
  }

  public finalize(observation: Observation) {
    this.confirmDialogService
      .confirm('Finalizar', 'Você deseja realmente finalizar a observação?', 'FINALIZAR')
      .subscribe(res => {
        if (res) {
          this.store.finalize(observation.id);
        }
      });
  }

  public getStatus(status): string {
    if (status === 1) {
      return 'Aberta';
    }
    return 'Fechada'
  }

  public search() {
    let observations = this.store.searchText(this.filterText);
    if (this.filterStatus != undefined && this.filterStatus != null && this.filterStatus != 0) {
      observations = this.store.searchStatus(this.filterStatus, observations);
    }
    if (this.filterChurch != undefined && this.filterChurch != null && this.filterChurch != 0) {
      observations = this.store.searchChurches(this.filterChurch, observations);
    }
    if (this.filterAnalyst != undefined && this.filterAnalyst != null && this.filterAnalyst != 0) {
      observations = this.store.searchAnalysts(this.filterStatus, observations);
    }
    if (this.filterResponsible != undefined && this.filterResponsible != null && this.filterResponsible != 0) {
      observations = this.store.searchResponsibles(this.filterResponsible, observations);
    }
    observations = this.store.searchInDates(this.filterPeriodStart, this.filterPeriodEnd, observations);
    this.observations$ = Observable.of(observations);
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }
}

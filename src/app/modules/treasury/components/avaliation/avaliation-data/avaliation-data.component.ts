import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { Subject, Subscription } from 'rxjs';

import { AuthService } from '../../../../../shared/auth.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { Avaliation, AvaliationList } from '../../../models/avaliation';
import { auth } from '../../../../../auth/auth';
import { Observable } from 'rxjs/Observable';
import { AvaliationStore } from '../avaliation.store';
import { AvaliationRequirement } from '../../../models/avaliationRequirement';
import { EAvaliationStatus } from '../../../models/Enums';
@Component({
  selector: 'app-avaliation-data',
  templateUrl: './avaliation-data.component.html',
  styleUrls: ['./avaliation-data.component.scss']
})
export class AvaliationDataComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  subscribeUnit: Subscription;
  layout: String = 'row';
  
  avaliations$: Observable<AvaliationList[]>;
  avaliations: AvaliationList[] = new Array<AvaliationList>();

  constructor(
    private authService: AuthService,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute,
    private store: AvaliationStore
  ) { }

  ngOnInit() {
    this.getData();
    this.router.navigate([this.router.url.replace(/.*/, 'tesouraria/avaliacoes')]);
    this.search$.subscribe(search => {
      //this.filterText = search;
      this.search();
    });
    this.subscribeUnit = auth.currentUnit.subscribe(() => {
      this.getData();
      this.closeSidenav();
    });
    this.sidenavService.setSidenav(this.sidenavRight);
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  getData() {
    this.avaliations$ = this.store.avaliations$;
    this.store.loadAll();
  }

  /* Usados pelo component */
  closeSidenav() {
    this.sidenavService.close();
    this.router.navigate(['tesouraria/avaliacoes']);
  }

  onScroll() {
    this.showList += 15;
  }

  openSidenav() {
    this.sidenavService.open();
  }

  remove(avaliation: Avaliation) {
    /*this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a igreja?', 'REMOVER')
      .subscribe(res => {
        if (res) {
          this.store.remove(church.id);
        }
      });*/
  }

  edit(avaliation: Avaliation) {
    /*this.store.church = church;
    this.router.navigate([church.id, 'editar'], { relativeTo: this.route });
    this.openSidenav();
    this.searchButton = false;
    this.churches$ = this.store.churches$;*/
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public search() {

  }

  public getStatusString(status: EAvaliationStatus): string {
    switch (status) {
      case EAvaliationStatus.Valued:
        return "Avaliado";
      case EAvaliationStatus.Finished:
        return "Finalizado";
      default:
        return "Aguardando";
    }
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Church } from '../../../models/church';
import { ChurchStore } from '../church.store';
import { AuthService } from '../../../../../shared/auth.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { User } from '../../../../../shared/models/user.model';
import { City } from '../../../../../shared/models/city.model';
import { TreasuryService } from '../../../treasury.service';
import { Districts } from '../../../models/districts';
import { auth } from '../../../../../auth/auth';

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
  layout: String = 'row';

  churches$: Observable<Church[]>;
  churches: Church[] = new Array<Church>();

  cities$: Observable<City[]>;
  cities: City[] = new Array<City>();

  analysts$: Observable<User[]>;
  districts: Districts[] = new Array<Districts>();

  filterDistrict: number;
  filterCity: number;
  filterAnalyst: number;
  filterText = '';

  constructor(
    private store: ChurchStore,
    private authService: AuthService,
    private confirmDialogService: ConfirmDialogService,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute,
    private service: TreasuryService
  ) { }

  ngOnInit() {
    this.getData();
    this.router.navigate([this.router.url.replace(/.*/, 'tesouraria/igrejas')]);
    this.search$.subscribe(search => {
      this.filterText = search;
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

  private getData() {
    this.churches$ = this.store.churches$;
    this.store.loadAll();
    this.loadAll();
    this.churches$.subscribe(() => {
      this.store.loadFilters();
    });
  }

  private loadAll() {
    this.loadDistricts();
    this.loadCities();
    this.loadAnalysts();
  }

  private loadDistricts() {
    this.service.getDistricts(auth.getCurrentUnit().id).subscribe((data: Districts[]) => {
      this.districts = data;
    });
  }

  private loadCities() {
    this.cities$ = this.store.cities$;
  }

  private loadAnalysts() {
    this.analysts$ = this.store.analysts$;
  }

  /* Usados pelo component */
  closeSidenav() {
    this.sidenavService.close();
    this.router.navigate(['tesouraria/igrejas']);
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
      .subscribe(res => {
        if (res) {
          this.store.remove(church.id);
        }
      });
  }

  edit(church: Church) {
    this.store.church = church;
    this.router.navigate([church.id, 'editar'], { relativeTo: this.route });
    this.openSidenav();
    this.searchButton = false;
    this.churches$ = this.store.churches$;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public search() {
    let churchesFilttered = this.store.searchText(this.filterText);

    if (this.filterDistrict !== undefined && this.filterDistrict !== null && this.filterDistrict !== 0) {
      churchesFilttered = this.store.searchDistricts(this.filterDistrict, churchesFilttered);
    }

    if (this.filterCity !== undefined && this.filterCity !== null && this.filterCity !== 0) {
      churchesFilttered = this.store.searchCities(this.filterCity, churchesFilttered);
    }

    if (this.filterAnalyst !== undefined && this.filterAnalyst !== null && this.filterAnalyst !== 0) {
      churchesFilttered = this.store.searchAnalysts(this.filterAnalyst, churchesFilttered);
    }
    this.churches$ = Observable.of(churchesFilttered);
  }
}

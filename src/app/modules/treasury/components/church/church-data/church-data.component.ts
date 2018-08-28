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

  cities: City[] = new Array<City>();
  analysts: User[] = new Array<User>();
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
    //this.getData();
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
    //this.loadAll();
    this.churches$.subscribe(x => {
      this.loadAll(x);
    });
  }

  private loadAll(x: Church[]): void {
    this.loadCities(x);
    this.loadAnalysts(x);
    this.loadDistricts(x);
  }

  private loadCities(x: Church[]): void {
    this.churches = new Array<Church>();
    x.forEach(church => {
      if (this.cities.map(x => x.id).indexOf(church.city.id) === -1) {
        this.cities.push(church.city);
      }
    });
    this.cities.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadAnalysts(x: Church[]): void {
    this.analysts = new Array<User>();
    x.forEach(church => {
      if (church.district.id !== 0 && this.analysts.map(x => x.id).indexOf(church.district.analyst.id) === -1) {
        this.analysts.push(church.district.analyst);
      }
    });
    this.analysts.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadDistricts(x: Church[]): void {
    this.districts = new Array<Districts>();
    x.forEach(church => {
      if (church.district.id !== 0 && this.districts.map(x => x.id).indexOf(church.district.id) === -1) {
        this.districts.push(church.district);
      }
    });
    this.districts.sort((a, b) => a.name.localeCompare(b.name));
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

    // tslint:disable-next-line:triple-equals
    if (this.filterDistrict !== undefined && this.filterDistrict !== null && this.filterDistrict != 0) {
      churchesFilttered = this.store.searchDistricts(this.filterDistrict, churchesFilttered);
    }

    // tslint:disable-next-line:triple-equals
    if (this.filterCity !== undefined && this.filterCity !== null && this.filterCity != 0) {
      churchesFilttered = this.store.searchCities(this.filterCity, churchesFilttered);
    }

    // tslint:disable-next-line:triple-equals
    if (this.filterAnalyst !== undefined && this.filterAnalyst !== null && this.filterAnalyst != 0) {
      churchesFilttered = this.store.searchAnalysts(this.filterAnalyst, churchesFilttered);
    }
    this.churches$ = Observable.of(churchesFilttered);
  }
}

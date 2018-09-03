import { Component, OnInit, ViewChild } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { Church } from '../../../models/church';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { User } from '../../../../../shared/models/user.model';
import { City } from '../../../../../shared/models/city.model';
import { Districts } from '../../../models/districts';
import { auth } from '../../../../../auth/auth';
import { TreasuryService } from '../../../treasury.service';
import { utils } from '../../../../../shared/utils';

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

  churches: Church[] = new Array<Church>();
  churchesCache: Church[] = new Array<Church>();

  cities: City[] = new Array<City>();
  analysts: User[] = new Array<User>();
  districts: Districts[] = new Array<Districts>();

  filterDistrict: number;
  filterCity: number;
  filterAnalyst: number;
  filterText = '';

  constructor(
    private confirmDialogService: ConfirmDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private treasuryService: TreasuryService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.search$.subscribe(search => {
      this.filterText = search;
      this.search();
    });
    this.getData();
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  getData() {
    this.treasuryService.getChurches(auth.getCurrentUnit().id).subscribe(data => {
      this.churches = data;
      this.churchesCache = data;
      this.loadAnalysts(data);
      this.loadCities(data);
      this.loadDistricts(data);
    });
  }
  private loadCities(data: Church[]): void {
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(church => {
      if (this.cities.map(x => x.id).indexOf(church.city.id) === -1) {
        this.cities.push(church.city);
      }
    });
    this.cities.sort((a, b) => a.name.localeCompare(b.name));
  }
  private loadAnalysts(data: Church[]): void {
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(church => {
      if (church.district.id !== 0 && this.analysts.map(x => x.id).indexOf(church.district.analyst.id) === -1) {
        this.analysts.push(church.district.analyst);
      }
    });
    this.analysts.sort((a, b) => a.name.localeCompare(b.name));
  }
  private loadDistricts(data: Church[]): void {
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(church => {
      if (church.district.id !== 0 && this.districts.map(x => x.id).indexOf(church.district.id) === -1) {
        this.districts.push(church.district);
      }
    });
    this.districts.sort((a, b) => a.name.localeCompare(b.name));
  }
  /* Usados pelo component */
  closeSidenav() {
    this.sidenavRight.close();
    this.router.navigate(['tesouraria/igrejas']);
  }
  onScroll() {
    this.showList += 15;
  }
  remove(church: Church) {
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a igreja?', 'REMOVER')
      .subscribe(res => {
        if (res) {
          this.treasuryService.deleteChurch(church.id).subscribe(() => {
            this.snackBar.open('Removido com sucesso', 'OK', { duration: 5000 });
            this.getData();
          });
        }
      });
  }
  edit(church: Church) {
    this.router.navigate([church.id, 'editar'], { relativeTo: this.route });
  }
  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }
  public searchDistricts(idDistrict: number, churches: Church[]): Church[] {
    // tslint:disable-next-line:triple-equals
    return churches.filter(x => x.district.id == idDistrict);
  }

  public searchCities(idCity: number, churches: Church[]): Church[] {
    // tslint:disable-next-line:triple-equals
    return churches.filter(x => x.city.id == idCity);
  }

  public searchAnalysts(idAnalyst: number, churches: Church[]): Church[] {
    // tslint:disable-next-line:triple-equals
    return churches.filter(x => x.district.analyst.id == idAnalyst);
  }
  public search() {
    let churchesFilttered = this.churchesCache.filter(c => utils.buildSearchRegex(this.filterText).test(c.name));

    // tslint:disable-next-line:triple-equals
    if (this.filterDistrict !== undefined && this.filterDistrict !== null && this.filterDistrict != 0) {
      churchesFilttered = this.searchDistricts(this.filterDistrict, churchesFilttered);
    }

    // tslint:disable-next-line:triple-equals
    if (this.filterCity !== undefined && this.filterCity !== null && this.filterCity != 0) {
      churchesFilttered = this.searchCities(this.filterCity, churchesFilttered);
    }

    // tslint:disable-next-line:triple-equals
    if (this.filterAnalyst !== undefined && this.filterAnalyst !== null && this.filterAnalyst != 0) {
      churchesFilttered = this.searchAnalysts(this.filterAnalyst, churchesFilttered);
    }
    this.churches = churchesFilttered;
  }
}

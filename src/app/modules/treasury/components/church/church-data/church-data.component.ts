import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject ,  Subscription } from 'rxjs';
import { tap, skipWhile, switchMap } from 'rxjs/operators';

import { Church } from '../../../models/church';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { auth } from '../../../../../auth/auth';
import { TreasuryService } from '../../../treasury.service';
import { utils } from '../../../../../shared/utils';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';


@Component({
  selector: 'app-church-data',
  templateUrl: './church-data.component.html',
  styleUrls: ['./church-data.component.scss']
})
@AutoUnsubscribe()
export class ChurchDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = 'tesouraria/igrejas';

  searchButton = false;
  showList = 80;
  search$ = new Subject<string>();
  layout: String = 'row';

  churches: Church[] = [];
  churchesCache: Church[] = [];

  filterText = '';

  // new filter
  districtsSelecteds: number[] = [];
  districtsData: Filter[] = [];
  citiesSelecteds: number[] = [];
  citiesData: Filter[] = [];
  analystsSelecteds: number[] = [];
  analystsData: Filter[] = [];

  sub1: Subscription;
  subsConfirmFinalize: Subscription;

  constructor(
    protected router: Router,
    private confirmDialogService: ConfirmDialogService,
    private route: ActivatedRoute,
    private treasuryService: TreasuryService,
    private snackBar: MatSnackBar,
    private filterService: FilterService
  ) { super(router); }

  ngOnInit() {
    this.sub1 = this.getData()
      .pipe(
        switchMap(() => this.search$)
      ).subscribe(search => {
        this.filterText = search;
        this.search();
      });
  }

  ngOnDestroy(): void {

  }
  public getData() {
    this.search$.next('');
    return this.treasuryService.getChurches(auth.getCurrentUnit().id)
    .pipe(
      tap(data => {
        this.churches = data;
        this.churchesCache = data;
        this.loadAnalysts(data);
        this.loadCities(data);
        this.loadDistricts(data);
        this.search();
      })
    );
  }
  private loadCities(data: Church[]): void {
    this.citiesData = [];
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(church => {
      if (this.citiesData.map(x => x.id).indexOf(church.city.id) === -1) {
        this.citiesData.push(new Filter(Number(church.city.id), church.city.name));
      }
    });
    this.citiesData.sort((a, b) => a.name.localeCompare(b.name));
  }
  private loadAnalysts(data: Church[]): void {
    this.analystsData = [];
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(church => {
      if (church.district.id !== 0 && this.analystsData.map(x => x.id).indexOf(church.district.analyst.id) === -1) {
        this.analystsData.push(church.district.analyst);
      }
    });
    this.analystsData.sort((a, b) => a.name.localeCompare(b.name));
  }
  private loadDistricts(data: Church[]): void {
    this.districtsData = [];
    if (!Array.isArray(data)) {
      return;
    }
    data.forEach(church => {
      if (church.district.id !== 0 && this.districtsData.map(x => x.id).indexOf(church.district.id) === -1) {
        this.districtsData.push(new Filter(Number(church.district.id), church.district.name));
      }
    });
    this.districtsData.sort((a, b) => a.name.localeCompare(b.name));
  }
  public onScroll() {
    this.showList += 80;
  }

  public remove(church: Church) {
    this.subsConfirmFinalize = this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a igreja?', 'REMOVER')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.treasuryService.deleteChurch(church.id)),
        switchMap(() => this.getData()),
        tap(() => this.snackBar.open('Removido com sucesso', 'OK', { duration: 5000 }))
      ).subscribe();
  }
  public edit(church: Church) {
    this.router.navigate([church.id, 'editar'], { relativeTo: this.route });
  }
  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public search() {
    let churchesFilttered = this.churchesCache.filter(c => utils.buildSearchRegex(this.filterText).test(c.name.toUpperCase()));
    churchesFilttered = this.filterService.filter(churchesFilttered, 'district.id', this.districtsSelecteds);
    churchesFilttered = this.filterService.filter(churchesFilttered, 'city.id', this.citiesSelecteds);
    churchesFilttered = this.filterService.filter(churchesFilttered, 'district.analyst.id', this.analystsSelecteds);
    this.churches = churchesFilttered;
  }

  public checkDistrict(district) {
    this.districtsSelecteds = this.filterService.check(district, this.districtsSelecteds);
    this.search();
  }

  public checkCity(city) {
    this.citiesSelecteds = this.filterService.check(city, this.citiesSelecteds);
    this.search();
  }

  public checkAnalyst(analyst) {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);
    this.search();
  }
}

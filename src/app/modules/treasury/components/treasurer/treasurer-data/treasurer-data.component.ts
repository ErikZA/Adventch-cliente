import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';

import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';

import { Treasurer } from '../../../models/treasurer';
import { auth } from '../../../../../auth/auth';
import { Districts } from '../../../models/districts';
import { User } from '../../../../../shared/models/user.model';
import { utils } from '../../../../../shared/utils';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';
import * as moment from 'moment';
import { switchMap, tap, map, skipWhile } from 'rxjs/operators';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';

@Component({
  selector: 'app-treasurer-data',
  templateUrl: './treasurer-data.component.html',
  styleUrls: ['./treasurer-data.component.scss']
})
@AutoUnsubscribe()
export class TreasurerDataComponent extends AbstractSidenavContainer implements OnInit {
  protected componentUrl = 'tesouraria/tesoureiros';
  searchButton = false;
  showList = 40;
  search$ = new Subject<string>();
  filterText = '';

  treasurers: Treasurer[] = [];
  treasurersCache: Treasurer[] = [];

  // new filter
  districtsSelecteds: number[] = [];
  districtsData: Filter[] = [];
  analystsSelecteds: number[] = [];
  analystsData: Filter[] = [];
  functionsSelecteds: number[] = [];
  functionsData: Filter[] = [];

  sub1: Subscription;

  constructor(
    protected router: Router,
    private treasureService: TreasuryService,
    private confirmDialogService: ConfirmDialogService,
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

  getFunctionName(treasurer: Treasurer) {
    if (treasurer.function === 1) {
      return 'Tesoureiro (a)';
    }
    if (treasurer.function === 2) {
      return 'Tesoureiro (a) Associado (a)';
    }
    return 'Tesoureiro (a) Assistente';
  }

  getData() {
    this.search$.next('');
    this.loadFunctions();
    return this.treasureService
      .getTreasurers(auth.getCurrentUnit().id)
      .pipe(
        map(data => data.map(d => ({
          ...d,
          functionName: this.getFunctionName(d),
          dateRegisterFormatted: !!d.dateRegister ? moment(d.dateRegister).fromNow() : null
        })) as Treasurer[]),
        tap(data => {
          this.treasurersCache = data;
          this.treasurers = data;
          this.search();
        }),
        switchMap(() => this.loadAnalysts()),
        switchMap(() => this.loadDistricts())
      );
  }

  editTreasurer(treasurer): void {
    const id = treasurer.id;
    if (id === undefined) {
      return;
    }
    this.router.navigate([`tesouraria/tesoureiros/${id}/editar`]);
  }

  removeTreasurer(treasurer: Treasurer) {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este tesoureiro?', 'REMOVER')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.treasureService.deleteTreasurer(treasurer.id)),
        switchMap(() => this.getData()),
        tap(() => this.snackBar.open('Tesoureiro removido!', 'OK', { duration: 5000 }))
      ).subscribe(null, err => {
        console.log(err);
        this.snackBar.open('Erro ao remover tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
  }

  onScroll() {
    this.showList += 80;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public search() {
    let treasurersFilttered = this.treasurersCache.filter(t => utils.buildSearchRegex(this.filterText).test(t.name.toUpperCase()));
    treasurersFilttered = this.filterService.filter(treasurersFilttered, 'church.district.id', this.districtsSelecteds);
    treasurersFilttered = this.filterService.filter(treasurersFilttered, 'church.district.analyst.id', this.analystsSelecteds);
    treasurersFilttered = this.filterService.filter(treasurersFilttered, 'function', this.functionsSelecteds);  
    this.treasurers = treasurersFilttered;
  }
  private loadDistricts() {
    this.districtsData = [];
    return this.treasureService.getDistricts(auth.getCurrentUnit().id)
    .pipe(
      tap((data: Districts[]) => {
        data.forEach(d => {
          this.districtsData.push(new Filter(Number(d.id), d.name));
        });
      })
    );
  }
  private loadAnalysts() {
    this.analystsData = [];
    return this.treasureService.loadAnalysts(auth.getCurrentUnit().id)
    .pipe(
      tap((data: User[]) => {
        data.forEach(d => {
          this.analystsData.push(new Filter(Number(d.id), d.name));
        });
      })
    );
  }

  private loadFunctions() {
    this.functionsData = [];
    this.functionsData.push(new Filter(1, 'Tesoureiro (a)'));
    this.functionsData.push(new Filter(2, 'Tesoureiro (a) Associado (a)'));
    this.functionsData.push(new Filter(3, 'Tesoureiro (a) Assistente'));
  }

  checkDistrict(district) {
    this.districtsSelecteds = this.filterService.check(district, this.districtsSelecteds);
    this.search();
  }

  checkAnalyst(analyst) {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);   
    this.search();
  }

  checkFunction(func) {
    this.functionsSelecteds = this.filterService.check(func, this.functionsSelecteds);
    this.search();
  }
}

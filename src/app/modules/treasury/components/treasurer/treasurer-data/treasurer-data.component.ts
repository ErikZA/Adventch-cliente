import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as moment from 'moment';
import { switchMap, tap, skipWhile } from 'rxjs/operators';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { ReportService } from '../../../../../shared/report.service';
import { TreasurerService } from '../treasurer.service';
import { TreasurerDataInterface } from '../../../interfaces/treasurer/treasurer-data-interface';
import { DistrictListInterface } from '../../../interfaces/district/district-list-interface';
import { DistrictService } from '../../districts/district.service';

@Component({
  selector: 'app-treasurer-data',
  templateUrl: './treasurer-data.component.html',
  styleUrls: ['./treasurer-data.component.scss']
})
@AutoUnsubscribe()
export class TreasurerDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = 'tesouraria/tesoureiros';
  searchButton = false;
  showList = 40;
  search$ = new Subject<string>();
  filterText = '';

  treasurers: TreasurerDataInterface[];
  treasurersCache: TreasurerDataInterface[];

  // new filter
  districtsSelecteds: number[] = [];
  districtsData: Filter[] = [];
  analystsSelecteds: number[] = [];
  analystsData: Filter[] = [];
  functionsSelecteds: number[] = [];
  functionsData: Filter[] = [];

  sub1: Subscription;
  subsConfirmRemove: Subscription;

  constructor(
    protected router: Router,
    private treasureService: TreasuryService,
    private treasurerService: TreasurerService,
    private confirmDialogService: ConfirmDialogService,
    private snackBar: MatSnackBar,
    private filterService: FilterService,
    private reportService: ReportService,
    private districtService: DistrictService
  ) { super(router); }

  ngOnInit() {
    this.getData()
      .pipe(
        switchMap(() => this.search$)
      ).subscribe(search => {
        this.filterText = search;
        this.search();
      });
  }

  ngOnDestroy(): void {

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

  public getData() {
    this.search$.next('');
    return this.getTreasurers().pipe(
      switchMap(() => this.loadAnalysts()),
      switchMap(() => this.loadDistricts()),
      tap(() => this.loadFunctions())
    );
  }

  private getTreasurers() {
    const { id } = auth.getCurrentUnit();
    return this.treasurerService
      .getTreasurers(id)
      .pipe(
        tap(data => {
          this.treasurersCache = data;
          this.treasurers = data;
        }),
        tap(() => this.search())
      );
  }

  public editTreasurer(treasurer: TreasurerDataInterface): void {
    const id = treasurer.id;
    if (id === undefined) {
      return;
    }
    this.router.navigate([`tesouraria/tesoureiros/${id}/editar`]);
  }

  public removeTreasurer(treasurer: TreasurerDataInterface) {
    this.subsConfirmRemove = this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este tesoureiro?', 'REMOVER')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.treasureService.deleteTreasurer(treasurer.id)),
        switchMap(() => this.getTreasurers()),
        tap(() => this.snackBar.open('Tesoureiro removido!', 'OK', { duration: 5000 }))
      ).subscribe(null, err => {
        console.log(err);
        this.snackBar.open('Erro ao remover tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
  }

  public onScroll() {
    this.showList += 80;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  private search() {
    let treasurersFilttered = this.treasurersCache.filter(t => utils.buildSearchRegex(this.filterText).test(t.name.toUpperCase()));
    treasurersFilttered = this.filterService.filter(treasurersFilttered, 'districtId', this.districtsSelecteds);
    treasurersFilttered = this.filterService.filter(treasurersFilttered, 'analystId', this.analystsSelecteds);
    treasurersFilttered = this.filterService.filter(treasurersFilttered, 'function.id', this.functionsSelecteds);
    this.treasurers = treasurersFilttered;
  }

  private loadDistricts() {
    this.districtsData = [];
    return this.districtService.getDistrictsList(auth.getCurrentUnit().id)
    .pipe(
      tap((data: DistrictListInterface[]) => {
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
    this.functionsData.push(new Filter(1, 'Tesoureiro(a)'));
    this.functionsData.push(new Filter(2, 'Tesoureiro(a) Associado(a)'));
    this.functionsData.push(new Filter(3, 'Tesoureiro(a) Assistente'));
  }

  public checkDistrict(district) {
    this.districtsSelecteds = this.filterService.check(district, this.districtsSelecteds);
    this.search();
  }

  public checkAnalyst(analyst) {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);
    this.search();
  }

  public checkFunction(func) {
    this.functionsSelecteds = this.filterService.check(func, this.functionsSelecteds);
    this.search();
  }

  public generateGeneralReport(): void {
    const data = this.getDataParams();
    this.reportService.reportTreasurersGeral(data).subscribe(urlData => {
      const fileUrl = URL.createObjectURL(urlData);
      let element;
      element = document.createElement('a');
      element.href = fileUrl;
      element.download = 'tesoureiros-relatorio_geral.pdf';
      element.target = '_blank';
      element.click();
      this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
    });
  }

  private getDataParams(): any {
    return {
      treasurersIds: this.treasurers.length === 0 ? '' : this.treasurers.map(t => t.id).join(),
      functions: this.getFunctionsNames(),
      districts: this.getDistrictsNames(),
      analysts: this.getAnalystsNames()
    };
  }

  private getFunctionsNames(): string {
    const functions = this.functionsData.filter((data: Filter) => this.functionsSelecteds.some(x => x === data.id));
    return functions.length === 0 ? 'TODOS' : functions.map(f => f.name).join();
  }

  private getDistrictsNames(): string {
    const functions = this.districtsData.filter((data: Filter) => this.districtsSelecteds.some(x => x === data.id));
    return functions.length === 0 ? 'TODOS' : functions.map(f => f.name).join();
  }

  private getAnalystsNames(): string {
    const functions = this.analystsData.filter((data: Filter) => this.analystsSelecteds.some(x => x === data.id));
    return functions.length === 0 ? 'TODOS' : functions.map(f => f.name).join();
  }

  public getTimeInCharge(treasurer: TreasurerDataInterface): string {
    return treasurer.dateRegister ? ` - Aproximadamente ${moment(treasurer.dateRegister).fromNow()}` : '';
  }
}

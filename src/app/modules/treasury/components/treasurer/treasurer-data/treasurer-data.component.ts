import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, Subscription, Observable } from 'rxjs';
import { MatSnackBar, MatPaginator, MatExpansionPanel, PageEvent } from '@angular/material';

import { TreasuryService } from '../../../treasury.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';

import { Treasurer } from '../../../models/treasurer';
import { auth } from '../../../../../auth/auth';
import { User } from '../../../../../shared/models/user.model';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import * as moment from 'moment';
import { switchMap, tap, skipWhile, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { ReportService } from '../../../../../shared/report.service';
import { TreasurerService } from '../treasurer.service';
import { TreasurerDataInterface } from '../../../interfaces/treasurer/treasurer-data-interface';
import { DistrictListInterface } from '../../../interfaces/district/district-list-interface';
import { DistrictService } from '../../districts/district.service';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-treasurer-data',
  templateUrl: './treasurer-data.component.html',
  styleUrls: ['./treasurer-data.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
@AutoUnsubscribe()
export class TreasurerDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = 'tesouraria/tesoureiros';
  searchButton = false;
  search$ = new Subject<string>();
  filterText = '';

  // new filter
  districtsSelecteds: number[] = [];
  districtsData: Filter[] = [];
  analystsSelecteds: number[] = [];
  analystsData: Filter[] = [];
  functionsSelecteds: number[] = [];
  functionsData: Filter[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matExpansionPanel') panelFilter: MatExpansionPanel;
  treasurers$: Observable<any>;

  private subscribeSearch: Subscription;
  subsConfirmRemove: Subscription;
  private subscribeFilters: Subscription;
  private textSearch = '';
  length = 0;
  pageSize = 10;
  pageNumber = 0;
  pageEvent: PageEvent;
  filter = false;
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
    this.getTreasurers();
    this.subscribeSearch = this.search$.pipe(
      tap(search => this.textSearch = search),
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => this.getTreasurers()),
      tap(() => this.restartPaginator())
    ).subscribe();
    this.subscribeFilters = this.loadFilter()
      .pipe(
        tap(() => this.getPreferenceFilter())
      ).subscribe();
  }

  ngOnDestroy(): void {
    this.subscribeSearch.unsubscribe();
    this.subscribeFilters.unsubscribe();
    if (this.subsConfirmRemove) {
      this.subsConfirmRemove.unsubscribe();
    }
  }

  private getPreferenceFilter() {
    const filter = localStorage.getItem('treasury.treasurer.filter.open');
    if (filter !== null && filter !== undefined) {
      JSON.parse(filter) ? this.panelFilter.open() : this.panelFilter.close();
      this.filter = JSON.parse(filter) ? true : false;
    }
  }

  public getTreasurers(): void {
    let params = new HttpParams()
      .set('pageSize', String(this.pageSize))
      .set('pageNumber', String(this.pageNumber + 1))
      .set('search', this.textSearch);

    params = this.appendParamsArray(params, 'functionIds', this.functionsSelecteds);
    params = this.appendParamsArray(params, 'districtIds', this.districtsSelecteds);
    params = this.appendParamsArray(params, 'analystIds', this.analystsSelecteds);

    const { id } = auth.getCurrentUnit();
    this.treasurers$ = this.treasurerService
      .getTreasurers(id, params)
      .pipe(
        tap(data => this.length = data.rowCount)
      );
  }

  private appendParamsArray(params: HttpParams, name: string, array: Array<any>): HttpParams {
    if (array.length > 0) {
      array.forEach(s => {
        params = params.append(name, String(s));
      });
    }
    return params;
  }

  private loadFilter(): Observable<any> {
    return this.loadAnalysts()
      .pipe(
        switchMap(() => this.loadDistricts()),
        tap(() => this.loadFunctions())
      );
  }

  private restartPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  public paginatorEvent(event: PageEvent): PageEvent {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.getTreasurers();
    return event;
  }

  public getFunctionName(treasurer: Treasurer) {
    if (treasurer.function === 1) {
      return 'Tesoureiro (a)';
    }
    if (treasurer.function === 2) {
      return 'Tesoureiro (a) Associado (a)';
    }
    return 'Tesoureiro (a) Assistente';
  }

  public newTreasurer(): void {
    this.router.navigate([`tesouraria/tesoureiros/novo`]);
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
        tap(() => this.getTreasurers()),
        debounceTime(100),
        tap(() => this.snackBar.open('Tesoureiro removido!', 'OK', { duration: 5000 }))
      ).subscribe(null, err => {
        console.log(err);
        this.snackBar.open('Erro ao remover tesoureiro, tente novamente.', 'OK', { duration: 5000 });
      });
  }

  public expandPanel(): void {
    this.filter = !this.filter;
    this.filter ? this.panelFilter.open() : this.panelFilter.close();
    localStorage.setItem('treasury.treasurer.filter.open', JSON.stringify(this.filter));
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
  private loadAnalysts(): Observable<any> {
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
    this.getTreasurers();
    this.restartPaginator();
  }

  public checkAnalyst(analyst) {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);
    this.getTreasurers();
    this.restartPaginator();
  }

  public checkFunction(func) {
    this.functionsSelecteds = this.filterService.check(func, this.functionsSelecteds);
    this.getTreasurers();
    this.restartPaginator();
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
      functionIds: this.functionsSelecteds,
      districtIds: this.districtsSelecteds,
      analystIds: this.analystsSelecteds
    };
  }

  public getTimeInCharge(treasurer: TreasurerDataInterface): string {
    return treasurer.dateRegister ? ` - Aproximadamente ${moment(treasurer.dateRegister).fromNow()}` : '';
  }
}

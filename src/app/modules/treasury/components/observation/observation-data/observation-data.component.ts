import { Subscription, Subject, Observable } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSnackBar, PageEvent, MatPaginator, MatExpansionPanel } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { ReportService } from '../../../../../shared/report.service';
import { Observation } from '../../../models/observation';
import { auth } from '../../../../../auth/auth';
import { TreasuryService } from '../../../treasury.service';
import { utils } from '../../../../../shared/utils';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

import * as moment from 'moment';
import { tap, switchMap, skipWhile, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { HttpParams } from '@angular/common/http';
import { ObservationService } from '../observation.service';
import { PagedResult } from '../../../../../shared/paged-result';
import { ObservationDataInterface } from '../../../interfaces/observation/observation-data-interface';
import { ChurchObservationListFilterInterface } from '../../../interfaces/observation/church-observation-list-filter-interface';
import { ResponsibleObservationListFilterInterface } from '../../../interfaces/observation/responsible-observation-list-filter-interface';
import {
  AnalystDistrictChurchObservationListFilterInterface
} from '../../../interfaces/observation/analyst-district-church-observation-list-filter-interface';

@Component({
  selector: 'app-observation-data',
  templateUrl: './observation-data.component.html',
  styleUrls: ['./observation-data.component.scss']
})
export class ObservationDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = 'tesouraria/observacoes';

  searchButton = false;
  showList = 40;
  search$ = new Subject<string>();

  observations: Observation[] = [];
  observationsCache: Observation[] = [];

  filterText: string;
  filterPeriodStart: Date = new Date(new Date().getFullYear(), 0, 1);
  filterPeriodEnd: Date = new Date(new Date().getFullYear(), 11, 31);

  // new filter
  statusSelecteds: number[] = [];
  statusData: Filter[] = [];
  statusDefault: number[] = [1];
  churchesSelecteds: number[] = [];
  churchesData: Filter[] = [];
  analystsSelecteds: number[] = [];
  analystsData: Filter[] = [];
  responsiblesSelecteds: number[] = [];
  responsiblesData: Filter[] = [];

  sub1: Subscription;
  subsConfirmRemove: Subscription;
  subsConfirmFinalize: Subscription;
  subsReport: Subscription;

  private subscribeSearch: Subscription;
  private subscribeFilters: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matExpansionPanel') panelFilter: MatExpansionPanel;
  observations$: Observable<PagedResult<ObservationDataInterface>>;

  private textSearch = '';
  length = 0;
  pageSize = 10;
  pageNumber = 0;
  pageEvent: PageEvent;
  filter = false;
  constructor(
    protected router: Router,
    private confirmDialogService: ConfirmDialogService,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private snackBar: MatSnackBar,
    private treasuryService: TreasuryService,
    private filterService: FilterService,
    private service: ObservationService
  ) { super(router); }

  ngOnInit() {
    this.statusSelecteds = this.statusDefault;
    this.getObservations();
    this.subscribeSearch = this.search$.pipe(
      tap(search => this.textSearch = search),
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => this.getObservations()),
      tap(() => this.restartPaginator())
    ).subscribe();
    this.subscribeFilters = this.loadFilter()
      .pipe(
        tap(() => this.getPreferenceFilter())
      ).subscribe();
    // this.loadStatus();
    // this.sub1 = this
    //   .getData()
    //   .pipe(
    //     switchMap(() => this.search$)
    //   ).subscribe(search => {
    //     this.filterText = search;
    //     this.search();
    //   });
  }

  ngOnDestroy(): void {
    this.subscribeSearch.unsubscribe();
    this.subscribeFilters.unsubscribe();
    if (this.subsConfirmRemove) {
      this.subsConfirmRemove.unsubscribe();
    }
  }

  public getObservations(): void {
    let params = new HttpParams()
      .set('pageSize', String(this.pageSize))
      .set('pageNumber', String(this.pageNumber + 1))
      .set('search', this.textSearch)
      .set('dateStart', this.filterPeriodStart.toDateString())
      .set('dateEnd', this.filterPeriodEnd.toDateString());

    params = this.appendParamsArray(params, 'statusIds', this.statusSelecteds);
    params = this.appendParamsArray(params, 'churchesIds', this.churchesSelecteds);
    params = this.appendParamsArray(params, 'responsiblesIds', this.responsiblesSelecteds);
    params = this.appendParamsArray(params, 'analystsIds', this.analystsSelecteds);

    const { id } = auth.getCurrentUnit();
    this.observations$ = this.service
      .getObservations(id, params)
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

  private getPreferenceFilter() {
    const filter = localStorage.getItem('treasury.observation.filter.open');
    if (filter !== null && filter !== undefined) {
      JSON.parse(filter) ? this.panelFilter.open() : this.panelFilter.close();
      this.filter = JSON.parse(filter) ? true : false;
    }
  }

  private restartPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  public newObservation(): void {
    this.router.navigate([`tesouraria/observacoes/novo`]);
  }

  public paginatorEvent(event: PageEvent): PageEvent {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    this.getObservations();
    return event;
  }

  private loadFilter(): Observable<any> {
    return this.loadChurches()
      .pipe(
        switchMap(() => this.loadResponsibles()),
        switchMap(() => this.loadAnalysts()),
        tap(() => this.loadStatus())
      );
  }

  private loadChurches() {
    this.churchesData = [];
    const { id } = auth.getCurrentUnit();
    return this.service.getChurchObservations(id)
      .pipe(
        tap((data: ChurchObservationListFilterInterface[]) => {
          data.forEach(d => {
            this.churchesData.push(new Filter(Number(d.id), d.name));
          });
        })
      );
  }

  private loadResponsibles() {
    this.responsiblesData = [];
    const { id } = auth.getCurrentUnit();
    return this.service.getResponsibleObservations(id)
      .pipe(
        tap((data: ResponsibleObservationListFilterInterface[]) => {
          data.forEach(d => {
            this.responsiblesData.push(new Filter(Number(d.id), d.name));
          });
        })
      );
  }

  private loadAnalysts() {
    this.analystsData = [];
    const { id } = auth.getCurrentUnit();
    return this.service.getAnalystDistrictChurchObservations(id)
      .pipe(
        tap((data: AnalystDistrictChurchObservationListFilterInterface[]) => {
          data.forEach(d => {
            this.analystsData.push(new Filter(Number(d.id), d.name));
          });
        })
      );
  }

  public remove(observation: Observation) {
    this.subsConfirmRemove = this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a observação?', 'REMOVER')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.treasuryService.deleteObservation(observation.id)),
        tap(() => this.getObservations()),
        tap(() => this.snackBar.open('Removido com sucesso', 'OK', { duration: 2000 }))
      ).subscribe();
  }

  public edit(observation: Observation) {
    this.router.navigate([observation.id, 'editar'], { relativeTo: this.route });
  }

  public finalize(observation: Observation) {
    this.subsConfirmFinalize = this.confirmDialogService
      .confirm('Finalizar', 'Você deseja realmente finalizar a observação?', 'FINALIZAR')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.treasuryService.finalizeObservation(observation)),
        tap(() => this.getObservations()),
        tap(() => this.snackBar.open('Finalizado com sucesso', 'OK', { duration: 2000 }))
      ).subscribe();
  }
  public getStatus(status): string {
    if (status === 2) {
      return 'Finalizada';
    }
    return 'Aberta';
  }

  public expandPanel(): void {
    this.filter = !this.filter;
    this.filter ? this.panelFilter.open() : this.panelFilter.close();
    localStorage.setItem('treasury.observation.filter.open', JSON.stringify(this.filter));
  }

  public generateGeneralReport(): void {
    const data = this.getDataParams();
    this.subsReport = this.reportService.reportObservationsGeral(data).subscribe(urlData => {
      const fileUrl = URL.createObjectURL(urlData);
      let element;
      element = document.createElement('a');
      element.href = fileUrl;
      element.download = 'observacoes.pdf';
      element.target = '_blank';
      element.click();
      this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
    });
  }

  private getStatusName(): string {
    if (this.statusSelecteds.length === 0 || this.statusSelecteds.length === 2) {
      return 'TODOS';
    }
    if (this.statusSelecteds[0] === 1) {
      return 'Aberta';
    }
    return 'Finalizada';
  }

  private getDataParams(): any {
    const status = this.getParam(this.statusData, this.statusSelecteds);
    const church = this.getParam(this.churchesData, this.churchesSelecteds);
    const analyst = this.getParam(this.analystsData, this.analystsSelecteds);
    const responsible = this.getParam(this.responsiblesData, this.responsiblesSelecteds);

    return {
      statusId: status.id,
      statusName: status.name,
      churchId: church.id,
      churchName: church.name,
      analystId: analyst.id,
      analystName: analyst.name,
      responsibleId: responsible.id,
      responsibleName: responsible.name,
      dateStart: this.filterPeriodStart,
      dateEnd: this.filterPeriodEnd,
    };
  }

  private getParam(data, selecteds): Filter {
    if (selecteds.length === 1) {
      return data.find(f => Number(f.id) === selecteds[0]);
    }
    return new Filter(0, 'Todos');
  }

  public checkAttention(observation: Observation): boolean {
    const startDate = moment(observation.date);
    const endDate = moment(new Date());
    if (observation.status === 1 && endDate.diff(startDate, 'days') > 30) {
      return true;
    }
    return false;
  }

  public checkStatus(type): void {
    this.statusSelecteds = this.filterService.check(type, this.statusSelecteds);
    this.restartPaginator();
    this.getObservations();
  }

  public checkChurch(church): void {
    this.churchesSelecteds = this.filterService.check(church, this.churchesSelecteds);
    this.restartPaginator();
    this.getObservations();
  }

  public checkAnalyst(analyst): void {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);
    this.restartPaginator();
    this.getObservations();
  }

  public checkResponsible(responsible): void {
    this.responsiblesSelecteds = this.filterService.check(responsible, this.responsiblesSelecteds);
    this.restartPaginator();
    this.getObservations();
  }

  public selectPeriod(): void {
    this.restartPaginator();
    this.getObservations();
  }

  private loadStatus(): void {
    this.statusData.push(new Filter(1, 'Aberta'));
    this.statusData.push(new Filter(2, 'Finalizada'));
  }

  public disableReport(): boolean {
    const status = this.statusSelecteds.length === 0 ||
      this.statusSelecteds.length === 1 ||
      this.statusSelecteds.length === this.statusData.length;

    const churches = this.churchesSelecteds.length === 0 ||
      this.churchesSelecteds.length === 1 ||
      this.churchesSelecteds.length === this.churchesData.length;

    const analysts = this.analystsSelecteds.length === 0 ||
      this.analystsSelecteds.length === 1 ||
      this.analystsSelecteds.length === this.analystsData.length;

    const responsibles = this.responsiblesSelecteds.length === 0 ||
      this.responsiblesSelecteds.length === 1 ||
      this.responsiblesSelecteds.length === this.responsiblesData.length;

    if (status && churches && analysts && responsibles) {
      return false;
    }
    return true;
  }
}

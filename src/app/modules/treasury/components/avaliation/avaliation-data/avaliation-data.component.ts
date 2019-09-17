import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatPaginator, MatExpansionPanel, PageEvent } from '@angular/material';

import { Subject, Subscription, Observable } from 'rxjs';

import { auth } from '../../../../../auth/auth';
import { EAvaliationStatus } from '../../../models/enums';
import { TreasuryService } from '../../../treasury.service';
import { User } from '../../../../../shared/models/user.model';
import { ReportService } from '../../../../../shared/report.service';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AvaliationService } from '../avaliation.service';
import { tap, skipWhile, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ChurchAvaliationDataInterface } from '../../../interfaces/avaliation/church-avaliation-data-interface';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';

import { AvaliationDataInterface } from '../../../interfaces/avaliation/avaliation-data-interface';
import { DistrictListInterface } from '../../../interfaces/district/district-list-interface';
import { DistrictService } from '../../districts/district.service';
import { PagedResult } from '../../../../../shared/paged-result';
import { HttpParams } from '@angular/common/http';
import { AvaliationScoreDataInterface } from '../../../interfaces/avaliation/avaliantion-score-data-interface';

@Component({
  selector: 'app-avaliation-data',
  templateUrl: './avaliation-data.component.html',
  styleUrls: ['./avaliation-data.component.scss'],
})
export class AvaliationDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = '/tesouraria/avaliacoes';

  searchButton = false;
  search$ = new Subject<string>();
  layout: String = 'row';

  filterText: string;
  filterStatus = 0;
  filterAnalyst = 0;
  filterDistrict = 0;
  filterMonth = 1;
  filterYear = 2018;
  // new filter
  statusSelecteds: number[] = [];
  statusData: Filter[] = [];
  districtsSelecteds: number[] = [];
  districtsData: Filter[] = [];
  analystsSelecteds: number[] = [];
  analystsData: Filter[] = [];

  districts: DistrictListInterface[] = new Array<DistrictListInterface>();
  analysts: User[] = new Array<User>();
  years: number[] = new Array<number>();

  private subscribeSearch: Subscription;
  private subscribeFilters: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matExpansionPanel') panelFilter: MatExpansionPanel;
  churchesAvaliations$: Observable<PagedResult<ChurchAvaliationDataInterface>>;

  private textSearch = '';
  length = 0;
  pageSize = 10;
  pageNumber = 0;
  pageEvent: PageEvent;
  filter = false;
  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private snackBar: MatSnackBar,
    private avaliationService: AvaliationService,
    private filterService: FilterService,
    private districtService: DistrictService
  ) { super(router); }

  ngOnInit() {
    this.getPreferenceFilter();
    this.loadPeriods();
    this.getChurchesAvaliations();
    this.subscribeSearch = this.search$.pipe(
      tap(search => this.textSearch = search),
      debounceTime(250),
      distinctUntilChanged(),
      tap(() => this.getChurchesAvaliations()),
      tap(() => this.restartPaginator())
    ).subscribe();
    this.subscribeFilters = this.loadFilter()
      .subscribe();
  }

  ngOnDestroy(): void {
    this.subscribeSearch.unsubscribe();
    this.subscribeFilters.unsubscribe();
  }

  public getChurchesAvaliations(): void {
    let params = new HttpParams()
      .set('pageSize', String(this.pageSize))
      .set('pageNumber', String(this.pageNumber + 1))
      .set('search', this.textSearch)
      .set('month', this.filterMonth.toString())
      .set('year', this.filterYear.toString());

    params = this.appendParamsArray(params, 'statusIds', this.statusSelecteds);
    params = this.appendParamsArray(params, 'districtsIds', this.districtsSelecteds);
    params = this.appendParamsArray(params, 'analystsIds', this.analystsSelecteds);

    const { id } = auth.getCurrentUnit();
    this.churchesAvaliations$ = this.avaliationService
      .getChurchesAvaliations(id, params)
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
    const filter = localStorage.getItem('treasury.avaliation.filter.open');
    const pageSize = localStorage.getItem('treasury.avaliation.page.pageSize');
    if (filter !== null && filter !== undefined) {
      JSON.parse(filter) ? this.panelFilter.open() : this.panelFilter.close();
      this.filter = JSON.parse(filter) ? true : false;
    }
    if (pageSize !== null && pageSize !== undefined) {
      this.pageSize = JSON.parse(pageSize);
    }
  }

  private restartPaginator(): void {
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  public paginatorEvent(event: PageEvent): PageEvent {
    this.pageSize = event.pageSize;
    this.pageNumber = event.pageIndex;
    localStorage.setItem('treasury.avaliation.page.pageSize', JSON.stringify(event.pageSize));
    this.getChurchesAvaliations();
    return event;
  }

  private loadFilter(): Observable<any> {
    return this.loadDistricts()
      .pipe(
        switchMap(() => this.loadAnalysts()),
        tap(() => this.loadStatus())
      );
  }

  public getChurchScoreInTheYear(churchAvaliations: ChurchAvaliationDataInterface): number {
    const avaliations = churchAvaliations.avaliations.filter(a => this.getYear(a.date) === this.filterYear);
    return !avaliations ? 0 : avaliations
      .reduce((a, b) => a + b.total, 0);
  }

  public getChurchTotalInTheYear(churchAvaliations: ChurchAvaliationDataInterface): number {
    const avaliations = churchAvaliations.avaliations.filter(a => this.getYear(a.date) === this.filterYear);
    return !avaliations ? 0 : avaliations
      .reduce((a, b) => a + b.totalRating, 0);
  }

  private loadStatus() {
    this.statusData.push(new Filter(1, 'Aguardando'));
    this.statusData.push(new Filter(2, 'Avaliando'));
    this.statusData.push(new Filter(3, 'Finalizado'));
  }

  private loadDistricts() {
    this.districtsData = [];
    const { id } = auth.getCurrentUnit();
    return this.districtService
      .getDistrictsList(id)
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
    const { id } = auth.getCurrentUnit();
    return this.districtService.getAnalystDistrictList(id)
      .pipe(
        tap((data: User[]) => {
          data.forEach(d => {
            this.analystsData.push(new Filter(Number(d.id), d.name));
          });
        }));
  }

  private loadPeriods() {
    const currentYear = new Date().getFullYear();
    for (let i = this.filterYear; i <= currentYear; i++) {
      this.years.push(i);
    }
    this.filterMonth = new Date().getMonth() + 1;
    this.filterYear = new Date().getFullYear();
  }

  public getAvaliationsScore(avaliationsScore: AvaliationScoreDataInterface[]) {
    const total = avaliationsScore.reduce((sum, current) => sum + current.total, 0);
    const totalRating = avaliationsScore.reduce((sum, current) => sum + current.totalRating, 0);
    return `${total} / ${totalRating}`;
  }

  public mensal(churchAvaliation: ChurchAvaliationDataInterface) {
    const avaliation = churchAvaliation
      .avaliations
      .find(a => a.isMensal && this.getYear(a.date) === this.filterYear && this.getMonth(a.date) === this.filterMonth);
    if (avaliation) {
      this.router.navigate([
        churchAvaliation.id, 'mensal', avaliation.id, 'editar',
        { month: this.filterMonth, year: this.filterYear }
      ], { relativeTo: this.route });
    } else {
      this.router
        .navigate([
          churchAvaliation.id, 'mensal', 'novo',
          { month: this.filterMonth, year: this.filterYear }
        ], { relativeTo: this.route });
    }
  }

  public anual(churchAvaliation: ChurchAvaliationDataInterface) {
    const avaliation = churchAvaliation
      .avaliations
      .find(a => !a.isMensal && this.getYear(a.date) === this.filterYear);
    if (avaliation) {
      this.router.navigate([
        churchAvaliation.id, 'anual',
        avaliation.id, 'editar',
        { year: this.filterYear }], { relativeTo: this.route });
    } else {
      this.router
        .navigate([
          churchAvaliation.id, 'anual', 'novo',
          { year: this.filterYear }
        ], { relativeTo: this.route });
    }
  }

  public expandPanel(): void {
    this.filter = !this.filter;
    this.filter ? this.panelFilter.open() : this.panelFilter.close();
    localStorage.setItem('treasury.avaliation.filter.open', JSON.stringify(this.filter));
  }

  public getStatusString(churchAvaliation: ChurchAvaliationDataInterface): string {
    const avaliation = churchAvaliation
      .avaliations
      .find(f => this.getMonth(f.date) === this.filterMonth && this.getYear(f.date) === this.filterYear && f.isMensal);

    return this.getLabelStatusName(avaliation ? avaliation.status : 1);
  }

  public getStatusColor(churchAvaliation: ChurchAvaliationDataInterface): string {
    const avaliation = churchAvaliation
      .avaliations
      .find(f => this.getMonth(f.date) === this.filterMonth && this.getYear(f.date) === this.filterYear && f.isMensal);
    return this.getClassNameStatusColor(avaliation ? avaliation.status : 1);
  }

  private getClassNameStatusColor(status: number = 1): string {
    switch (status) {
      case EAvaliationStatus.Waiting:
        return 'color-waiting';
      case EAvaliationStatus.Valued:
        return 'color-assessing';
      case EAvaliationStatus.Finished:
        return 'color-finalized';
      default:
        return 'color-waiting';
    }
  }

  private getLabelStatusName(status: number = 1): string {
    switch (status) {
      case EAvaliationStatus.Waiting:
        return 'Aguardando';
      case EAvaliationStatus.Valued:
        return 'Avaliando';
      case EAvaliationStatus.Finished:
        return 'Finalizado';
      default:
        return 'Aguardando';
    }
  }

  private getYear(date: Date): number {
    return new Date(date).getFullYear();
  }

  private getMonth(date: Date): number {
    return new Date(date).getMonth() + 1;
  }

  public disableReport(): boolean {
    const districts = this.districtsSelecteds.length === 0
      || this.districtsSelecteds.length === 1
      || this.districtsSelecteds.length === this.districtsData.length;
    const analysts = this.analystsSelecteds.length === 0
      || this.analystsSelecteds.length === 1
      || this.analystsSelecteds.length === this.analystsData.length;
    if (districts && analysts) {
      return false;
    }
    return true;
  }

  public generateGeneralReport(): void {
    const data = this.getDataParams();
    this.reportService.reportAvaliationsGeral(data).subscribe(urlData => {
      const fileUrl = URL.createObjectURL(urlData);
      let element;
      element = document.createElement('a');
      element.href = fileUrl;
      element.download = 'avaliacoes-relatorio_geral.pdf';
      element.target = '_blank';
      element.click();
      this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
    });
  }

  private getDataParams(): any {
    let district = new Filter(0, 'TODOS');
    let analyst = new Filter(0, 'TODOS');
    if (this.districtsSelecteds.length === 1) {
      district = this.districtsData.find(f => f.id === this.districtsSelecteds[0]);
    }
    if (this.analystsSelecteds.length === 1) {
      analyst = this.analystsData.find(f => f.id === this.analystsSelecteds[0]);
    }
    return {
      districtId: district.id,
      districtName: district.name,
      analystId: analyst.id,
      analystName: analyst.name,
      year: this.filterYear,
    };
  }

  private finalizeMonthlyEvaluation(churchAvaliation: ChurchAvaliationDataInterface): void {
    const { id } = auth.getCurrentUser();
    const avaliation = this.getAvaliationMonthly(churchAvaliation);
    this.avaliationService
      .finalizeMonthlyAvaliation(avaliation.id, { userId: id })
      .pipe(
        skipWhile(res => !res),
        tap(() => this.getChurchesAvaliations()),
        tap(() =>
          this.snackBar.open(`Avaliação de ${this.filterMonth}/${this.filterYear} finalizada!`, 'OK', { duration: 3000 }),
          error => {
            console.log(error);
            this.snackBar
              .open(`Ocorreu um erro ao finalizar a avaliação de ${this.filterMonth}/${this.filterYear}`, 'OK', { duration: 3000 });
          })
      ).subscribe();
  }

  private finalizeAnnualEvaluation(churchAvaliation: ChurchAvaliationDataInterface): void {
    const { id } = auth.getCurrentUser();
    const avaliation = this.getAvaliationYearly(churchAvaliation);
    this.avaliationService
      .finalizeAnnualAvaliation(avaliation.id, { userId: id })
      .pipe(
        skipWhile(res => !res),
        tap(() => this.getChurchesAvaliations()),
        tap(() =>
          this.snackBar.open(`Avaliação de ${this.filterYear} finalizada!`, 'OK', { duration: 3000 }),
          error => {
            console.log(error);
            this.snackBar.open(`Ocorreu um erro ao finalizar a avaliação de ${this.filterYear}`, 'OK', { duration: 3000 });
          })
      ).subscribe();
  }

  private getAvaliationYearly(churchAvaliation: ChurchAvaliationDataInterface): AvaliationDataInterface {
    return churchAvaliation.avaliations
      .find(a => this.getYear(a.date) === this.filterYear && !a.isMensal);
  }

  private getAvaliationMonthly(churchAvaliation: ChurchAvaliationDataInterface): AvaliationDataInterface {
    return churchAvaliation.avaliations
      .find(a => this.getYear(a.date) === this.filterYear && this.getMonth(a.date) === this.filterMonth && a.isMensal);
  }

  private checkHasAvaliation(churchAvaliation: ChurchAvaliationDataInterface): boolean {
    return this.checkHasAvaliationYearly(churchAvaliation) || this.checkHasAvaliationMonthly(churchAvaliation);
  }

  private checkHasAvaliationYearly(churchAvaliation: ChurchAvaliationDataInterface): boolean {
    const _avaliation = this.getAvaliationYearly(churchAvaliation);
    return !!_avaliation && this.checkFinalizedYearly(churchAvaliation);
  }

  private checkHasAvaliationMonthly(churchAvaliation: ChurchAvaliationDataInterface): boolean {
    const _avaliation = this.getAvaliationMonthly(churchAvaliation);
    return !!_avaliation && this.checkFinalizedMonthly(churchAvaliation);
  }

  private checkFinalizedYearly(churchAvaliation: ChurchAvaliationDataInterface): boolean {
    const _avaliation = this.getAvaliationYearly(churchAvaliation);
    return this.checkAvaliationFinalized(_avaliation);
  }

  private checkFinalizedMonthly(churchAvaliation: ChurchAvaliationDataInterface): boolean {
    const _avaliation = this.getAvaliationMonthly(churchAvaliation);
    return this.checkAvaliationFinalized(_avaliation);
  }

  private checkAvaliationFinalized(avaliation: AvaliationDataInterface): boolean {
    if (!avaliation) {
      return true;
    }
    return avaliation.status !== EAvaliationStatus.Finished;
  }

  public checkStatus(status) {
    this.statusSelecteds = this.filterService.check(status, this.statusSelecteds);
    this.restartPaginator();
    this.getChurchesAvaliations();
  }

  public checkDistrict(district) {
    this.districtsSelecteds = this.filterService.check(district, this.districtsSelecteds);
    this.restartPaginator();
    this.getChurchesAvaliations();
  }

  public checkAnalyst(analyst) {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);
    this.restartPaginator();
    this.getChurchesAvaliations();
  }

  public selectPeriod(): void {
    this.restartPaginator();
    this.getChurchesAvaliations();
  }

  public generateDetailReport(avaliation): void {
    const data = this.getReportParams(avaliation.id);
    this.reportService
      .reportAvaliationsDetail(data)
      .subscribe(dataURL => {
        const fileUrl = URL.createObjectURL(dataURL);
        const element = document.createElement('a');
        element.href = fileUrl;
        element.download = 'detalhe-avaliacao.pdf';
        element.target = '_blank';
        element.click();
        this.snackBar.open('Relatório gerado com sucesso.', 'OK', { duration: 5000 });
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao gerar relatório, tente novamente.', 'OK', { duration: 5000 });
      });
  }

  private getReportParams(id): any {
    return {
      month: this.filterMonth,
      year: this.filterYear,
      churchId: id
    };
  }
}

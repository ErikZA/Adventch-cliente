import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Subject, Subscription } from 'rxjs';

import { ChurchAvaliation } from '../../../models/avaliation';
import { auth } from '../../../../../auth/auth';
import { AvaliationStore } from '../avaliation.store';
import { EAvaliationStatus } from '../../../models/Enums';
import { TreasuryService } from '../../../treasury.service';
import { Districts } from '../../../models/districts';
import { User } from '../../../../../shared/models/user.model';
import { ReportService } from '../../../../../shared/report.service';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AvaliationService } from '../avaliation.service';
import { map, tap, switchMap, skipWhile } from 'rxjs/operators';
import { ChurchAvaliationDataInterface } from '../../../interfaces/avaliation/church-avaliation-data-interface';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { utils } from '../../../../../shared/utils';

import { AvaliationDataInterface } from '../../../interfaces/avaliation/avaliation-data-interface';
@Component({
  selector: 'app-avaliation-data',
  templateUrl: './avaliation-data.component.html',
  styleUrls: ['./avaliation-data.component.scss']
})
export class AvaliationDataComponent extends AbstractSidenavContainer implements OnInit {
  protected componentUrl = '/tesouraria/avaliacoes';

  searchButton = false;
  showList = 80;
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

  districts: Districts[] = new Array<Districts>();
  analysts: User[] = new Array<User>();
  years: number[] = new Array<number>();

  churchesAvaliations: ChurchAvaliationDataInterface[];
  churchesAvaliationsCache: ChurchAvaliationDataInterface[];
  sub1: Subscription;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private store: AvaliationStore,
    private reportService: ReportService,
    private snackBar: MatSnackBar,
    private avaliationService: AvaliationService,
    private filterService: FilterService,
    private oldService: TreasuryService // TO DO: refatorar os métodos usados neste serviço para o FilterService
  ) { super(router); }

  ngOnInit() {
    this.loadFilters();
    this.sub1 = this.getData()
      .pipe(
        switchMap(() => this.search$)
      ).subscribe(search => {
        this.filterText = search;
        this.search();
      });
  }

  public getData() {
    const { id } = auth.getCurrentUnit();
    return this.avaliationService
      .getChurchesAvaliations(id)
      .pipe(
        skipWhile(data => !data),
        map(data => data.sort((a, b) => Number(a.code) - Number(b.code))),
        tap((data: ChurchAvaliationDataInterface[]) => {
          this.churchesAvaliations = data;
          this.churchesAvaliationsCache = data;
          this.search();
        })
      );
  }

  private sortByCode(a, b) {
    if (a.code < b.code) {
      return -1;
    } else if (a.code > b.code) {
      return 1;
    }
    return 0;
  }

  public getChurchScoreInTheYear(churchAvaliations: ChurchAvaliationDataInterface): number {
    const avaliations = churchAvaliations.avaliations.filter(a => this.getYear(a.date) === this.filterYear);
    return !avaliations ? 0 : avaliations
      .reduce((a, b) => a + b.total, 0);
  }

  private loadFilters() {
    this.loadStatus();
    this.loadDistricts();
    this.loadAnalysts();
    this.loadPeriods();
  }

  private loadStatus() {
    this.statusData.push(new Filter(1, 'Aguardando'));
    this.statusData.push(new Filter(2, 'Avaliando'));
    this.statusData.push(new Filter(3, 'Finalizado'));

  }

  private loadDistricts() {
    this.oldService
    .getDistricts(auth.getCurrentUnit().id).subscribe((data: Districts[]) => {
      data.forEach(d => {
        this.districtsData.push(new Filter(Number(d.id), d.name));
      });
    });
  }

  private loadAnalysts() {
    this.oldService.loadAnalysts(auth.getCurrentUnit().id).subscribe((data: User[]) => {
      data.forEach(d => {
        this.analystsData.push(new Filter(Number(d.id), d.name));
      });
    });
  }

  private loadPeriods() {
    const currentYear = new Date().getFullYear();
    for (let i = this.filterYear; i <= currentYear; i++) {
      this.years.push(i);
    }
    this.filterMonth = new Date().getMonth() + 1;
    this.filterYear = new Date().getFullYear();
  }

  /* Usados pelo component */

  public onScroll() {
    this.showList += 80;
  }

  private mensal(churchAvaliation: ChurchAvaliationDataInterface) {
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

  private anual(churchAvaliation: ChurchAvaliationDataInterface) {
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

  private setStoreValues(churchAvaliation: ChurchAvaliation) {
    this.store.churchAvaliation = churchAvaliation;
    this.store.period = new Date(this.filterYear, this.filterMonth - 1);
    this.store.avaliation = this.store.getAvaliationByPeriod(churchAvaliation, this.store.period);
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public search() {
    const filtered = this.churchesAvaliationsCache.filter(o =>
      utils.buildSearchRegex(this.filterText).test(o.name.toUpperCase()) ||
      utils.buildSearchRegex(this.filterText).test(o.code.toUpperCase())
    );

    const filtered2 = [];
    filtered.forEach(f => {
      const avaliation = f.avaliations
      .find(a => a.isMensal && this.getYear(a.date) === this.filterYear && this.getMonth(a.date) === this.filterMonth);
      if (this.filterStatusInAvaliation(avaliation) && this.filterDistrictsInAvaliation(f) && this.filterAnalystsInAvaliation(f)) {
        filtered2.push(f);
      }
    });
    this.churchesAvaliations = filtered2;
  }

  private filterStatusInAvaliation(avaliation): boolean {
    if (this.statusSelecteds.length === 0) {
      return true;
    }
    if (this.statusSelecteds
      .some(s => s === 1) && avaliation === undefined) { // Avaliação não existe, mas tá sendo pesquisado por aguardando
      return true;
    }
    if (avaliation === undefined) { // Avaliação não existe
      return false;
    }
    return this.statusSelecteds.some(s => s === avaliation.status);
  }

  private filterDistrictsInAvaliation(churchAvaliations): boolean {
    if (this.districtsSelecteds.length === 0) {
      return true;
    }
    return this.districtsSelecteds.some(s => s === churchAvaliations.district.id);
  }

  private filterAnalystsInAvaliation(churchAvaliations): boolean {
    if (this.analystsSelecteds.length === 0) {
      return true;
    }
    return this.analystsSelecteds.some(s => s === churchAvaliations.district.analyst.id);
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
      switchMap(() => this.getData()),
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
      switchMap(() => this.getData()),
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

  checkStatus(status) {
    this.statusSelecteds = this.filterService.check(status, this.statusSelecteds);
    this.search();
  }

  checkDistrict(district) {
    this.districtsSelecteds = this.filterService.check(district, this.districtsSelecteds);
    this.search();
  }

  checkAnalyst(analyst) {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);
    this.search();
  }
}

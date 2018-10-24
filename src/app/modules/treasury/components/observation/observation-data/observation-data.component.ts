import { Subscription ,  Subject } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material';
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
import { tap, switchMap, skipWhile } from 'rxjs/operators';
@Component({
  selector: 'app-observation-data',
  templateUrl: './observation-data.component.html',
  styleUrls: ['./observation-data.component.scss']
})
@AutoUnsubscribe()
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

  constructor(
    protected router: Router,
    private confirmDialogService: ConfirmDialogService,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private snackBar: MatSnackBar,
    private treasuryService: TreasuryService,
    private filterService: FilterService
  ) {  super(router); }

  ngOnInit() {
    this.loadStatus();
    this.statusSelecteds = this.statusDefault;
    this.sub1 = this
      .getData()
      .pipe(
        switchMap(() => this.search$)
      ).subscribe(search => {
        this.filterText = search;
        this.search();
      });
  }

  ngOnDestroy(): void {

  }

  getData() {
    this.search$.next('');
    return this.treasuryService
      .getObservations(auth.getCurrentUnit().id)
      .pipe(
        tap(data => {
          this.observations = data.sort(this.sortByDate);
          this.observationsCache = data.sort(this.sortByDate);
          this.loadAnalysts(data);
          this.loadChurches(data);
          this.loadResponsibles(data);
          this.search();
        })
      );
  }
  private sortByDate(a: Observation, b: Observation) {
    if (a.date === b.date) {
      return 0;
    }
    if (a.date > b.date) {
      return 1;
    } else {
      return -1;
    }
  }
  private loadChurches(observations: Observation[]) {
    this.churchesData = [];
    observations.forEach(observation => {
      if (this.churchesData.map(x => x.id).indexOf(observation.church.id) === -1) {
        this.churchesData.push(observation.church);
      }
    });
    this.churchesData.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadAnalysts(observations: Observation[]) {
    this.analystsData = [];
    observations.forEach(observation => {
      if (this.analystsData.map(x => x.id).indexOf(observation.church.district.analyst.id) === -1) {
        this.analystsData.push(observation.church.district.analyst);
      }
    });
    this.analystsData.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadResponsibles(observations: Observation[]) {
    this.responsiblesData = [];
    observations.forEach(observation => {
      if (this.responsiblesData.map(x => x.id).indexOf(observation.responsible.id) === -1) {
        this.responsiblesData.push(observation.responsible);
      }
    });
    this.responsiblesData.sort((a, b) => a.name.localeCompare(b.name));
  }

  public onScroll() {
    this.showList += 80;
  }

  public remove(observation: Observation) {
    this.subsConfirmRemove = this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a observação?', 'REMOVER')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.treasuryService.deleteObservation(observation.id)),
        switchMap(() => this.getData()),
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
        switchMap(() => this.getData()),
        tap(() => this.snackBar.open('Finalizado com sucesso', 'OK', { duration: 2000 }))
      ).subscribe();
  }
  public getStatus(status): string {
    if (status === 1) {
      return 'Aberta';
    }
    return 'Finalizada';
  }

  public searchInDates(startDate: Date, endDate: Date, observations: Observation[]) {
    return Array.isArray(observations) ? observations.filter(f => new Date(f.date) > startDate && new Date(f.date) < endDate) : [];
  }
  public search() {
    let observations = this.observationsCache.filter(o => utils.buildSearchRegex(this.filterText).test(o.church.name.toUpperCase()));
    observations = this.filterService.filter(observations, 'status', this.statusSelecteds);
    observations = this.filterService.filter(observations, 'church.id', this.churchesSelecteds);
    observations = this.filterService.filter(observations, 'church.district.analyst.id', this.analystsSelecteds);
    observations = this.filterService.filter(observations, 'responsible.id', this.responsiblesSelecteds);
    observations = this.searchInDates(this.filterPeriodStart, this.filterPeriodEnd, observations);
    this.observations = observations;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
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

  checkStatus(type): void {
    this.statusSelecteds = this.filterService.check(type, this.statusSelecteds);
    this.search();
  }

  checkChurch(church): void {
    this.churchesSelecteds = this.filterService.check(church, this.churchesSelecteds);
    this.search();
  }

  checkAnalyst(analyst): void {
    this.analystsSelecteds = this.filterService.check(analyst, this.analystsSelecteds);
    this.search();
  }

  checkResponsible(responsible): void {
    this.responsiblesSelecteds = this.filterService.check(responsible, this.responsiblesSelecteds);
    this.search();
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

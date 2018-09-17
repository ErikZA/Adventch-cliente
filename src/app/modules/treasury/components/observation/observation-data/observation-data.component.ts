import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';

import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { ReportService } from '../../../../../shared/report.service';
import { Observation } from '../../../models/observation';
import { Church } from '../../../models/church';
import { User } from '../../../../../shared/models/user.model';
import { auth } from '../../../../../auth/auth';
import { TreasuryService } from '../../../treasury.service';
import { utils } from '../../../../../shared/utils';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import 'rxjs/add/operator/skipWhile';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';
import * as moment from 'moment';
@Component({
  selector: 'app-observation-data',
  templateUrl: './observation-data.component.html',
  styleUrls: ['./observation-data.component.scss']
})
@AutoUnsubscribe()
export class ObservationDataComponent extends AbstractSidenavContainer implements OnInit {
  protected componentUrl = 'tesouraria/observacoes';

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();

  observations: Observation[] = [];
  observationsCache: Observation[] = [];
  churches: Church[] = [];
  analysts: User[] = [];
  responsibles: User[] = [];

  filterText: string;
  filterStatus = 1;
  filterChurch: number;
  filterAnalyst: number;
  filterResponsible: number;
  filterPeriodStart: Date = new Date(new Date().getFullYear(), 0, 1);
  filterPeriodEnd: Date = new Date(new Date().getFullYear(), 11, 31);

  sub1: Subscription;

  constructor(
    protected router: Router,
    private confirmDialogService: ConfirmDialogService,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private snackBar: MatSnackBar,
    private treasuryService: TreasuryService
  ) {  super(router); }

  ngOnInit() {
    this.sub1 = this
      .getData()
      .switchMap(() => this.search$)
      .subscribe(search => {
        this.filterText = search;
        this.search();
      });
  }
  getData() {
    this.search$.next('');
    return this.treasuryService
      .getObservations(auth.getCurrentUnit().id)
      .do(data => {
        this.observations = data.sort(this.sortByDate);
        this.observationsCache = data.sort(this.sortByDate);
        this.loadAnalysts(data);
        this.loadChurches(data);
        this.loadResponsibles(data);
        this.search();
      });
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
    observations.forEach(observation => {
      if (this.churches.map(x => x.id).indexOf(observation.church.id) === -1) {
        this.churches.push(observation.church);
      }
    });
    this.churches.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadAnalysts(observations: Observation[]) {
    observations.forEach(observation => {
      if (this.analysts.map(x => x.id).indexOf(observation.church.district.analyst.id) === -1) {
        this.analysts.push(observation.church.district.analyst);
      }
    });
    this.analysts.sort((a, b) => a.name.localeCompare(b.name));
  }

  private loadResponsibles(observations: Observation[]) {
    observations.forEach(observation => {
      if (this.responsibles.map(x => x.id).indexOf(observation.responsible.id) === -1) {
        this.responsibles.push(observation.responsible);
      }
    });
    this.responsibles.sort((a, b) => a.name.localeCompare(b.name));
  }

  public onScroll() {
    this.showList += 15;
  }

  public remove(observation: Observation) {
    this.confirmDialogService
      .confirm('Remover', 'Você deseja realmente remover a observação?', 'REMOVER')
      .skipWhile(res => res !== true)
      .switchMap(() => this.treasuryService.deleteObservation(observation.id))
      .switchMap(() => this.getData())
      .do(() => this.snackBar.open('Removido com sucesso', 'OK', { duration: 2000 }))
      .subscribe();
  }
  public edit(observation: Observation) {
    this.router.navigate([observation.id, 'editar'], { relativeTo: this.route });
  }
  public finalize(observation: Observation) {
    this.confirmDialogService
      .confirm('Finalizar', 'Você deseja realmente finalizar a observação?', 'FINALIZAR')
      .skipWhile(res => res !== true)
      .switchMap(() => this.treasuryService.finalizeObservation(observation))
      .switchMap(() => this.getData())
      .do(() => this.snackBar.open('Finalizado com sucesso', 'OK', { duration: 2000 }))
      .subscribe();
  }
  public getStatus(status): string {
    if (status === 1) {
      return 'Aberta';
    }
    return 'Finalizada';
  }
  public searchStatus(status: number, observations: Observation[]): Observation[] {
    // tslint:disable-next-line:triple-equals
    return Array.isArray(observations) ? observations.filter(f => f.status == status) : [];
  }

  public searchChurches(church: number, observations: Observation[]): Observation[] {
    // tslint:disable-next-line:triple-equals
    return Array.isArray(observations) ? observations.filter(f => f.church.id == church) : [];
  }

  public searchAnalysts(analyst: number, observations: Observation[]): Observation[] {
    // tslint:disable-next-line:triple-equals
    return Array.isArray(observations) ? observations.filter(f => f.church.district.analyst.id == analyst) : [];
  }

  public searchResponsibles(responsible: number, observations: Observation[]): Observation[] {
    // tslint:disable-next-line:triple-equals
    return Array.isArray(observations) ? observations.filter(f => f.responsible.id == responsible) : [];
  }

  public searchInDates(startDate: Date, endDate: Date, observations: Observation[]) {
    return Array.isArray(observations) ? observations.filter(f => new Date(f.date) > startDate && new Date(f.date) < endDate) : [];
  }
  public search() {
    let observations = this.observationsCache.filter(o => utils.buildSearchRegex(this.filterText).test(o.church.name));
    // tslint:disable-next-line:triple-equals
    if (this.filterStatus !== undefined && this.filterStatus != null && this.filterStatus != 0) {
      observations = this.searchStatus(this.filterStatus, observations);
    }
    // tslint:disable-next-line:triple-equals
    if (this.filterChurch !== undefined && this.filterChurch != null && this.filterChurch != 0) {
      observations = this.searchChurches(this.filterChurch, observations);
    }
    // tslint:disable-next-line:triple-equals
    if (this.filterAnalyst !== undefined && this.filterAnalyst != null && this.filterAnalyst != 0) {
      observations = this.searchAnalysts(this.filterAnalyst, observations);
    }
    // tslint:disable-next-line:triple-equals
    if (this.filterResponsible !== undefined && this.filterResponsible != null && this.filterResponsible != 0) {
      observations = this.searchResponsibles(this.filterResponsible, observations);
    }
    observations = this.searchInDates(this.filterPeriodStart, this.filterPeriodEnd, observations);
    this.observations = observations;
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public generateGeneralReport(): void {
    const data = this.getDataParams();
    this.reportService.reportObservationsGeral(data).subscribe(urlData => {
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
    if (this.filterStatus === undefined || this.filterStatus === null || this.filterStatus === 0) {
      return 'TODOS';
    }
    return this.getStatus(this.filterStatus);
  }

  private getDataParams(): any {
    const church = this.churches.find(f => f.id === this.filterChurch);
    const analyst = this.analysts.find(f => f.id === this.filterAnalyst);
    const responsible = this.analysts.find(f => f.id === this.filterResponsible);
    return {
      statusId: this.filterStatus,
      statusName: this.getStatusName(),
      churchId: this.filterChurch,
      churchName: church === undefined ? 'TODAS' : church.name,
      analystId: this.filterAnalyst,
      analystName: analyst === undefined ? 'TODOS' : analyst.name,
      responsibleId: this.filterResponsible,
      responsibleName: responsible === undefined ? 'TODOS' : responsible.name,
      dateStart: this.filterPeriodStart,
      dateEnd: this.filterPeriodEnd,
    };
  }

  public checkAttention(observation: Observation): boolean {
    const startDate = moment(observation.date);
    const endDate = moment(new Date());
    if (observation.status === 1 && endDate.diff(startDate, 'days') > 30) {
      return true;
    }
    return false;
  }
}

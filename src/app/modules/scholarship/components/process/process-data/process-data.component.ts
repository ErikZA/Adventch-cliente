import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject ,  Subscription } from 'rxjs';

import { AuthService } from '../../../../../shared/auth.service';
import { ScholarshipService } from '../../../scholarship.service';
import { ReportService } from '../../../../../shared/report.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';

import { PendencyComponent } from '../pendency/pendency.component';
import { VacancyComponent } from '../vacancy/vacancy.component';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialogRef,
  MatDialog,
  MatSnackBar,
  MatSlideToggleChange,
  MatDialogConfig } from '@angular/material';

import { auth } from './../../../../../auth/auth';
import { ProcessDataInterface } from '../../../interfaces/process-data-interface';
import { EStatus } from '../../../models/enums';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { utils } from '../../../../../shared/utils';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { ProcessDataDownloadComponent } from '../process-data-download/process-data-download.component';

import { distinctUntilChanged, tap, skipWhile, switchMap, filter } from 'rxjs/operators';
import { Rejected } from '../../../enums/rejected.enum';
import { School } from '../../../models/school';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
@AutoUnsubscribe()
export class ProcessDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = '/bolsas/processos';

  searchButton = false;
  search$ = new Subject<string>();
  showList = 80;
  idSchool = -1;
  showSchool = false;
  selectedFormat = 0;

  dialogRef: MatDialogRef<PendencyComponent>;
  dialogRef2: MatDialogRef<VacancyComponent>;
  dialogRef3: MatDialogRef<ProcessDataDownloadComponent>;

  layout: String = 'row';

  // New
  processes: ProcessDataInterface[] = [];
  processesCache: ProcessDataInterface[] = [];
  private query = '';
  inSearch: boolean;

  searchText = '';

  // new filter
  schoolSelecteds: number[] = [];
  schoolData: Filter[] = [];
  schoolDefault: number[] = [];
  statusSelecteds: number[] = [];
  statusData: Filter[] = [];
  statusDefault: number[] = [];
  yearSelecteds: number[] = [];
  yearData: Filter[] = [];
  yearDefault: number[] = [];
  schoolYearSelecteds: number[] = [];
  schoolYearData: Filter[] = [];
  schoolYearDefault: number[] = [];

  // Verificar tipo de usuário que pode modificar projeto ou não
  isScholarship: boolean;
  documentsIsVisible = false;
  sub1: Subscription;
  sub2: Subscription;
  subsSearch: Subscription;
  subsConfirmRemove: Subscription;
  subsDialogApprove: Subscription;
  subsDialogPendency: Subscription;

  constructor(
    protected router: Router,
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private confirmDialogService: ConfirmDialogService,
    private filterService: FilterService
  ) {
    super(router);
    if (window.screen.width < 450) {
      this.layout = 'column';
    }
  }

  ngOnInit() {
    this.loadYear();
    this.loadSchoolYear();
    this.loadStatus();
    // this.getProcesses();
    this.isScholarship = auth.getCurrentUser().isScholarship;
    this.schoolIsVisible();
    this.setAllFilters();
    this.sub1 = this.getInitialData().subscribe();
    this.subsSearch = this.search$
      .pipe(
        distinctUntilChanged(),
        tap(search => this.searchText = search),
        tap(search => this.processes = this.searchFilter(search))
      ).subscribe();
  }

  ngOnDestroy(): void {

  }

  private loadSchools(schools): void {
    this.schoolDefault = [this.scholarshipService.schoolSelected];
    this.schoolData = [];
    schools.forEach(school => {
      console.log(school);
      this.schoolData.push(new Filter(school.id, school.name));
    });
  }

  private loadYear(): void {
    for (let i = 2017; i <= new Date().getFullYear(); i++)  {
      this.yearData.push(new Filter(i, i.toString()));
    }
  }

  private loadSchoolYear(): void {
    for (let i = 2019; i <= new Date().getFullYear() + 1; i++)  {
      this.schoolYearData.push(new Filter(i, i.toString()));
    }
  }

  private loadStatus(): void {
    this.statusDefault = [this.scholarshipService.statusSelected];
    this.statusData = [];
    this.statusData.push(new Filter(1, 'Aguardando Análise'));
    this.statusData.push(new Filter(2, 'Em Análise'));
    this.statusData.push(new Filter(3, 'Pendência'));
    this.statusData.push(new Filter(4, 'Aguardando Vaga de Bolsa'));
    this.statusData.push(new Filter(5, 'Vaga Liberada (50%)'));
    this.statusData.push(new Filter(6, 'Vaga Liberada (100%)'));
    this.statusData.push(new Filter(7, 'Bolsa Indeferida'));
    this.statusData.push(new Filter(8, 'Não Matriculado'));
  }

  public checkSchool(school): void {
    this.schoolSelecteds = this.filterService.check(school, this.schoolSelecteds);
    this.refetchData();
  }

  public checkStatus(status): void {
    this.statusSelecteds = this.filterService.check(status, this.statusSelecteds);
    this.refetchData();
  }
  public checkYear(year): void {
    this.yearSelecteds = this.filterService.check(year, this.yearSelecteds);
    this.refetchData();
  }

  public checkSchoolYear(schoolYear): void {
    this.schoolYearSelecteds = this.filterService.check(schoolYear, this.schoolYearSelecteds);
    this.refetchData();
  }


  // private searchProcesses(): void {
  //   this.processes = this.searchFilter(this.searchText);
  //   this.searchFilterStatus();
  // }

  private searchFilterStatus(): void {
    this.processes = this.statusSelecteds.length === 0 ?
    this.processes : this.processes.filter(p => this.statusSelecteds.some(s => s === p.status.id));
  }

  // private searchFilterYear(): void {
  //   debugger;
  //   this.processes = this.yearSelecteds.length === 0 ?
  //   this.processes : this.processes.filter(p => this.yearSelecteds.some(s => s === p.dateRegistration.getFullYear()));
  // }

  private searchFilter(value: string) {
    return this.processesCache.filter(p =>
      utils.buildSearchRegex(value).test(p.protocol.toUpperCase()) ||
      utils.buildSearchRegex(value).test(p.student.name.toUpperCase()) ||
      utils.buildSearchRegex(value).test(p.responsible.name.toUpperCase())
    );
  }

  public enableDocuments(process: ProcessDataInterface): void {
    if (process && (process.documents === null || process.documents === undefined)) {
      this.scholarshipService
      .getProcessDocuments(process.id)
      .subscribe(documents => {
        if (documents) {
          process.documents = documents;
          this.documentsIsVisible = !this.documentsIsVisible;
        }
      });
    } else if (process && process.documents !== null && process.documents !== undefined) {
      this.documentsIsVisible = !this.documentsIsVisible;
    }
  }

  public disableVisibilityDocuments(): void {
    this.documentsIsVisible = false;
  }

  private setAllFilters(): void {
    this.setInitialFilterSchool();
    this.setInitialFilterStatus();
    this.setInitialFilterYear();
    this.setInitialFilterSchoolYear();
  }

  private setInitialFilterStatus() {
    if (this.scholarshipService.statusSelected !== 0) {
      this.statusSelecteds.push(this.scholarshipService.statusSelected);
    }
  }

  private setInitialFilterSchool() {
    if (this.scholarshipService.schoolSelected !== -1) {
      this.schoolSelecteds.push(this.scholarshipService.schoolSelected);
    }
  }
  private setInitialFilterYear() {
    if (this.scholarshipService.yearSelected !== 1) {
      this.yearSelecteds.push(this.scholarshipService.yearSelected);
    }
  }

  private setInitialFilterSchoolYear() {
    if (this.scholarshipService.schoolYearSelected !== 1) {
      this.schoolYearSelecteds.push(this.scholarshipService.schoolYearSelected);
    }
  }

  private getInitialData() {
    const user = auth.getCurrentUser();
    return this.getProcesses()
      .pipe(
        skipWhile(() => user.idSchool !== 0),
        switchMap(() => this.scholarshipService.getSchools()),
        tap(schools => this.loadSchools(schools)),
      );
  }
  private refetchData() {
    this.sub2 = this.getProcesses().subscribe();
  }
  private orderByStudentName(processes: ProcessDataInterface[]) {
    return processes.sort((a, b) => {
      if (typeof a.student.name  !== 'string' || typeof b.student.name !== 'string') {
        return 0;
      }
      return a.student.name.localeCompare(b.student.name);
    });
  }
  public getProcesses() {
    this.search$.next('');
    const user = auth.getCurrentUser();
    console.log('Pegar Processo', this.yearSelecteds, this.schoolYearSelecteds);
    console.log(this.statusSelecteds);
    if (user.idSchool === 0) {
      return this.scholarshipService
        .getProcessesByUnit(this.schoolSelecteds, this.statusSelecteds, this.yearSelecteds, this.schoolYearSelecteds, this.query)
        .pipe(
          tap(processes => {
            this.processes = this.orderByStudentName(processes);
            this.processesCache = processes;
          })
        );
    }
    return this.scholarshipService
      .getProcessesBySchool(user.idSchool, this.statusSelecteds, this.yearSelecteds, this.schoolYearSelecteds, this.query)
      .pipe(
        tap(processes => {
          this.processes = this.orderByStudentName(processes);
          this.processesCache = processes;
        })
      );
  }

  public schoolIsVisible(): void {
    const { idSchool } = auth.getCurrentUser();
    this.showSchool = idSchool === 0 ? true : false;
  }

  public onScroll(): void {
    this.showList += 80;
  }

  public getMotiveToReject(motive: string): string {
    switch (motive) {
      case 'Acadêmico':
        return 'O perfil global foi analisado e em especial os aspectos pedagógicos levados em conta para o indeferimento.';
      case 'Financeiro':
        return 'Indeferido em virtude de pendências junto ao setor financeiro.';
      case 'Renda':
        return 'Indeferido em virtude da renda familiar não se enquadrar no perfil de carência apropriado à avaliação correspondente.';
      case 'Disciplinar':
        return 'O perfil global foi analisado e em especial os aspectos disciplinares levados em conta para o indeferimento.';
      case 'Documentação':
        return 'Indeferido pela apresentação da documentação inconsistente à análise correspondente.';
      case 'Desistência':
        return 'Indeferido por abdicação do processo de bolsa solicitado.';
      default:
        break;
    }
  }

  public editProcess(process: ProcessDataInterface): void {
    this.router.navigate([process.id, 'editar'], { relativeTo: this.route });
  }

  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public onResize(event): void {
    const element = event.target.innerWidth;
    if (element > 600) {
      this.layout = 'row';
    } else {
      this.layout = 'column';
    }
  }

  public generateReportToProcess(process: ProcessDataInterface): void {
    this.reportService
    .reportProcess(process.id)
    .subscribe(dataURL => {
      const fileUrl = URL.createObjectURL(dataURL);
      const element = document.createElement('a');
      element.href = fileUrl;
      element.download = 'processo.pdf';
      element.target = '_blank';
      element.click();
      this.snackBar.open('Relatório gerado com sucesso.', 'OK', { duration: 5000 });
    }, err => {
        console.log(err);
        this.snackBar.open('Erro ao gerar relatório, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public generateGeneralProcessReport(formatSelect: number): void {
    const data = {
      school2: this.getSchoolParams(),
      status2: String(this.statusSelecteds.length === 0 ? [1, 2, 3, 4, 5, 6, 7, 8] : this.statusSelecteds),
      selectedFormat: formatSelect
    };

    if(formatSelect === 1){
      this.reportService
      .reportProcessesPdf(data)
      .subscribe(urlData => {
        const fileUrl = URL.createObjectURL(urlData);
          let element;
          element = document.createElement('a');
          element.href = fileUrl;
            element.download = 'processos.pdf';
          element.target = '_blank';
          element.click();
        this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao gerar relatório, tente novamente.', 'OK', { duration: 5000 });
      });
    }
    if(formatSelect === 12){
      this.reportService
      .reportProcessesExcel(data)
      .subscribe(urlData => {
        const fileUrl = URL.createObjectURL(urlData);
          let element;
          element = document.createElement('a');
          element.href = fileUrl;
          element.download = 'processos.xls';
          element.target = '_blank';
          element.click();
        this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
      }, err => {
        console.log(err);
        this.snackBar.open('Erro ao gerar relatório, tente novamente.', 'OK', { duration: 5000 });
      });
    }
  }

  private getSchoolParams(): string {
    const school = this.authService.getCurrentUser().idSchool;
    if (school > 0) { // Secretária
      return school.toString();
    }
    if (this.schoolSelecteds.length === 0) { // Assistente que não selecionou nenhum item
      return String(this.schoolData.map(m => m.id));
    }
    return String(this.schoolSelecteds); // assistante que selecionou um ou mais itens
  }

  public changeStatusToProcess(process: ProcessDataInterface, status: number): void {
    const user = auth.getCurrentUser();
    this.scholarshipService
    .changeProcessStatus(process.id, status, { userId: user.id })
    .pipe(
      skipWhile((res) => !res),
      tap(() => {
        process.status.id = status;
        process.status.name = this.getNameStatus(status);
        this.searchFilterStatus();
    })).subscribe(() => {
    }, err => this.snackBar.open('Erro ao alterar o status do processo, tente novamente.', 'OK', { duration: 5000 }));
  }

  private getNameStatus(status: number): string {
    switch (status) {
      case 1:
        return 'Aguardando Análise';
      case 2:
        return 'Em Análise';
      case 3:
        return 'Pendência';
      case 4:
        return 'Aguardando Vaga de Bolsa';
      case 5:
        return 'Vaga Liberada (50%)';
      case 6:
        return 'Vaga Liberada (100%)';
      case 7:
        return 'Bolsa Indeferida';
      case 8:
        return 'Não Matriculado';
      default:
        break;
    }
  }

  public toApprove(process: ProcessDataInterface): void {
    if (process.status.id === 2 || process.status.id === 3 || process.status.id === 7) {
      this.changeStatusToProcess(process, 4);
    } else {
      const dialogConfig = new MatDialogConfig();

      this.setDialogApprove(dialogConfig, process);
      const dialogRef = this.dialog.open(VacancyComponent, dialogConfig);
      this.subsDialogApprove = dialogRef
      .afterClosed()
      .subscribe(vacancy => {
        if (vacancy) {
          const { id } = auth.getCurrentUser();
          this.scholarshipService
            .saveVacancy(process.id, { userId: id, status: vacancy.idStatus, dataRegistration: vacancy.dateRegistration })
            .pipe(
              skipWhile((res) => !res),
              tap(() => {
                process.status.id = vacancy.idStatus;
                process.status.name = this.getNameStatus(vacancy.idStatus);
                this.searchFilterStatus();
                process.dateRegistration = vacancy.dateRegistration;
            })).subscribe(() => {
                this.snackBar.open('Processo aprovado com sucesso.', 'OK', { duration: 5000 });
            }, err => this.snackBar.open('Erro ao salvar a aprovação do processo, tente novamente.', 'OK', { duration: 5000 }));
        }
      });
    }
  }

  private setDialogApprove(dialogConfig: MatDialogConfig<any>, process: ProcessDataInterface): void {
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (this.layout === 'row') {
        dialogConfig.width = '400px';
    }
    dialogConfig.data = {
        process: process
    };
  }

  public download(process: ProcessDataInterface): void {
    const dialogConfig = new MatDialogConfig();

    this.setDialogPendecy(dialogConfig, process);
    const dialogRef = this.dialog.open(ProcessDataDownloadComponent, dialogConfig);
  }

  public toPendency(process: ProcessDataInterface): void {
    const dialogConfig = new MatDialogConfig();
    this.setDialogPendecy(dialogConfig, process);
    const dialogRef = this.dialog.open(PendencyComponent, dialogConfig);
    this.subsDialogPendency = dialogRef
    .afterClosed()
    .subscribe(data => {
      if (data) {
        const { id } = auth.getCurrentUser();
        this.scholarshipService
          .savePendency(process.id, { userId: id, pendency: data.pendency })
          .pipe(
            skipWhile((res) => !res),
            tap(() => {
              process.status.id = EStatus.Pendency;
              process.status.name = this.getNameStatus(EStatus.Pendency);
              this.searchFilterStatus();
              process.pendency = data.pendency;
              process.isSendDocument = false;
              process.hasUploads = false;
          })).subscribe(() => {
            this.snackBar.open('Pendência salva com sucesso.', 'OK', { duration: 5000 });
          }, err => this.snackBar.open('Erro ao salvar pendência do processo, tente novamente.', 'OK', { duration: 5000 }));
      }
    });
  }

  private setDialogPendecy(dialogConfig: MatDialogConfig<any>, process: ProcessDataInterface) {
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (this.layout === 'row') {
      dialogConfig.width = '50%';
    }
    dialogConfig.data = {
        process: process
    };
  }

  public toReject(process: ProcessDataInterface, idMotive: number): void {
    const user = auth.getCurrentUser();
    if (process.status.id > 1 && process.status.id < 7) {
      this.scholarshipService.saveReject(process.id, {
        userId: user.id,
        motiveReject: this.setReasonForRejection(idMotive)
      }).pipe(
        skipWhile((res) => !res),
        tap(() => {
          process.status.id = EStatus.Dismissed;
          process.status.name = this.getNameStatus(EStatus.Dismissed);
          this.searchFilterStatus();
          process.motiveReject = this.setReasonForRejection(idMotive);
      })).subscribe(() => {
          this.snackBar.open('Indeferimento salvo com sucesso.', 'OK', { duration: 5000 });
      }, err => this.snackBar.open('Erro ao indeferir processo, tente novamente.', 'OK', { duration: 5000 }));
    }
  }

  private setReasonForRejection(idMotive: number): string {
    switch (idMotive) {
      case Rejected.Academic:
        return 'Acadêmico';
      case Rejected.Financial:
        return 'Financeiro';
      case Rejected.Income:
        return 'Renda';
      case Rejected.Disciplinary:
        return 'Disciplinar';
      case Rejected.Documentation:
        return 'Documentação';
      case Rejected.Withdrawal:
        return 'Desistência';
      case Rejected.NoVacancy:
        return 'Não há vaga';
      case Rejected.NotComtempled:
        return 'Não comtemplado';
      case Rejected.NotEnroll:
        return 'Não matriculou';
      default:
        break;
    }
  }

  public sentDocuments(event: MatSlideToggleChange, process: ProcessDataInterface): void {
    if (process.status.id === 3) {
      const { id } = auth.getCurrentUser();
      this.scholarshipService
        .sentDocuments(process.id, { userId: id })
        .subscribe(res => {
          if (res) {
            process.isSendDocument = event.checked;
          }
        }, err => {
          this.snackBar.open('Erro ao marcar os documentos como enviados, tente novamente.', 'OK', { duration: 5000 });
        });
    }
  }

  public removeProcess(process: ProcessDataInterface): void {
    this.subsConfirmRemove = this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este processo?', 'REMOVER')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.scholarshipService.deleteProcess(process.id)),
        switchMap(() => this.getProcesses())
      ).subscribe(() => {
      this.snackBar.open('Processo removido!', 'OK', { duration: 5000 });
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao remover processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public generateNewPasswordResponsible(process: ProcessDataInterface): void {
    const { id } = auth.getCurrentUser();
    this.scholarshipService
      .generateNewPasswordResponsible({ userId: id, responsibleId: process.responsible.id })
      .subscribe(() => {
        this.snackBar.open('Nova senha do responsável gerada com sucesso.', 'OK', { duration: 5000 });
      }, err => this.snackBar.open('Erro ao gerar senha para o responável do processo, tente novamente.', 'OK', { duration: 5000 }));
  }
}

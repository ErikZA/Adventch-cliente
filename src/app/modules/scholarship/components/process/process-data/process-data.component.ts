import { Component, OnInit, ViewChild } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { AuthService } from '../../../../../shared/auth.service';
import { ScholarshipService } from '../../../scholarship.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { ReportService } from '../../../../../shared/report.service';

import { PendencyComponent } from '../pendency/pendency.component';
import { VacancyComponent } from '../vacancy/vacancy.component';

import { Process } from '../../../models/process';
import { School } from '../../../models/school';
import { Router } from '@angular/router';

import { MatDialogRef,
        MatDialog,
        MatSnackBar,
        MatSidenav,
        MatSlideToggleChange,
        MatDialogConfig} from '@angular/material';

import { ProcessesStore } from '../processes.store';

@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent implements OnInit {

  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  search$ = new Subject<string>();
  showList = 15;
  idSchool = -1;
  showSchool = false;
  refresh$ = new Observable<boolean>();

  dialogRef: MatDialogRef<PendencyComponent>;
  dialogRef2: MatDialogRef<VacancyComponent>;

  layout: String = 'row';

  // New
  processes: Process[] = new Array<Process>();
  processes$: Observable<Process[]>;
  schools$: Observable<School[]>;
  schoolsFilters: Number[];
  statusFilters: Number[];
  valueSearch: string;
  inSearch: boolean;

  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidenavService: SidenavService,
    private router: Router,
    private store: ProcessesStore,
    private reportService: ReportService
  ) {
    if (window.screen.width < 450) {
      this.layout = 'column';
    }
  }

  ngOnInit() {
    this.schoolIsVisible();
    this.getAllDatas();
    this.processes$.subscribe(x => { this.processes = x; });
    this.search$.subscribe(search => {
      this.searchProcess(search);
    });
    this.scholarshipService.refresh$.subscribe((refresh: boolean) => {
      this.searchProcess('');
    });
    this.sidenavService.setSidenav(this.sidenavRight);
    this.closeSidenav();
  }

  private getAllDatas(): void {
    this.processes$ = this.store.processes$;
    this.schools$ = this.store.schools$;
    this.store.loadAll();
    this.setAllFilters();
  }

  private setAllFilters(): void {
    this.setSchoolsFilters();
    this.setStatusFilters();
  }

  private setSchoolsFilters(): void {
    this.schoolsFilters = new Array<Number>();
    if (this.showSchool) {
      this.schools$.subscribe(data => {
        data.forEach(school => {
          if (!this.schoolsFilters.some(x => x === school.id)) {
            this.schoolsFilters.push(school.id);
          }
        });
      });
    } else {
      this.schoolsFilters.push(this.authService.getCurrentUser().idSchool);
    }
  }

  private setStatusFilters(): void {
    this.statusFilters = new Array<Number>();
    if (this.scholarshipService.statusSelected === 0) {
      for (let i = 1; i <= 8; i++) {
        this.statusFilters.push(i);
      }
    } else {
      this.statusFilters.push(this.scholarshipService.statusSelected);
      this.processes$ = this.store.filterProcesses(this.schoolsFilters, this.statusFilters);
    }
  }

  public filterSchools(id: number, checked: boolean): void {
    if (checked && !this.schoolsFilters.some(x => x === id) && this.showSchool) {
      this.schoolsFilters.push(id);
    } else if (!checked && this.schoolsFilters.some(x => x === id) && this.showSchool) {
      const index = this.schoolsFilters.indexOf(id);
      this.schoolsFilters.splice(index, 1);
    }
    this.callFilters();
  }

  private callFilters(): void {
    this.processes$ = this.store.filterProcesses(this.schoolsFilters, this.statusFilters);
  }

  public filterStatus(id: number, checked: boolean): void {
    if (checked && !this.statusFilters.some(x => x === id)) {
      this.statusFilters.push(id);
    } else if (!checked && this.statusFilters.some(x => x === id)) {
      this.statusFilters.splice(this.statusFilters.indexOf(id), 1);
    }
    this.callFilters();
  }

  public searchProcess(search: string): void {
    this.inSearch = search !== '' ? true : false;
    if (!this.processes) {
      return;
    }
    this.callFilters();
    const processes = this.store.filterSearch(search);
    this.processes$ = this.store.filterProcesses(this.schoolsFilters, this.statusFilters, processes);
  }

  public closeSidenav(): void {
    this.sidenavRight.close();
    this.getAllDatas();
    this.scholarshipService.processEdit = new Process();
    this.router.navigate([this.router.url.replace('/novo', '').replace('/editar', '')]);
  }

  public schoolIsVisible(): void {
    this.showSchool = this.authService.getCurrentUser().idSchool === 0 ? true : false;
  }

  public toWaiting(process: Process): void {
    if (this.authService.getCurrentUser().idSchool === 0 && process.status === 1) {
      this.store.changeStatus(this.setStatusChangeProcess(process, 2, 'Iniciado'));
    }
  }

  public toReject(process, idMotive: number): void {
    if (this.authService.getCurrentUser().idSchool === 0 && (process.status > 1 && process.status < 7)) {
      this.store.sendRejection(process, idMotive);
    }
  }

  public toNotEnroll(process: Process): void {
    if (this.authService.getCurrentUser().idSchool === 0 && (process.status === 5 || process.status === 6)) {
      this.store.changeStatus(this.setStatusChangeProcess(process, 8, 'Não Matriculou'));
    }
  }

  private setStatusChangeProcess(process: Process, status: number, description: string): any {
    return {
      id: process.id,
      status: status,
      description: description,
      user: this.authService.getCurrentUser().identifier,
      process: process
    };
  }

  public sendDocuments(event: MatSlideToggleChange, process: Process): void {
    if (process.status === 3) {
      this.store.sendDocuments(this.setProcessSendDocuments(process, event.checked));
    }
  }

  private setProcessSendDocuments(process: Process, checked: boolean): any {
    return {
      id: process.id,
      user: this.authService.getCurrentUser().identifier,
      isSendDocument: checked,
      description: checked ? 'Documentos Pendentes Enviados' : 'Documentos Pendentes Não Enviados',
      process: process
    };
  }

  public onScroll(): void {
    this.showList += 15;
  }

  public toPendency(process: Process): void {
    const dialogConfig = new MatDialogConfig();

    this.setDialogPendecy(dialogConfig, process);
    const dialogRef = this.dialog.open(PendencyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(pendency => {
      if (pendency) {
        const processPendency: any = this.setDataPendency(process, pendency);
        this.store.savePendecy(processPendency);
      }
    });
  }

  private setDialogPendecy(dialogConfig: MatDialogConfig<any>, process: Process) {
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (this.layout === 'row') {
        dialogConfig.width = '60%';
    }
    dialogConfig.data = {
        process: process
    };
  }

  private setDataPendency(process: Process, data: any): any {
    return {
        id: process.id,
        pendency: data.pendency,
        user: this.authService.getCurrentUser().identifier,
        status: 3,
        isSendDocument: false,
        description: 'Adicionando pendência',
        process: process
    };
  }

  public getMotiveToReject(motive): string {
    if (motive === 'Acadêmico') {
      return 'O perfil global foi analisado e em especial os aspectos pedagógicos levados em conta para o indeferimento.';
    }
    if (motive === 'Financeiro') {
      return 'Indeferido em virtude de pendências junto ao setor financeiro.';
    }
    if (motive === 'Renda') {
      return 'Indeferido em virtude da renda familiar não se enquadrar no perfil de carência apropriado à avaliação correspondente.';
    }
    if (motive === 'Disciplinar') {
      return 'O perfil global foi analisado e em especial os aspectos disciplinares levados em conta para o indeferimento.';
    }
    return 'Indeferido pela apresentação da documentação inconsistente à análise correspondente.';
  }

  public toApprove(process: Process): void {
    if (process.status === 2 || process.status === 3 || process.status === 7) {
      this.store.changeStatus(this.setStatusChangeProcess(process, 4, 'Aguardando Vaga da Bolsa'));
    } else {
      const dialogConfig = new MatDialogConfig();

      this.setDialogAprove(dialogConfig, process);
      const dialogRef = this.dialog.open(VacancyComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(vacancy => {
        if (vacancy) {
          const processVacancy: any = this.setDataVacancy(process, vacancy);
          this.store.saveVacancy(processVacancy);
        }
      });
    }
  }

  private setDataVacancy(process: Process, data: any): any {
    return {
      id: process.id,
      status: data.idStatus,
      description: data.description,
      dateRegistration: data.dateRegistration,
      user: this.authService.getCurrentUser().identifier,
      process: process
    };
  }

  private setDialogAprove(dialogConfig: MatDialogConfig<any>, process: Process): void {
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (this.layout === 'row') {
        dialogConfig.width = '400px';
    }
    dialogConfig.data = {
        process: process
    };
  }

  public editProcess(process) {
    this.router.navigate(['/bolsas/processos/editar']);
    this.scholarshipService.processEdit = process;
    this.sidenavService.open();
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

  generateReport(p) {
    this.scholarshipService.getPasswordResponsible(p[0].id).subscribe(data => {
      const password = data.password;
      this.reportService.reportProcess(p[0].id, password).subscribe(urlData => {
        const fileUrl = URL.createObjectURL(urlData);
        // nova aba
        // window.open(fileUrl);
        // download automatico
        let element;
        element = document.createElement('a');
        element.href = fileUrl;
        element.download = 'processo.pdf';
        element.target = '_blank';
        element.click();
      }, err => console.log(err));
      this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    });
  }

  generateNewPasswordResponsible(p) {
    this.scholarshipService.generateNewPasswordResponsible(p[0].student.responsible.id).subscribe(data => {
      if (data && data !== undefined && data != null) {
        this.snackBar.open('Senha alterada!', 'OK', { duration: 5000 });
      }
    });
  }
}

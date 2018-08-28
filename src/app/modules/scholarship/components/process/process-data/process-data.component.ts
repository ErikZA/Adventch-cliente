import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../../../../shared/auth.service';
import { ScholarshipService } from '../../../scholarship.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
import { ReportService } from '../../../../../shared/report.service';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';

import { PendencyComponent } from '../pendency/pendency.component';
import { VacancyComponent } from '../vacancy/vacancy.component';

import { Process } from '../../../models/process';
import { School } from '../../../models/school';
import { Router, ActivatedRoute } from '@angular/router';

import { MatDialogRef,
  MatDialog,
  MatSnackBar,
  MatSidenav,
  MatSlideToggleChange,
  MatDialogConfig } from '@angular/material';

import { auth } from './../../../../../auth/auth';
import { ProcessesStore } from '../processes.store';
import { ProcessDataInterface } from '../../../interfaces/process-data-interface';

@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent implements OnInit, OnDestroy {

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
  processes$: Observable<ProcessDataInterface[]>;
  schools$: Observable<School[]>;
  schoolsFilters: number[];
  statusFilters: Number[];
  valueSearch: string;
  inSearch: boolean;

  subscribeUnit: Subscription;

  // Verificar tipo de usuário que pode modificar projeto ou não
  isScholarship: boolean;
  documentsIsVisible = false;

  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute,
    private store: ProcessesStore,
    private reportService: ReportService,
    private location: Location,
    private confirmDialogService: ConfirmDialogService
  ) {
    if (window.screen.width < 450) {
      this.layout = 'column';
    }
  }

  ngOnInit() {
    this.getAllDatas();
    // this.schoolIsVisible();
    // this.getAllDatas();
    // this.isScholarship = auth.getCurrentUser().isScholarship;
    // this.processes$.subscribe(x => { this.processes = x; });
    // this.search$.subscribe(search => {
    //   this.searchProcess(search);
    // });
    // this.scholarshipService.refresh$.subscribe((refresh: boolean) => {
    //   this.searchProcess('');
    // });
    // this.sidenavService.setSidenav(this.sidenavRight);
    // this.subscribeUnit = auth.currentUnit.subscribe(() => {
    //   this.scholarshipService.updateSchool(auth.getCurrentUser().idSchool);
    // });
    // this.router.navigate([this.router.url.replace(/.*/, 'bolsas/processos')]);
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
  }

  public enableDocuments(): void {
    this.documentsIsVisible = !this.documentsIsVisible;
  }

  private getAllSchools(): void {
    this.schools$ = this.scholarshipService.getSchools();
  }


  private getAllDatas(): void {
    const user = auth.getCurrentUser();
    if (user.idSchool === 0) {
      this.getAllSchools();
      this.processes$ = this.scholarshipService.getProcessesByUnit();
    } else {
      this.processes$ = this.scholarshipService.getProcessesBySchool(user.idSchool);
    }
  }

  // private setAllFilters(): void {
  //   // this.setSchoolsFilters();
  //   // this.setStatusFilters();
  // }

  // private setSchoolsFilters(): void {
  //   this.schoolsFilters = new Array<number>();
  //   if (this.showSchool && this.scholarshipService.schoolSelected !== -1) {
  //     this.schoolsFilters.push(this.scholarshipService.schoolSelected);
  //   } else if (this.showSchool && this.scholarshipService.schoolSelected === -1) {
  //     this.schools$.subscribe(data => {
  //       data.forEach(school => {
  //         if (!this.schoolsFilters.some(x => x === school.id)) {
  //           this.schoolsFilters.push(school.id);
  //         }
  //       });
  //     });
  //   } else {
  //     this.schoolsFilters.push(auth.getCurrentUser().idSchool);
  //   }
  // }

  // private setStatusFilters(): void {
  //   this.statusFilters = new Array<Number>();
  //   if (this.scholarshipService.statusSelected === 0) {
  //     for (let i = 1; i <= 8; i++) {
  //       this.statusFilters.push(i);
  //     }
  //   } else {
  //     this.statusFilters.push(this.scholarshipService.statusSelected);
  //     this.processes$ = this.store.filterProcesses(this.schoolsFilters, this.statusFilters);
  //   }
  // }

  // public filterSchools(id: number, checked: boolean): void {
  //   if (checked && !this.schoolsFilters.some(x => x === id) && this.showSchool) {
  //     this.schoolsFilters.push(id);
  //   } else if (!checked && this.schoolsFilters.some(x => x === id) && this.showSchool) {
  //     const index = this.schoolsFilters.indexOf(id);
  //     this.schoolsFilters.splice(index, 1);
  //   }
  //   // this.callFilters();
  // }

  // private callFilters(): void {
  //   this.processes$ = this.store.filterProcesses(this.schoolsFilters, this.statusFilters);
  // }

  // public filterStatus(id: number, checked: boolean): void {
  //   if (checked && !this.statusFilters.some(x => x === id)) {
  //     this.statusFilters.push(id);
  //   } else if (!checked && this.statusFilters.some(x => x === id)) {
  //     this.statusFilters.splice(this.statusFilters.indexOf(id), 1);
  //   }
  //   this.callFilters();
  // }

  // public searchProcess(search: string): void {
  //   this.inSearch = search !== '' ? true : false;
  //   if (!this.processes) {
  //     return;
  //   }
  //   this.callFilters();
  //   const processes = this.store.filterSearch(search);
  //   this.processes$ = this.store.filterProcesses(this.schoolsFilters, this.statusFilters, processes);
  // }

  public closeSidenav(): void {
    this.location.back();
    this.sidenavRight.close();
  }

  public schoolIsVisible(): void {
    const { idSchool } = auth.getCurrentUser();
    this.showSchool = idSchool === 0 ? true : false;
  }

  private setDataRejection(process: Process): any {
    return {
      id: process.id,
      status: 7,
      description: 'Indeferido',
      user: auth.getCurrentUser().id,
      process: process
    };
  }

  public onScroll(): void {
    this.showList += 15;
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


  public editProcess(process: Process): void {
    this.router.navigate([process.identity.toLocaleUpperCase(), 'editar'], { relativeTo: this.route });
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

  public generateReportToProcess(process: Process): void {
    this.store.generateReport(process.id, 'Relatório gerado!');
  }

  public generateGeneralProcessReport(): void {
    const status = this.statusFilters.length === 1 ? this.statusFilters[0] : this.scholarshipService.statusSelected;
    const data = {
      school: this.schoolsFilters.length === 1 ? this.schoolsFilters[0] : this.scholarshipService.schoolSelected,
      status: status === 0 || status === undefined || status == null ? -1 : status
    };
    this.reportService.reportProcesses(data).subscribe(urlData => {
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
      this.snackBar.open('Erro ao gerar relatório relatório!', 'OK', { duration: 5000 });
    });
  }


  public changeStatusToProcess(process: ProcessDataInterface, status: number): void {
    const user = auth.getCurrentUser();
    this.scholarshipService
    .changeProcessStatus(process.id, status, { userId: user.id }).subscribe(() => {
    }, err => this.snackBar.open('Erro ao alterar o status do processo, tente novamente.', 'OK', { duration: 5000 }));
  }

  public toApprove(process: ProcessDataInterface): void {
    if (process.status.id === 2 || process.status.id === 3 || process.status.id === 7) {
      this.changeStatusToProcess(process, 4);
    } else {
      const dialogConfig = new MatDialogConfig();

      this.setDialogAprove(dialogConfig, process);
      const dialogRef = this.dialog.open(VacancyComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(vacancy => {
        if (vacancy) {
          const { id } = auth.getCurrentUser();
          this.scholarshipService
            .saveVacancy(process.id, { userId: id, status: vacancy.idStatus, dataRegistration: vacancy.dataRegistration })
            .subscribe(() => {
              this.snackBar.open('Processo aprovado com sucesso.', 'OK', { duration: 5000 });
            }, err => this.snackBar.open('Erro ao salvar a aprovação do processo, tente novamente.', 'OK', { duration: 5000 }));
        }
      });
    }
  }

  private setDialogAprove(dialogConfig: MatDialogConfig<any>, process: ProcessDataInterface): void {
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (this.layout === 'row') {
        dialogConfig.width = '400px';
    }
    dialogConfig.data = {
        process: process
    };
  }

  public toPendency(process: ProcessDataInterface): void {
    const dialogConfig = new MatDialogConfig();

    this.setDialogPendecy(dialogConfig, process);
    const dialogRef = this.dialog.open(PendencyComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const { id } = auth.getCurrentUser();
        this.scholarshipService
          .savePendency(process.id, { userId: id, pendency: data.pendency })
          .subscribe(() => {
            this.snackBar.open('Pendência salva com sucesso.', 'OK', { duration: 5000 });
          }, err => this.snackBar.open('Erro ao salvar pendência do processo, tente novamente.', 'OK', { duration: 5000 }));
      }
    });
  }

  private setDialogPendecy(dialogConfig: MatDialogConfig<any>, process: ProcessDataInterface) {
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    if (this.layout === 'row') {
        dialogConfig.width = '60%';
    }
    dialogConfig.data = {
        process: process
    };
  }

  public toReject(process, idMotive: number): void {
    if (auth.getCurrentUser().idSchool === 0 && (process.status > 1 && process.status < 7)) {
      const { id } = auth.getCurrentUser();
      this.scholarshipService.saveReject(this.setDataRejection(process), {
        userId: id,
        motiveReject: this.setReasonForRejection(idMotive)
      }).subscribe(() => {}, err => this.snackBar.open('Erro ao indeferir processo, tente novamente.', 'OK', { duration: 5000 }));
    }
  }

  private setReasonForRejection(idMotive: number): string {
    if (idMotive === 1) {
      return 'Acadêmico';
    } else if (idMotive === 2) {
      return 'Financeiro';
    } else if (idMotive === 3) {
      return 'Renda';
    } else if (idMotive === 4) {
      return 'Disciplinar';
    } else {
      return 'Documentação';
    }
  }

  public sentDocuments(event: MatSlideToggleChange, process: ProcessDataInterface): void {
    if (process.status.id === 3) {
      const { id } = auth.getCurrentUser();
      this.scholarshipService
        .sentDocuments(process.id, { userId: id })
        .subscribe(() => {},
        err => {
          this.snackBar.open('Erro ao marcar os documentos como enviados, tente novamente.', 'OK', { duration: 5000 });
        });
    }
  }

  public removeProcess(process: ProcessDataInterface): void {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este processo?', 'REMOVER')
      .subscribe(res => {
        if (res === true) {
          this.scholarshipService.deleteProcess(process.id).subscribe(() => {
            this.snackBar.open('Processo removido!', 'OK', { duration: 5000 });
          }, err => {
            console.log(err);
            this.snackBar.open('Erro ao remover processo, tente novamente.', 'OK', { duration: 5000 });
          });
        }
      });
  }

  public generateNewPasswordResponsible(process: Process): void {
    const dataNewPassword = this.setDataNewPasswordResponsible(process);
    this.store.generateNewPasswordResponsible(dataNewPassword);
  }

  private setDataNewPasswordResponsible(process: Process) {
    return {
      id: process.student.responsible.id,
      idUser: auth.getCurrentUser().id
    };
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { Treasurer } from '../../../../treasury/models/treasurer';
import { Observable } from 'rxjs/Observable';
import { TreasuryService } from '../../../../treasury/treasury.service';
import { Process } from '../../../models/process';
import { Student } from '../../../models/student';
import { Responsible } from '../../../models/responsible';
import { ScholarshipService } from '../../../scholarship.service';
import { ScholarshipComponent } from '../scholarship.component';
import { AuthService } from '../../../../shared/auth.service';
import { PendencyComponent } from '../pendency/pendency.component';
import { VacancyComponent } from '../vacancy/vacancy.component';
import { School } from '../../../models/school';
import { forEach } from '@angular/router/src/utils/collection';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { Router } from '@angular/router';
import { MatDialogRef,
        MatDialog,
        MatSnackBar,
        MatExpansionPanel,
        matExpansionAnimations,
        MatSidenav,
        MatSlideToggleChange } from '@angular/material';
import { ReportService } from '../../../../shared/report.service';

@Component({
  selector: 'app-process-data',
  templateUrl: './process-data.component.html',
  styleUrls: ['./process-data.component.scss']
})
export class ProcessDataComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  search$ = new Subject<string>();
  searchString = '';
  showList = 15;
  schools: School[] = new Array<School>();
  idSchool = '-1';
  showSchool = false;
  refresh$ = new Observable<boolean>();

  schoolsSelecteds: any[] = new Array<any>();
  statusSelecteds: any[] = new Array<any>();

  processes: Process[] = new Array<Process>();  
  allProcesses: Process[] = new Array<Process>();
  processes$: Observable<Process[]>;

  dialogRef: MatDialogRef<PendencyComponent>;
  dialogRef2: MatDialogRef<VacancyComponent>;

  layout: String = 'row';

  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private sidenavService: SidenavService,
    private router: Router,
    private reportService: ReportService
  ) { }

  ngOnInit() {
    this.getData();
    this.loadSelected();
    this.setFilters();
    this.search$.subscribe(search => {
      this.searchProcess(search, false, false);
    });
    this.scholarshipService.refresh$.subscribe((refresh: boolean) => {
      this.searchProcess('', false, false);
    });
    this.sidenavService.setSidenav(this.sidenavRight);
    this.closeSidenav();
  }

  closeSidenav() {
    this.sidenavRight.close();
    this.getData();
    this.scholarshipService.processEdit = new Process();
    this.router.navigate([this.router.url.replace('/novo', '').replace('/editar', '')]);
  }

  getData() {
    this.processes = [];
    // get data from schools
    if (this.authService.getCurrentUser().idSchool === 0) {
      this.scholarshipService.getSchools().subscribe((data: School[]) => {
        this.schools = Object.assign(this.schools, data as School[]);
        this.setSchoolsFilters();
      });
    }
    this.idSchool = this.scholarshipService.schoolSelected;
    this.showSchool = this.idSchool === '-1';
    if (this.idSchool === '-1' && this.authService.getCurrentUser().idSchool !== 0) {
      this.idSchool = this.authService.getCurrentUser().idSchool.toString();
      this.showSchool = false;
    }
    if (this.scholarshipService.statusSelected > 0) {
      return;
    }
    this.scholarshipService.getProcesses(this.idSchool).subscribe((data: Process[]) => {
      this.processes = Object.assign(this.processes, data as Process[]);
      this.allProcesses = this.processes;
      this.processes.forEach(
        item => {
          item.statusString = this.getStatusToString(item.status);
        }
      );
      this.processes$ = Observable.of(this.processes);
    });
  }

  loadSelected() {
    this.statusSelecteds.push({id: 1, selected: false});
    this.statusSelecteds.push({id: 2, selected: false});
    this.statusSelecteds.push({id: 3, selected: false});
    this.statusSelecteds.push({id: 4, selected: false});
    this.statusSelecteds.push({id: 5, selected: false});
    this.statusSelecteds.push({id: 6, selected: false});
    this.statusSelecteds.push({id: 7, selected: false});
  }

  setFilters() {
    if (this.scholarshipService.statusSelected > 0) {
      this.statusSelecteds[this.scholarshipService.statusSelected - 1].selected = true;
      this.searchProcess('', true, false);
    } else {
      this.statusSelecteds.forEach(item => {
        item.selected = true;
      });
    }
  }

  setSchoolsFilters() {
    this.schoolsSelecteds = this.schools;
    this.schoolsSelecteds.forEach(item => {
      if (this.idSchool === '-1') {// [Todas]
        item.selected = true;
      } else if (this.idSchool === item.id) {
        item.selected = true;
      } else {
        item.selected = false;
      }
    });
  }

  filterBySchool(id, index) {
    this.schoolsSelecteds[index].selected = !this.schoolsSelecteds[index].selected;
    this.showSchool = this.isManySchoolsSelecteds();
    this.searchProcess(this.searchString, false, true);
  }

  isManySchoolsSelecteds() {
    let totalSelected = 0;
    this.schoolsSelecteds.forEach(item => {
      if (item.selected) {
        totalSelected++;
      }
    });
    return totalSelected > 1;
  }

  filterByStatus(i) {
    this.statusSelecteds[i - 1].selected = !this.statusSelecteds[i - 1].selected;
    this.searchProcess(this.searchString, true, false);
  }

  getStatusToString(status) {
    if (status === 1) {
      return 'Aguardando Análise';
    } else if (status === 2) {
      return 'Em análise';
    } else if (status === 3) {
      return 'Pendente';
    } else if (status === 4) {
      return 'Aguardando Vaga da Bolsa';
    } else if (status === 5) {
      return 'Vaga liberada (50%)';
    } else if (status === 6) {
      return 'Vaga liberada (100%)';
    } else if (status === 7) {
      return 'Bolsa Indeferida';
    } else if (status === 8) {
      return 'Não Matriculou';
    }
  }

  searchProcess(search, isStatus, isSchool) {
    this.processes = [];
    const id = this.authService.getCurrentUser().idSchool.toString();
    this.processes = this.allProcesses;
    this.processes.forEach(
      item => {
        item.statusString = this.getStatusToString(item.status);
      }
    );
    search = search.toLowerCase();
    this.searchString = search;
    this.processes$ = Observable.of(this.processes.filter(data => {
      return (this.searchOnlySchool(data.student.school.id)) &&
        (this.searchOnlyStatus(data.status)) &&
        (data.student.name.toLowerCase().indexOf(search) !== -1 ||
        data.student.responsible.name.toLowerCase().indexOf(search) !== -1 ||
        data.student.school.name.toLowerCase().indexOf(search) !== -1 ||
        data.statusString.toLowerCase().indexOf(search) !== -1 ||
        data.protocol.toLowerCase().indexOf(search) !== -1);
    }));
    /*this.scholarshipService.getProcesses(id === '0' ? '-1' : id).subscribe((data: Process[]) => {
      this.processes = Object.assign(this.processes, data as Process[]);
      this.processes.forEach(
        item => {
          item.statusString = this.getStatusToString(item.status);
        }
      );
      search = search.toLowerCase();
      this.searchString = search;
      this.processes$ = Observable.of(this.processes.filter(data => {
        return (this.searchOnlySchool(data.student.school.id)) &&
          (this.searchOnlyStatus(data.status)) &&
          (data.student.name.toLowerCase().indexOf(search) !== -1 ||
          data.student.responsible.name.toLowerCase().indexOf(search) !== -1 ||
          data.student.school.name.toLowerCase().indexOf(search) !== -1 ||
          data.statusString.toLowerCase().indexOf(search) !== -1 ||
          data.protocol.toLowerCase().indexOf(search) !== -1);
      }));
    });*/
  }

  searchOnlySchool(idSchoolToFilter) {
    if (idSchoolToFilter === undefined || this.schoolsSelecteds.length === 0) {
      return true;
    }
    return this.schoolsSelecteds.find(f => f.id === idSchoolToFilter).selected;
  }

  searchOnlyStatus(idStatusToFilter) {
    if (idStatusToFilter === undefined) {
      return true;
    }
    return this.statusSelecteds.find(f => f.id === idStatusToFilter).selected;
  }


  searchOnlyText(search, filteredProcess) {
    const filteredProcess2 = filteredProcess.filter(data => {
      return data.student.name.toLowerCase().indexOf(search) !== -1 ||
        data.student.responsible.name.toLowerCase().indexOf(search) !== -1 ||
        data.student.school.name.toLowerCase().indexOf(search) !== -1 ||
        data.statusString.toLowerCase().indexOf(search) !== -1 ||
        data.protocol.toLowerCase().indexOf(search) !== -1;
    });
    return filteredProcess2;
  }

  onScroll() {
    this.showList += 15;
  }

  toWaiting(p) {
    this.scholarshipService.updateToStatus(p[0].id, 2, 'Iniciado').subscribe(() => {
      p[0].status = 2;
      this.updateProcess(p[0]);
    }, err => {
      this.snackBar.open('Erro ao salvar o processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  toPendency(p) {
    this.scholarshipService.updateProcess(p[0]);
    this.dialogRef = this.dialog.open(PendencyComponent, {
      width: '70%'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      this.updateProcess(this.scholarshipService.processSelected);
      if (!result) {
        return;
      }
    });
  }

  toReject(p, idMotive) {
    let motive = '';
    if (idMotive === 1) {
      motive = 'Acadêmico';
    } else if (idMotive === 2) {
      motive = 'Financeiro';
    } else if (idMotive === 3) {
      motive = 'Renda';
    } else if (idMotive === 4) {
      motive = 'Disciplinar';
    } else {
      motive = 'Documentação';
    }

    this.scholarshipService.saveReject(p[0].id, 7, 'Indeferido', motive).subscribe(() => {
        p[0].status = 7;
        p[0].motiveReject = motive;
        this.updateProcess(p[0]);
      }, err => {
        this.snackBar.open('Erro ao indeferir, tente novamente.', 'OK', { duration: 5000 });
      });
  }

  getMotiveToReject(motive) {
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

  toApprove(p) {
    if (p[0].status === 2 || p[0].status === 3 || p[0].status == 7) {
      this.scholarshipService.updateToStatus(p[0].id, 4, 'Aguardando vaga').subscribe(() => {
        p[0].status = 4;
        this.updateProcess(p[0]);
      }, err => {
        this.snackBar.open('Erro ao aprovar o processo, tente novamente.', 'OK', { duration: 5000 });
      });
    } else {
      this.scholarshipService.updateProcess(p[0]);
      this.dialogRef2 = this.dialog.open(VacancyComponent, {
        width: '400px'
      });
      this.dialogRef2.afterClosed().subscribe(result => {
        this.updateProcess(this.scholarshipService.processSelected);
        if (!result) {
          return;
        }
      });
    }
  }

  sendDocuments(event: MatSlideToggleChange, process: Process) {
    if (process.status === 3) {
      process.isSendDocument = event.checked;
      this.scholarshipService.sendDocument(process).subscribe();
    }
  }

  updateProcess(newProcess) {
    const index = this.processes.findIndex(f => f.id === newProcess.id);
    // this.processes.splice(index, 1);
    newProcess.statusString = this.getStatusToString(newProcess.status);
    this.processes[index] = newProcess;
  }

  editProcess(p) {
    this.router.navigate(['/bolsas/processos/editar']);
    this.scholarshipService.processEdit = p[0];
    this.sidenavService.open();
  }

  expandPanel(matExpansionPanel) {
    matExpansionPanel.toggle();
    if (!matExpansionPanel._expanded) {
      this.processes$ = Observable.of(this.processes);
    }
  }

  onResize(event) {
    const element = event.target.innerWidth;
    if (element > 600) {
      this.layout = 'row';
    } else {
      this.layout = 'column';
    }
  }

  toNotEnroll(process: Process): void {
    if(process.status === 5 || process.status === 6) {
      this.scholarshipService.updateToStatus(process.id, 8, 'Não Matriculou').subscribe(() => {
        process.status = 8;
        this.updateProcess(process);
      }, err => {
        this.snackBar.open('Erro ao atualizar o processo, tente novamente.', 'OK', { duration: 5000 });
      });
    }
  }

  generateReport(p){
    this.scholarshipService.getPasswordResponsible(p[0].id).subscribe(data => {
      let password = data;
      this.reportService.reportProcess(p[0].id, password).subscribe(data => {
        var fileUrl = URL.createObjectURL(data);
        window.open(fileUrl);
      }, err => console.log(err));
      this.snackBar.open('Gerando relatório!', 'OK', { duration: 5000 });
    });
  }
}

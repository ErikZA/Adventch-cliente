import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
import 'rxjs/add/observable/of';

import { MatSnackBar } from '@angular/material';

import { Process } from './../../models/process';
import { School } from './../../models/school';
import { AuthService } from './../../../../shared/auth.service';
import { ScholarshipService } from '../../scholarship.service';
import { ReportService } from './../../../../shared/report.service';
import { SidenavService } from '../../../../core/services/sidenav.service';

@Injectable()
export class ProcessesStore {

  processes$: Observable<Process[]>;
  schools$: Observable<School[]>;
  private processesFilters: Process[];
  private inSearch: boolean;
  private _processes: BehaviorSubject<Process[]>;
  private _schools: BehaviorSubject<School[]>;
  private dataStore: {
    schools: School[],
    processes: Process[]
  };

  constructor(
    private service: ScholarshipService,
    private reportService: ReportService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private location: Location,
    private sidenavService: SidenavService
  ) {
    this.dataStore = {
      schools: [],
      processes: []
    };
    this._schools = <BehaviorSubject<School[]>>new BehaviorSubject([]);
    this.schools$ = this._schools.asObservable();
    this._processes = <BehaviorSubject<Process[]>>new BehaviorSubject([]);
    this.processes$ = this._processes.asObservable();
    this.inSearch = false;
  }

  public loadAll() {
    this.loadAllSchools();
    this.loadAllProcesses();
  }

  private loadAllSchools(): void {
    this.service.getSchools().subscribe((data: School[]) => {
      if (this.authService.getCurrentUser().idSchool === 0) {
        this.dataStore.schools = data;
      } else {
        this.dataStore.schools = data.filter(x => x.id === this.authService.getCurrentUser().idSchool);
      }
      this._schools.next(Object.assign({}, this.dataStore).schools);
    }, error => console.log('Could not load todos processes.'));
  }

  private loadAllProcesses(): void {
    let idSchool;
    idSchool = this.authService.getCurrentUser().idSchool === 0 ? -1 : this.authService.getCurrentUser().idSchool;
    this.service.getProcesses(idSchool).subscribe(data => {
      this.setStatus(data);
      this.dataStore.processes = data;
      this._processes.next(Object.assign({}, this.dataStore).processes);
    }, error => console.log('Could not load todos processes.'));
  }

  public loadProcess(id: number) {
    this.service.getProcessById(id).subscribe(data => {
      let notFound = true;
      data.statusString = this.getStatusToString(data.status);
      this.dataStore.processes.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.processes[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.processes.push(data);
      }

      this._processes.next(Object.assign({}, this.dataStore).processes);
    }, error => console.log('Could not load todo.'));
  }

  public loadProcessByIdentity(identity: string) {
    this.service.getProcessByIdentity(identity).subscribe((data: Process) => {
      let notFound = true;
      data.statusString = this.getStatusToString(data.status);
      this.dataStore.processes.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.processes[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.processes.push(data);
      }

      this._processes.next(Object.assign({}, this.dataStore).processes);
    }, error => console.log('Could not load todo.'));
  }

  public saveProcess(processData: any): void {
    this.service.postProcess(processData).subscribe((process: Process) => {
      this.location.back();
      this.loadProcess(process.id);
      this.generateReport(process.id);
      this.sidenavService.close();
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar o processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  private setStatus(processes: Process[]): void {
    if (processes) {
      processes.forEach(item => {
          item.statusString = this.getStatusToString(item.status);
        }
      );
    }
  }

  private getStatusToString(status): string {
    if (status === 1) {
      return 'Aguardando Análise';
    } else if (status === 2) {
      return 'Em Análise';
    } else if (status === 3) {
      return 'Pendente';
    } else if (status === 4) {
      return 'Aguardando Vaga da Bolsa';
    } else if (status === 5) {
      return 'Vaga Liberada (50%)';
    } else if (status === 6) {
      return 'Vaga Liberada (100%)';
    } else if (status === 7) {
      return 'Bolsa Indeferida';
    } else if (status === 8) {
      return 'Não Matriculou';
    }
  }

  public filterProcessesSchool(idSchool: number): Observable<Process[]> {
    if (idSchool === -1) {
      return this.processes$;
    } else {
      return this.processes$.pipe(
        map((todos: Process[]) => todos.filter((item: Process) => item.student.school.id === idSchool))
      );
    }
  }

  public filterProcesses(schoolsId: Array<Number>, statusId: Array<Number>, processes?: Process[]): Observable<Process[]> {
    if (!this.inSearch && processes === undefined) {
      this.processesFilters = new Array<Process>();
      this.processesFilters = this.dataStore.processes;
    } else {
      this.processesFilters = processes === undefined ? this.processesFilters : processes;
    }
    const filtersSchoolsProcesses = this.filterSchools(schoolsId, this.processesFilters);
    const filtersStatusProcesses = this.filterStatus(statusId, filtersSchoolsProcesses);

    return Observable.of(filtersStatusProcesses);
  }

  private filterSchools(schoolsId: Array<Number>, processes: Process[]): Process[] {
    if (processes !== undefined && processes != null) {
      return processes.filter(process => {
          return schoolsId.some(x => x === process.student.school.id);
      });
    }
  }

  private filterStatus(statusId: Array<Number>, processes: Process[]): Process[] {
    if (processes !== undefined || processes != null) {
      return processes.filter(process => {
          return statusId.some(x => x === process.status);
      });
    }
  }

  public filterSearch(search: string): Process[] {
    search = search.toLowerCase();
    const processes = this.dataStore.processes;
    if (search === '') {
      this.inSearch = false;
      return processes;
    }
    this.inSearch = true;
    return processes.filter(data => {
      return data.student.name.toLowerCase().indexOf(search) !== -1 ||
        data.student.responsible.name.toLowerCase().indexOf(search) !== -1 ||
        data.student.school.name.toLowerCase().indexOf(search) !== -1 ||
        data.statusString.toLowerCase().indexOf(search) !== -1 ||
        data.protocol.toLowerCase().indexOf(search) !== -1;
    });
  }

  private updateProcess(process: Process): void {
    process.statusString = this.getStatusToString(process.status);
    this.dataStore.processes.forEach((p: Process, i: number) => {
      if (p.id === process.id) {
        this.dataStore.processes[i] = process;
      }
    });
    this._processes.next(Object.assign({}, this.dataStore).processes);
  }

  public changeStatus(processStatusChanged: any): void {
    this.service.updateToStatus(processStatusChanged).subscribe(() => {
      processStatusChanged.process.status = processStatusChanged.status;
      this.updateProcess(processStatusChanged.process);
    }, err => {
      this.snackBar.open('Erro ao salvar o status do processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public sendRejection(processRejection: any, idMotive: number): void {
    processRejection.motive = this.setReasonForRejection(idMotive);
    this.service.saveReject(processRejection).subscribe(() => {
      processRejection.process.status = 7;
      processRejection.process.motiveReject = processRejection.motive;
      this.updateProcess(processRejection.process);
    }, err => {
      this.snackBar.open('Erro ao indeferir processo, tente novamente.', 'OK', { duration: 5000 });
    });
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

  public savePendecy(pendecyDataProcess: any): void {
    this.service.savePendency(pendecyDataProcess).subscribe(() => {
      pendecyDataProcess.process.status = 3;
      pendecyDataProcess.process.pendency = pendecyDataProcess.pendency;
      this.updateProcess(pendecyDataProcess.process);
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar pendência do processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public sendDocuments(sendDocumentsDataProcess: any): void {
    this.service.sendDocument(sendDocumentsDataProcess).subscribe(() => {
      sendDocumentsDataProcess.process.isSendDocument = sendDocumentsDataProcess.isSendDocument;
      this.updateProcess(sendDocumentsDataProcess.process);
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar o envio de documentos do processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public saveVacancy(vacacyDataProcess: any): void {
    this.service.saveVacancy(vacacyDataProcess).subscribe(() => {
      vacacyDataProcess.process.status = vacacyDataProcess.status;
      vacacyDataProcess.process.dateRegistration = vacacyDataProcess.dateRegistration;
      this.updateProcess(vacacyDataProcess.process);
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar a aprovação do processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  public generateNewPasswordResponsible(newPasswordDataResponsible: any) {
    this.service.generateNewPasswordResponsible(newPasswordDataResponsible).subscribe(data => {
      if (data && data !== undefined && data != null) {
        this.snackBar.open('Nova Senha do Responsável Gerada com Sucesso!', 'OK', { duration: 5000 });
      }
    }, err => {
        console.log(err);
        this.snackBar.open('Erro ao Gerar Nova Senha do Responsável!', 'OK', { duration: 5000 });
    });
  }

  public generateReport(id: number): void {
    this.service.getPasswordResponsible(id).subscribe(data => {
      const password = data.password;
      this.reportService.reportProcess(id, password).subscribe(dataURL => {
        const fileUrl = URL.createObjectURL(dataURL);
        const element = document.createElement('a');
        element.href = fileUrl;
        element.download = 'processo.pdf';
        element.target = '_blank';
        element.click();
      }, err => console.log(err));
      this.snackBar.open('Processo salvo com sucesso!', 'OK', { duration: 5000 });
    });
  }

  public removeProcess(id: number, idUser: number) {
    this.service.deleteProcess(id, idUser).subscribe(() => {
      this.dataStore.processes.forEach((t, i) => {
        if (t.id === id) {
          this.dataStore.processes.splice(i, 1);
        }
      });
      this._processes.next(Object.assign({}, this.dataStore).processes);
      this.snackBar.open('Processo removido!', 'OK', { duration: 5000 });
    }, error => {
      console.log(error);
      this.snackBar.open('Erro ao remover processo, tente novamente.', 'OK', { duration: 5000 });
    });
  }
}
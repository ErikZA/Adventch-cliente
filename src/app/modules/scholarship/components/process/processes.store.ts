import { School } from './../../models/school';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';

import { MatSnackBar } from '@angular/material';

import { Process } from './../../models/process';
import { ScholarshipService } from '../../scholarship.service';
import { AuthService } from './../../../../shared/auth.service';

@Injectable()
export class ProcessesStore {

  processes$: Observable<Process[]>;
  schools$: Observable<School[]>;
  private processesFilters: Process[];
  private inShearch: boolean;
  private _processes: BehaviorSubject<Process[]>;
  private _schools: BehaviorSubject<School[]>;
  private dataStore: {
    schools: School[],
    processes: Process[]
  };

  constructor(
    private service: ScholarshipService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
  ) {
    this.dataStore = {
      schools: [],
      processes: []
    };
    this._schools = <BehaviorSubject<School[]>>new BehaviorSubject([]);
    this.schools$ = this._schools.asObservable();
    this._processes = <BehaviorSubject<Process[]>>new BehaviorSubject([]);
    this.processes$ = this._processes.asObservable();
    this.inShearch = false;
  }

  public loadAll() {
    this.loadAllSchools();
    this.loadAllProcesses();
  }

  private loadAllSchools(): void {
    if (this.authService.getCurrentUser().idSchool === 0) {
      this.service.getSchools().subscribe((data: School[]) => {
        this.dataStore.schools = data;
        this._schools.next(Object.assign({}, this.dataStore).schools);
      }, error => console.log('Could not load todos processes.'));
    }
  }

  private loadAllProcesses(): void {
    let idSchool;
    idSchool = this.authService.getCurrentUser().idSchool;
    if (idSchool === 0) {
      idSchool = this.service.schoolSelected;
      if (idSchool === '-1' && this.authService.getCurrentUser().idSchool !== 0) {
      }
    }
    this.service.getProcesses(idSchool).subscribe(data => {
      this.setStatus(data);
      this.dataStore.processes = data;
      this._processes.next(Object.assign({}, this.dataStore).processes);
    }, error => console.log('Could not load todos processes.'));
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

  public filterProcesses(schoolsId: Array<Number>, statusId: Array<Number>, processes?: Process[]): Observable<Process[]> {
    if (!this.inShearch && processes === undefined) {
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
      this.inShearch = false;
      return processes;
    }
    this.inShearch = true;
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
}

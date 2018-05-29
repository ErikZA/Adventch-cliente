import { Component, OnInit } from '@angular/core';
import { Responsible } from '../../../models/responsible';
import { AuthService } from '../../../../shared/auth.service';
import { Process } from '../../../models/process';
import { ScholarshipService } from '../../../scholarship.service';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-responsible-data',
  templateUrl: './responsible-data.component.html',
  styleUrls: ['./responsible-data.component.scss']
})
export class ResponsibleDataComponent implements OnInit {
  processes$: Observable<Process[]>;
  processes: Process[];
  responsible: Responsible;
  showList = 15;

  constructor(
    private authService: AuthService,
    private scholarshipService: ScholarshipService
  ) { }

  ngOnInit() {
    this.loadCurrentResponsible();
    this.loadProcess();
    this.getResponsible();
    this.getProcesses();
  }

  loadCurrentResponsible(){
    this.responsible = this.authService.getcurrentResponsible();
  }

  loadProcess(){

  }

  logoff(){
    this.authService.logoffResponsible();
  }

  /*
  AutoScroll
   */
  onScroll() {
    this.showList += 15;
  }

  getResponsible(): void {
    this.scholarshipService.currentResponsible.subscribe(data => {
      console.log(data);
      this.responsible = data;
    });
  }

  getProcesses(): void {
    this.processes = [];
    this.scholarshipService.getProcessesResponsible(this.responsible.id).subscribe((data: Process[]) => {
      this.processes = Object.assign(this.processes, data as Process[]);
      this.processes.forEach(
        item => {
          item.statusString = this.getStatusToString(item.status);
        }
      );
      this.processes$ = Observable.of(this.processes);
    });
  }

  getStatusToString(status) {
    if (status === 1) {
      return 'Aguardando início';
    }
    if (status === 2) {
      return 'Em análise';
    }
    if (status === 3) {
      return 'Pendente';
    }
    if (status === 4) {
      return 'Aguardando vaga';
    }
    if (status === 5) {
      return 'Vaga liberada (50%)';
    }
    if (status === 6) {
      return 'Vaga liberada (100%)';
    }
    if (status === 7) {
      return 'Bolsa Indeferida';
    }
  }
}

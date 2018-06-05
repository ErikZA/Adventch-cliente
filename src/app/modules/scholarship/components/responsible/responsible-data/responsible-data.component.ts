import { Component, OnInit } from '@angular/core';
import { Responsible } from '../../../models/responsible';
import { AuthService } from '../../../../shared/auth.service';
import { Process } from '../../../models/process';
import { ScholarshipService } from '../../../scholarship.service';

@Component({
  selector: 'app-responsible-data',
  templateUrl: './responsible-data.component.html',
  styleUrls: ['./responsible-data.component.scss']
})
export class ResponsibleDataComponent implements OnInit {
  responsible: Responsible;
  processes: Process[] = new Array<Process>();

  get year(): number { return new Date().getFullYear(); }
  showList = 15;

  constructor(
    private authService: AuthService,
    private scholarshipService: ScholarshipService
  ) { }

  ngOnInit() {
    this.loadCurrentResponsible();
    this.loadProcesses();
    this.getResponsible();
  }

  loadCurrentResponsible(){
    this.responsible = this.authService.getcurrentResponsible();
  }

  loadProcesses(){
    this.scholarshipService.getProcessesResponsible(this.responsible.id).subscribe((data: Process[]) => {
      this.processes = Object.assign(this.processes, data as Process[]);
      this.processes.forEach(
        item => {
          item.statusString = this.getStatusToString(item.status);
        }
      );
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
}

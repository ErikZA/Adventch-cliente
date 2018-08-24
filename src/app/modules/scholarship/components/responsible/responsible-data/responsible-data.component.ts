import { Observable } from 'rxjs/Observable';
import { ProcessResponsibleInterface } from './../../../interfaces/process-responsible-interface';
import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../../../../shared/auth.service';
import { ScholarshipService } from '../../../scholarship.service';

import { Process } from '../../../models/process';
import { Responsible } from '../../../models/responsible';
import { auth } from '../../../../../auth/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-responsible-data',
  templateUrl: './responsible-data.component.html',
  styleUrls: ['./responsible-data.component.scss']
})
export class ResponsibleDataComponent implements OnInit {
  responsible: Responsible;
  processes: Process[] = new Array<Process>();
  processes$: Observable<ProcessResponsibleInterface[]>;

  get year(): number { return new Date().getFullYear(); }
  showList = 15;

  constructor(
    private scholarshipService: ScholarshipService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadCurrentResponsible();
    this.loadProcesses();
  }

  private loadCurrentResponsible(): void {
    this.responsible = auth.getCurrentResponsible();
  }

  private loadProcesses(): void {
    this.processes$ = this.scholarshipService.getProcessesResponsible(this.responsible.id);
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

  public logoff(): void {
    this.router.navigate(['/educacao']);
    auth.logoffResponsible();
  }

  /*
  AutoScroll
   */
  public onScroll(): void {
    this.showList += 15;
  }
}

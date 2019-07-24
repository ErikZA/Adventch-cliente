import { Component, OnInit } from '@angular/core';
import { auth } from '../../../../../auth/auth';
import { Router } from '@angular/router';
import { ScholarshipService } from '../../../scholarship.service';
import { Observable } from 'rxjs';
import { Process } from '../../../models/process';
import { Responsible } from '../../../models/responsible';
import { ProcessResponsibleInterface } from '../../../interfaces/process-responsible-interface';

@Component({
  selector: 'app-student-process-data',
  templateUrl: './student-process-data.component.html',
  styleUrls: ['./student-process-data.component.scss']
})
export class StudentProcessDataComponent implements OnInit {

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
    if (motive === 'Documentação') {
      return 'Não Contemplado devido a documentação inconsistente a análise correspondente.';
    }
    if (motive === 'Desistente') {
      return 'Abdicação do processo de bolsa solicitado.';
    }
    if (motive === 'Não Contemplado') {
      return 'Não foi Contemplada, em caso de dúvidas, entrar em contato com a unidade escolar.';
    }
    if (motive === 'Não há Vaga') {
      return 'Não contemplado por não haver vaga na turma ou % de bolsa solicitado.';
    }
    if (motive === 'Não Matriculou') {
      return 'Não matriculou.';
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

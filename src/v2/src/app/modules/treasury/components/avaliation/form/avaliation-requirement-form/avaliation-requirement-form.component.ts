import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription } from 'rxjs';
import { skipWhile, tap, switchMap } from 'rxjs/operators';
import { auth } from '../../../../../../auth/auth';
import { RequirementAvaliationChurchInterface } from '../../../../interfaces/requirement/requirement-avaliation-church-interface';
import { RequirementsService } from '../../../requirements/requirements.service';
import { EFeatures } from '../../../../../../shared/models/EFeatures.enum';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AvaliationEditInterface } from '../../../../interfaces/avaliation/avaliation-edit-interface';
import {
  AvaliationRequirementAvaliationFormInterface
} from '../../../../interfaces/avaliation/avaliation-requirement-avaliation-form-interface';
import { AvaliationRequirementEditInterface } from '../../../../interfaces/avaliation/avaliation-requirement-edit-interface';
import { FormGroup } from '@angular/forms';
import { ChurchAvaliationFormInterface } from '../../../../interfaces/avaliation/church-avaliation-form-interface';

@Component({
  selector: 'app-avaliation-requirement-form',
  templateUrl: './avaliation-requirement-form.component.html',
  styleUrls: ['./avaliation-requirement-form.component.scss']
})
@AutoUnsubscribe()
export class AvaliationRequirementFormComponent implements OnInit, OnDestroy {

  sub1: Subscription;


  @Input()
  type: number;
  @Input()
  avaliation: AvaliationEditInterface;
  @Input()
  church: ChurchAvaliationFormInterface;
  @Input()
  formAvaliation: FormGroup;

  sunTotal: number;
  year: number;
  saturday = new Array();
  matriz: {
    indice: number,
    arrayRequiremen: AvaliationRequirementAvaliationFormInterface[],
    date: string
  }[];

  requirementsAvaliation: RequirementAvaliationChurchInterface[];
  avaliationsRequirements: AvaliationRequirementAvaliationFormInterface[];

  constructor(
    private requirementService: RequirementsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.calcSaturday();
    this.sub1 = this.route.params
      .pipe(
        skipWhile(({ year }) => !year),
        tap(({ year }) => this.year = year),
        switchMap(({ year }) => this.loadRequirements(year)),
        tap(() => this.editRequirement()),
        tap(() => this.populeteMatriz())
      ).subscribe();
  }

  ngOnDestroy(): void {

  }

  private editRequirement() {
    if (this.checkIsEdit()) {
      this.avaliation.avaliationsRequirements.forEach(e => {
        this.setScoreRequirementAvaliation(e);
      });
    }
  }

  private setScoreRequirementAvaliation(requirementAvaliationEdit: AvaliationRequirementEditInterface) {
    const _avaliation = this.avaliationsRequirements
      .find(ar => ar.idRequirement === requirementAvaliationEdit.requirement.id);
    if (_avaliation) {
      _avaliation.note = requirementAvaliationEdit.note;
    }
  }

  private loadRequirements(year: number) {
    return this.getRequirementsForm(year)
      .pipe(
        skipWhile((data: RequirementAvaliationChurchInterface[]) => !data),
        tap((data: RequirementAvaliationChurchInterface[]) => this.setRequirementsInForm(data))
      );
  }

  private getRequirementsForm(year: number): Observable<RequirementAvaliationChurchInterface[]> {
    const { id } = auth.getCurrentUnit();
    return this.type === EFeatures.AvaliarAnualmente ? this.requirementService
      .getRequirementsByUnitYearly(id, year) : this.requirementService
        .getRequirementsByUnitMonthlyAndWeekly(id, year);
  }

  private setRequirementsInForm(data: RequirementAvaliationChurchInterface[]): void {
    this.requirementsAvaliation = data;
    this.avaliationsRequirements = [];
    this.requirementsAvaliation.forEach(ra => {
      ra.isFull = false;
      this.avaliationsRequirements
        .push(this.createAvaliationRequirement(ra.score, ra.id, ra.evaluationTypeId, ra.isFull, ra.score, ra.name));
    });
  }

  private checkIsEdit(): boolean {
    return this.avaliation !== undefined && this.avaliation !== null;
  }

  public sumTotalOfRequirements(): number {
    this.sunTotal = 0;
    if (this.matriz !== undefined && this.matriz != null) {
      this.matriz.forEach(req => {
        if (req.indice < (this.saturday.length - 1)) {
          this.sunTotal += req.arrayRequiremen ? req.arrayRequiremen.filter( reqFilter => reqFilter.evaluationTypeId === 3)
          .reduce((prev, r) => prev + r.note, 0) : 0;
        } else {
          this.sunTotal += req.arrayRequiremen ? req.arrayRequiremen.reduce((prev, r) => prev + r.note, 0) : 0;
        }
      });
    }
    return this.sunTotal;
  }

  public updateCheck(id: number, valueNow: number, valueMax: number, indice: number): number {
    const requeriments = this.matriz.find(ar => ar.indice === indice);
    const evaluation = requeriments.arrayRequiremen.find(ar => ar.idRequirement === id);
    if (!isNaN(parseInt((valueNow + ''), 10))) {
      this.noteIsFull(id, parseInt((valueNow + ''), 10), evaluation.note, valueMax, indice);
      return evaluation.note = parseInt((valueNow + ''), 10);
    }
    return valueNow;
  }

  private noteIsFull(id: number, valueNow: number, valuelast: number, valueMax: number, indice: number) {
    const requeriments = this.matriz.find(ar => ar.indice === indice);
    const evaluation = requeriments.arrayRequiremen.find(ar => ar.idRequirement === id);
    if (valueNow === valueMax) {
      evaluation.isFull = false;
    } else if (valueNow > valuelast) {
      evaluation.isFull = false;
    } else if (valueNow < valueMax && valueNow <= valuelast) {
      evaluation.isFull = true;
    }
    console.log(this.church);
  }

  public updateWeekCheck(id: number, valueNow: number, valueMax: number, indice: number): number {
    const requeriments = this.matriz.find(ar => ar.indice === indice);
    const evaluation = requeriments.arrayRequiremen.find(ar => ar.idRequirement === id);
    if (!isNaN(parseInt((valueNow + ''), 10))) {
      this.noteIsFull(id, parseInt((valueNow + ''), 10), evaluation.note, valueMax, indice);
      return evaluation.note = parseInt((valueNow + ''), 10);
    }
    return valueNow;
  }

  private calcSaturday() {
    const d = new Date();
    const getTot = this.daysInMonth(d.getMonth(), d.getFullYear());
    for (let i = 1; i <= getTot; i++) {
      const newDate = new Date(d.getFullYear(), d.getMonth(), i);
      if (newDate.getDay() === 6) {
        this.saturday.push(newDate.toLocaleDateString());
      }
    }
  }

  private daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  public isAnual(): boolean {
    if (this.requirementsAvaliation !== undefined && this.requirementsAvaliation != null) {
      return this.requirementsAvaliation.every(req => req.evaluationTypeId !== 1);
    }
  }

  private populeteMatriz() {
    this.matriz = [];
    if (this.avaliationsRequirements !== undefined && this.avaliationsRequirements != null) {
      for (let i = 0; i < this.saturday.length; i++) {
        this.matriz.push({
          indice: i,
          arrayRequiremen: this.avaliationsRequirements.map(req => {
            return {
              idRequirement: req.idRequirement,
              score: req.score,
              name: req.name,
              note: req.note,
              isFull: req.isFull,
              evaluationTypeId: req.evaluationTypeId
            };
          }),
          date: this.saturday[i]
        });
      }
    }
  }

  private createAvaliationRequirement(noteNow: number, idRequirementNow: number,
    idEvaluationNow: number, isFullNow: boolean, scoreNow: number, nameNow: string):
    AvaliationRequirementAvaliationFormInterface {
    return {
      idRequirement: idRequirementNow,
      score: scoreNow,
      note: noteNow,
      isFull: isFullNow,
      evaluationTypeId: idEvaluationNow,
      name: nameNow
    };
  }

  public getCurrentNote(id: number): number {
    const evaluation = this.avaliationsRequirements.find(ar => ar.idRequirement === id);
    return evaluation.note;
  }

  public getCurrentWeekNote(id: number, indice: number): number {
    const requeriments = this.matriz.find(ar => ar.indice === indice);
    const evaluation = requeriments.arrayRequiremen.find(ar => ar.idRequirement === id);
    return evaluation.note;
  }

  public getAvaliationsRequirement(): AvaliationRequirementAvaliationFormInterface[] {
    return this.avaliationsRequirements;
  }
}

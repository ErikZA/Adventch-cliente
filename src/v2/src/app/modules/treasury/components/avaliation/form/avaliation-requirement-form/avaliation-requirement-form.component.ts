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
import {
  AvaliationRequirementAvaliationFormInterfaceWeekly
} from '../../../../interfaces/avaliation/avaliation-requirement-avaliation-form-interface-weekly';
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
  @Input()
  month: number;
  @Input()
  yearNow: number;


  load = true;
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
        tap(() => this.populeteMatriz()),
        tap(() => this.loadNotesWeekly()),
        tap(() => this.matrizOrder())
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
    switch (this.type) {
      case EFeatures.AvaliarAnualmente: {
        return this.requirementService
        .getRequirementsByUnitYearly(id, year);
      }
      case EFeatures.AvaliarMensalmente: {
        return this.requirementService
      .getRequirementsByUnitMonthly(id, year);
      }
      case EFeatures.AvaliarSemanalmente: {
        return this.requirementService
        .getRequirementsByUnitWeekly(id, year);
      }
      default:
        return null;
    }
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

  public checkIsEdit(): boolean {
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

  public sumTotalOfRequirementsMonth(): number {
    return this.avaliationsRequirements ? this.avaliationsRequirements.filter(reqFilter => reqFilter.evaluationTypeId === 0)
    .reduce((prev, r) => prev + r.note, 0) : 0;
  }

  public sumTotalOfRequirementsYearly(): number {
    return this.avaliationsRequirements ? this.avaliationsRequirements.filter(reqFilter => reqFilter.evaluationTypeId === 1)
    .reduce((prev, r) => prev + r.note, 0) : 0;
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
  }

  public updateYearCheck(id: number, valueNow: number, valueMax: number): number {
    const evaluation = this.avaliationsRequirements.find(ar => ar.idRequirement === id);
    if (!isNaN(parseInt((valueNow + ''), 10))) {
      this.noteIsYearFull(id, parseInt((valueNow + ''), 10), evaluation.note, valueMax);
      return evaluation.note = parseInt((valueNow + ''), 10);
    }
    return valueNow;
  }

  private noteIsYearFull(id: number, valueNow: number, valuelast: number, valueMax: number) {
    if (valueNow === valueMax) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = false; }} );
    } else if (valueNow > valuelast) {
     this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = false; }} );
   } else   if (valueNow < valueMax && valueNow <= valuelast) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = true; }} );
    }
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
    const getTot = this.daysInMonth( new Date(this.yearNow, this.month) );
    for (let i = 1; i <= getTot.getDate(); i++) {
      const newDate = new Date(getTot.getFullYear(), getTot.getMonth(), i);
      if (newDate.getDay() === 6) {
        this.saturday.push(newDate.toLocaleDateString());
      }
    }
  }

  private daysInMonth(date: Date): Date {
    return  new Date(date.getFullYear(), date.getMonth(), 0);
  }

  public isYearly(): boolean {
    if (this.requirementsAvaliation !== undefined && this.requirementsAvaliation != null) {
      return this.requirementsAvaliation.every(req => req.evaluationTypeId !== 1);
    }
  }

  private matrizOrder() {
    this.matriz.forEach( mat => {
      mat.arrayRequiremen.sort(function(a, b) {return a.evaluationTypeId - b.evaluationTypeId; });
      mat.arrayRequiremen.reverse();
    });
  }
  public isMonth(): boolean {
    if (this.church !== undefined && this.church != null) {
      return this.church.isMonth;
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

  private loadNotesWeekly() {
    if (this.checkIsEdit() && this.load) {
      this.matriz.forEach( mat => mat.arrayRequiremen.forEach( req => {
        this.avaliation.avaliationsRequirements
        .forEach( prop => {
          if (prop.idWeek === mat.indice && prop.requirement.id === req.idRequirement) {
                req.note = prop.note;
          }
        });
      }));
      this.load = false;
    }
  }

  public getCurrentWeekNote(id: number, indice: number): number {
    const requeriments = this.matriz.find(ar => ar.indice === indice);
    const evaluation = requeriments.arrayRequiremen.find(ar => ar.idRequirement === id);
    return evaluation.note;
  }

  private filterWeek(requeriment: AvaliationRequirementAvaliationFormInterfaceWeekly): boolean {
      if (requeriment.evaluationTypeId === 0 &&  requeriment.idWeek === (this.saturday.length - 1)) {
        return true;
      } else if (requeriment.evaluationTypeId === 3) {
        return true;
      }
      return false;
  }

  public getAvaliationsRequirementWeekly(): AvaliationRequirementAvaliationFormInterfaceWeekly[] {
    const matrizWeek: any[] = [];
    this.matriz.forEach(data => {
      matrizWeek.push(
      data.arrayRequiremen.map( req => {
        return {
          idWeek:  data.indice,
          idRequirement: req.idRequirement,
          note: req.note,
          evaluationTypeId: req.evaluationTypeId
        } as AvaliationRequirementAvaliationFormInterfaceWeekly;
      }));
    });
    return this.filterMatriz(matrizWeek);
  }

  private filterMatriz(matrizWeek) {
    const matrizWeek2: any[] = [];
    matrizWeek.forEach( data => {
      matrizWeek2.push(data.filter(element => this.filterWeek(element)));
    });
    matrizWeek2.forEach( data => {
      data.forEach(element => {
        element.idWeek = element.evaluationTypeId === 3 ? (element.idWeek + 1) : 0;
      });
    });
    return matrizWeek2;
  }
  public getAvaliationsRequirementMonthly(): AvaliationRequirementAvaliationFormInterface[] {
    return this.avaliationsRequirements.filter(req => req.evaluationTypeId === 0);
  }
  public getAvaliationsRequirementYearly(): AvaliationRequirementAvaliationFormInterface[] {
    return this.avaliationsRequirements.filter(req => req.evaluationTypeId === 1);
  }
}

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
import { ChurchAvaliationFormInterface } from "../../../../interfaces/avaliation/church-avaliation-form-interface";


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


  year: number;


  requirementsAvaliation: RequirementAvaliationChurchInterface[];
  avaliationsRequirements: AvaliationRequirementAvaliationFormInterface[];

  constructor(
    private requirementService: RequirementsService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.sub1 = this.route.params
      .pipe(
        skipWhile(({ year }) => !year),
        tap(({ year }) => this.year = year),
        switchMap(({ year }) => this.loadRequirements(year)),
        tap(() => this.editRequirement())
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
        .push(this.createAvaliationRequirement(ra.score, ra.id));
    });
  }

  private checkIsEdit(): boolean {
    return this.avaliation !== undefined && this.avaliation !== null;
  }

  public sumTotalOfRequirements(): number {
    return this.avaliationsRequirements ? this.avaliationsRequirements.reduce((prev, r) => prev + r.note, 0) : 0;
  }

  private updateCheck(id: number, valueNow: number, valueMax: number): number {
    const evaluation = this.avaliationsRequirements.find(ar => ar.idRequirement === id);
    if (!isNaN(parseInt((valueNow + ''), 10))) {
      this.noteIsFull(id, parseInt((valueNow + ''), 10), evaluation.note, valueMax);
      return evaluation.note = parseInt((valueNow + ''), 10);
    }
    return valueNow;
  }

  private noteIsFull(id, valueNow: number, valuelast: number, valueMax: number) {
    if (valueNow === valueMax) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = false; } });
    } else if (valueNow > valuelast) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = false; } });
    } else if (valueNow < valueMax && valueNow <= valuelast) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = true; } });
    }
    this.calcsaturday();
  }

  private calcsaturday() {
    const d = new Date();
    const getTot = this.daysInMonth(d.getMonth(), d.getFullYear());
    const sat = new Array();
    for (const i = 1; i <= getTot; i++) {
      const newDate = new Date(d.getFullYear(), d.getMonth(), i);
      if (newDate.getDay() === 6) {
        sat.push(i);
      }
    }
    console.log(sat);
  }

  private daysInMonth(month: number, year: number) {
    return new Date(year, month, 0).getDate();
  }

  private createAvaliationRequirement(note: number, idRequirement: number): AvaliationRequirementAvaliationFormInterface {
    return {
      idRequirement: idRequirement,
      note: note
    };
  }

  private getCurrentNote(id: number): number {
    const evaluation = this.avaliationsRequirements.find(ar => ar.idRequirement === id);
    return evaluation.note;
  }

  public getAvaliationsRequirement(): AvaliationRequirementAvaliationFormInterface[] {
    return this.avaliationsRequirements;
  }
}

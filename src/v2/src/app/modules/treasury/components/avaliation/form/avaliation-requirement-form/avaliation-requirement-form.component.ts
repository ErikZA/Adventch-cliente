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
import {ChurchAvaliationFormInterface} from "../../../../interfaces/avaliation/church-avaliation-form-interface";


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
  ) {  }

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
        .getRequirementsByUnitMonthly(id, year);
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

  private updateCheck(checked: boolean, id: number, valueMax: number, valueMin: number, valueNow: number):number {
    let midlle = valueMax;
    const evaluation = this.avaliationsRequirements.find(ar => ar.idRequirement === id);
       if (checked) {
        if (!isNaN(parseInt( ((valueMax / 2) + ''), 10))) {
          midlle = parseInt( ((valueMax / 2) + ''), 10);
        }
       evaluation.note =  this.adjustsSlider(valueMax, valueMin, valueNow, midlle, evaluation.note);
       this.noteIsFull(id, evaluation.note, valueMax, midlle);
       return evaluation.note;
      }
      return evaluation.note;
  }


  private adjustsSlider(valueMax: number, valueMin: number, valueNow: number, midlle: number, note: number): number {
     if  ((valueNow < valueMax && valueNow > midlle) && note > valueNow) {
      return   midlle;
    } else if ( (valueNow < valueMax && valueNow < midlle) &&  note < valueNow )  {
      return   midlle;
    } else if ( (valueNow < valueMax && valueNow > midlle) &&  note < valueNow ) {
      return   valueMax;
    } else if ( (valueNow < valueMax && valueNow > valueMin) &&  note > valueNow ) {
      return   valueMin;
    } else if ( note < midlle) {
      return  midlle;
    }
  }

  private createAvaliationRequirement(note: number, idRequirement: number): AvaliationRequirementAvaliationFormInterface {
    return {
      idRequirement: idRequirement,
      note: note
    };
  }

  private noteIsFull(id, valueNow: number, valueMax: number, midlle: number) {
   if (valueNow === valueMax) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = false; }} );
    } else if (valueNow < midlle) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = true; }} );
    } else   if (valueNow < valueMax) {
      this.requirementsAvaliation.forEach(ra => { if (ra.id === id) { ra.isFull = true; }} );
    }
  }

  private getCurrentNote(id: number):number {
    let evaluation = this.avaliationsRequirements.find(ar => ar.idRequirement === id);
    return evaluation.note;
  }

public getAvaliationsRequirement(): AvaliationRequirementAvaliationFormInterface[] {
  return this.avaliationsRequirements;
}
}

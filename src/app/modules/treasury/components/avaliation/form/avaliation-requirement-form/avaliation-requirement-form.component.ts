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
    return this.type === EFeatures.AVALIARANUALMENTE ? this.requirementService
      .getRequirementsByUnitYearly(id, year) : this.requirementService
        .getRequirementsByUnitMonthly(id, year);
  }

  private setRequirementsInForm(data: RequirementAvaliationChurchInterface[]): void {
    this.requirementsAvaliation = data;
    this.avaliationsRequirements = [];
    this.requirementsAvaliation.forEach(ra => {
      this.avaliationsRequirements
        .push(this.createAvaliationRequirement(ra.score, ra.id));
    });
  }

  private checkIsEdit(): boolean {
    return this.avaliation !== undefined && this.avaliation !== null;
  }

  private checkIfChecked(requirementId: number): boolean {
    if (this.checkIsEdit()) {
      const requirementAvaliationEdit = this.avaliation
        .avaliationsRequirements
        .find(ar => ar.requirement.id === requirementId);
      return requirementAvaliationEdit ? requirementAvaliationEdit.note === requirementAvaliationEdit.requirement.score : false;
    } else {
      return true;
    }
  }

  public sumTotalOfRequirements(): number {
    return this.avaliationsRequirements ? this.avaliationsRequirements.reduce((prev, r) => prev + r.note, 0) : 0;
  }

  private updateCheck(checked: boolean, id: number) {
    const evaluation = this.avaliationsRequirements
      .find(ar => ar.idRequirement === id);
    if (checked) {
      const { score } = this.requirementsAvaliation
      .find(ra => ra.id === id);
      evaluation.note = score;
    } else {
      evaluation.note = 0;
    }
  }

  private createAvaliationRequirement(note: number, idRequirement: number): AvaliationRequirementAvaliationFormInterface {
    return {
      idRequirement: idRequirement,
      note: note
    };
  }

  public getAvaliationsRequirement(): AvaliationRequirementAvaliationFormInterface[] {
    return this.avaliationsRequirements;
  }

}

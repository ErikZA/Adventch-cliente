import { Component, OnInit, Inject } from '@angular/core';
import {FlatTreeControl} from '@angular/cdk/tree';
import { MAT_DIALOG_DATA, MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { skipWhile, tap, switchMap, debounceTime } from 'rxjs/operators';
import { AvaliationService } from '../avaliation.service';
import { Months, EMonth } from '../../../../../shared/models/EMonth.enum';

import {AvaliationRequirementsInterface} from '../../../interfaces/avaliation/avaliation-requirements-interface';
import { EAvaliationStatus } from '../../../models/enums';
import { EWeeks, Weeks } from '../../../../../shared/models/weeks.enum';
import { ChurchFilter } from '../../../interfaces/avaliation/evaluarion-church-filter-interface';
import { EvaluationSumFormInterface } from '../../../interfaces/avaliation/evaluation-sum-avaliation-form-interface';

@Component({
  selector: 'app-avaliation-data-dialog',
  templateUrl: './avaliation-data-dialog.component.html',
  styleUrls: ['./avaliation-data-dialog.component.scss']
})

export class AvaliationDataDialogComponent implements OnInit {

  evaliationAndRequirementsForm: AvaliationRequirementsInterface[] = [];
  elementRequirementsSum: EvaluationSumFormInterface[] = [];

  constructor(
    private avaliationService: AvaliationService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: ChurchFilter) {}

  ngOnInit() {
     this.route.data
       .pipe(
         tap(() => this.getEvaliationAndRequirementsSumYear(this.data.churchId, this.data.year)),
         debounceTime(600)
       ).subscribe();
  }

  public getMonth(month: EMonth): void {
    const monthNow = new Months(month).getMonthNumber();
    monthNow !== 13 ? this.getEvaliationAndRequirements(this.data.churchId,  monthNow, this.data.year)
    : this.getEvaliationAndRequirementsSumYear(this.data.churchId, this.data.year);
  }

  private getEvaliationAndRequirements(id: number, month: number, year: number): void {
    this.elementRequirementsSum = [];
    this.avaliationService
      .getEvaliationAndRequirementsForm(id, month, year)
      .pipe(
        skipWhile(evaluation => !evaluation),
        tap(evaluation => this.evaliationAndRequirementsForm = evaluation),
        tap(() => this.orderRequirements()),
        debounceTime(600)
      ).subscribe();
  }


  private getEvaliationAndRequirementsSumYear(id: number, year: number): void {
    this.evaliationAndRequirementsForm = [];
    this.avaliationService
      .getEvaliationAndRequirementsSumYearForm(id, year)
      .pipe(
        skipWhile(evaluation => !evaluation),
        tap(evaluation => this.sumRequirementsYear(evaluation)),
        tap(() => this.orderSumRequirements()),
        debounceTime(600)
      ).subscribe();
  }

  private sumRequirementsYear(evaluations: AvaliationRequirementsInterface[]): void {
    if (evaluations !== undefined && evaluations !== null) {
     const dataElement: EvaluationSumFormInterface[] = [];
     evaluations.forEach( eva => {
      eva.avaliationsRequirements.map(value => {
        dataElement.push( {
         requirementId: value.requirement.id,
         evaluationTypeId: value.requirement.evaluationTypeId,
         note: value.note,
         requirementScore: value.requirement.score,
         requirementName: value.requirement.name,
         status: eva.status
         });
       });
      });
    this.filterRequirement(dataElement);
    }
  }

  private filterRequirement(dataElement: EvaluationSumFormInterface[]): void   {
    dataElement.forEach( value => {
      if (this.elementRequirementsSum.length === 0) {
        this.elementRequirementsSum.push(value);
      } else {
        if (undefined === this.elementRequirementsSum.find(element => element.requirementId === value.requirementId )) {
          this.elementRequirementsSum.push(value);
        }
      }
    });
    this.elementRequirementsSum.forEach( value => {
      value.note = dataElement.filter( element => value.requirementId === element.requirementId)
      .reduce((a, b) => a + b.note, 0);
      value.requirementScore = dataElement.filter( element => value.requirementId === element.requirementId)
      .reduce((a, b) => a + b.requirementScore, 0);
    });
  }

  public getRequirementSun() {
    if (this.elementRequirementsSum !== null && this.elementRequirementsSum.length === 0){
      return this.elementRequirementsSum;
    } else {
      return [];
    }
  }

  public isAvaliation(): boolean {
    if (this.evaliationAndRequirementsForm !== null && this.evaliationAndRequirementsForm.length === 0) {
      if (this.elementRequirementsSum !== null && this.elementRequirementsSum.length === 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private orderRequirements(): void {
    this.evaliationAndRequirementsForm.sort(function(a, b) {return a.status - b.status; });
    this.evaliationAndRequirementsForm.forEach( eva => {
      eva.avaliationsRequirements.sort(function(a, b) {return a.idWeek - b.idWeek; });
    });
  }

  public sumMaxScore(): number {
    if (this.elementRequirementsSum !== null && this.elementRequirementsSum.length === 0) {
      return 0;
    } else {
      return this.elementRequirementsSum.reduce((a, b) => a + b.requirementScore, 0 );
    }
  }

  public calcPercent(valueMax: number, valueNow: number ): string {
    return ((valueNow/valueMax) * 100).toFixed(2);
  }

  public sumMaxNote(): number {
    if (this.elementRequirementsSum !== null && this.elementRequirementsSum.length === 0) {
      return 0;
    } else {
      return this.elementRequirementsSum.reduce((a, b) => a + b.note, 0 );
    }
  }

  private orderSumRequirements(): void {
    this.elementRequirementsSum.sort(function(a, b) {
      if(a.evaluationTypeId === 3) {
        return -1
      }
      if(a.evaluationTypeId === 1) {
        return 1
      }
      if(a.evaluationTypeId === 0) {
        return -1
      }
      return 0; });
  }

  public setEnumWeek(value: EWeeks): string {
    return new Weeks(value).getWeekName();
  }

  public getTypeRequeriment(value: number): string {
    const typesNames = ['Mensal', 'Anual','','Semanal'
  ];
    return typesNames[value];
  }

  public getClassNameStatusColor(status: number = 1): string {
    switch (status) {
      case EAvaliationStatus.Waiting:
        return 'color-waiting';
      case EAvaliationStatus.Valued:
        return 'color-assessing';
      case EAvaliationStatus.Finished:
        return 'color-finalized';
      default:
        return 'color-waiting';
    }
  }

  public getLabelStatusName(status: number = 1): string {
    switch (status) {
      case EAvaliationStatus.Waiting:
        return 'Aguardando';
      case EAvaliationStatus.Valued:
        return 'Avaliando';
      case EAvaliationStatus.Finished:
        return 'Finalizado';
      default:
        return 'Aguardando';
    }
  }

}

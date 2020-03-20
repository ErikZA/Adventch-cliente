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

@Component({
  selector: 'app-avaliation-data-dialog',
  templateUrl: './avaliation-data-dialog.component.html',
  styleUrls: ['./avaliation-data-dialog.component.scss']
})

export class AvaliationDataDialogComponent implements OnInit {

  evaliationAndRequirementsForm: AvaliationRequirementsInterface[] = [];

  constructor(
    private avaliationService: AvaliationService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: number) {}

  ngOnInit() {
     this.route.data
       .pipe(
         tap(() => this.getEvaliationAndRequirements(this.data, 1, 2020)),
         debounceTime(500)
       ).subscribe();
  }

  public getMonth(month: EMonth): void {
    this.getEvaliationAndRequirements(this.data, new Months(month).getMonthNumber() , new Date().getFullYear());
  }

  private getEvaliationAndRequirements(id: number, month: number, year: number): void {
    this.avaliationService
      .getEvaliationAndRequirementsForm(id, month, year)
      .pipe(
        skipWhile(evaluation => !evaluation),
        tap(evaluation => this.evaliationAndRequirementsForm = evaluation),
        debounceTime(500)
      ).subscribe();
  }

  public isAvaliation(): boolean {
    if (this.evaliationAndRequirementsForm !== null && this.evaliationAndRequirementsForm.length === 0) {
      return true;
    } else {
      this.evaliationAndRequirementsForm.forEach( eva => {
        eva.avaliationsRequirements.sort(function(a, b) {return a.idWeek - b.idWeek; });
      });
      return false;
    }
  }

  public setEnumWeek(value: EWeeks): string {
    return new Weeks(value).getWeekName();
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

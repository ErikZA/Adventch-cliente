import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable ,  Subscription } from 'rxjs';

import { AuthService } from '../../../../shared/auth.service';
import { ScholarshipService } from '../../scholarship.service';

import { School } from '../../models/school';
import { Process } from '../../models/process';
import { auth } from '../../../../auth/auth';
import { ProcessCountStatusInterface } from '../../interfaces/process-count-status-interface';
import { takeWhile, distinctUntilChanged } from 'rxjs/operators';

import { Filter } from '../../../../core/components/filter/Filter.model';


@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {
  idSchool = -1;
  // idSchoolYear = -1;
  schoolYear: number[] = [];
  schools$: Observable<School[]>;
  processes$: Observable<Process[]>;
  processesCountStatus: ProcessCountStatusInterface;
  loading = true;

  schoolYearSelected: number[] = [];
  schoolYearData: Filter[] = [];
  schoolYearDefault: number[] = [];

  idUnit = 0;

  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadSchoolYear();
    this.setSchoolInitial();
    this.getAllDatas();
  }

  private getAllDatas(): void {
    this.schools$ = this.scholarshipService.getSchools();
    this.getCountProcesses();
  }

  private loadSchoolYear(): void {
    for (let i = 2019; i <= new Date().getFullYear() + 1; i++)  {
      this.schoolYearData.push(new Filter(i, i.toString()));
    }
  }

  private getCountProcesses(): void {
    this.loading = true;
    this.processesCountStatus = null;
    const unit = auth.getCurrentUnit();
    this.scholarshipService
      .getProcessCountStatus(unit.id)
      .pipe(
        takeWhile(p => p !== null && p !== undefined),
        distinctUntilChanged()
      ).subscribe(counts => {
        if (counts) {
          this.processesCountStatus = counts;
          this.loading = false;
        }
      });
  }

  private setSchoolInitial(): void {
    if (auth.getCurrentUser().idSchool === 0) {
      this.idSchool = this.scholarshipService.schoolSelected;
    } else {
      this.idSchool = auth.getCurrentUser().idSchool;
      this.scholarshipService.schoolSelected = this.idSchool;
    }
    if (this.scholarshipService.schoolYearSelected && this.scholarshipService.schoolYearSelected.length > 0) {
      this.schoolYear = this.scholarshipService.schoolYearSelected;
    }
  }

  public changeDashboard(): void {
    this.scholarshipService.updateSchool(this.idSchool);
    console.log(this.scholarshipService.schoolSelected);
    this.getCountProcesses();
  }

  public schoolYearFilter() {
    this.scholarshipService.updateSchoolYearSelected(this.schoolYear);
    this.changeDashboard();
  }

  public redirectToProcess(idStatus) {
    this.scholarshipService.updateStatus(idStatus);
    this.router.navigate(['/bolsas/processos']);
  }
}

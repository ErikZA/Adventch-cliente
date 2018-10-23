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

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {
  idSchool = -1;
  schools$: Observable<School[]>;
  processes$: Observable<Process[]>;
  processesCountStatus: ProcessCountStatusInterface;
  loading = true;

  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.setSchoolInitial();
    this.getAllDatas();
  }

  private getAllDatas(): void {
    this.schools$ = this.scholarshipService.getSchools();
    this.getCountProcesses();
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
  }

  public changeDashboard(): void {
    this.scholarshipService.updateSchool(this.idSchool);
    console.log(this.scholarshipService.schoolSelected);
    this.getCountProcesses();
  }

  public redirectToProcess(idStatus) {
    this.scholarshipService.updateStatus(idStatus);
    this.router.navigate(['/bolsas/processos']);
  }
}

import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { MatSidenav } from '@angular/material';

import { AuthService } from '../../../../shared/auth.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { ScholarshipService } from '../../scholarship.service';

import { School } from '../../models/school';
import { Process } from '../../models/process';
import { auth } from '../../../../auth/auth';
import { ProcessCountStatusInterface } from '../../interfaces/process-count-status-interface';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit, OnDestroy {

  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  idSchool = -1;
  schools$: Observable<School[]>;
  processes$: Observable<Process[]>;
  processesCountStatus: ProcessCountStatusInterface;
  loading = true;

  subscribeProcessesCount: Subscription;
  subscribeUnit: Subscription;

  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private location: Location
  ) { }

  ngOnInit() {
    this.getAllDatas();
    this.setSchoolInitial();
    this.sidenavService.setSidenav(this.sidenavRight);
  }

  ngOnDestroy() {
    if (this.subscribeUnit) { this.subscribeUnit.unsubscribe(); }
    if (this.subscribeProcessesCount) { this.subscribeProcessesCount.unsubscribe(); }
  }

  private getAllDatas(): void {
    this.schools$ = this.scholarshipService.getSchools();
    if (!this.authService.getCurrentUser().idSchool) {
      this.getCountProcesses();
    }
  }

  private getCountProcesses(): void {
    this.loading = true;
    const unit = auth.getCurrentUnit();
    this.subscribeProcessesCount = this.scholarshipService.getProcessCountStatus(unit.id).subscribe(counts => {
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
    this.changeDashboard();
  }

  public closeSidenav(): void {
    this.location.back();
    this.sidenavRight.close();
  }

  public changeDashboard(): void {
    this.scholarshipService.schoolSelected = this.idSchool;
    this.getCountProcesses();
  }

  public redirectToProcess(idStatus) {
    this.scholarshipService.updateStatus(idStatus);
    this.router.navigate(['/bolsas/processos']);
  }

  public compareIds(id1: any, id2: any): boolean {
    const a1 = id1;
    const a2 = id2;
    return a1 === a2;
  }
}

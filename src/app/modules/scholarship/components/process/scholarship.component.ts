import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { MatSidenav } from '@angular/material';

import { AuthService } from '../../../../shared/auth.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { ScholarshipService } from '../../scholarship.service';

import { School } from '../../models/school';
import { Process } from '../../models/process';
import { ProcessesStore } from './processes.store';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {

  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  idSchool = -1;
  schools$: Observable<School[]>;
  processes$: Observable<Process[]>;


  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private store: ProcessesStore,
    private location: Location
  ) { }

  ngOnInit() {
    this.getAllDatas();
    this.setSchoolInitial();
    this.sidenavService.setSidenav(this.sidenavRight);
    this.scholarshipService.refresh$.subscribe((refresh: boolean) => {
      this.getAllDatas();
    });
  }

  private getAllDatas(): void {
    this.processes$ = this.store.processes$;
    this.schools$ = this.store.schools$;
    this.store.loadAll();
  }

  private setSchoolInitial(): void {
    if (this.authService.getCurrentUser().idSchool === 0) {
      this.idSchool = this.scholarshipService.schoolSelected;
    } else {
      this.idSchool = this.authService.getCurrentUser().idSchool;
      this.scholarshipService.schoolSelected = this.idSchool;
    }
    this.changeDashboard();
  }

  public getTotalByStatus(idStatus): Observable<Process[]> {
    return this.processes$.pipe(
      map((todos: Process[]) =>
          todos != null ? todos.filter(p => p.status === idStatus) : []      
    ));
  }

  public closeSidenav(): void {
    this.location.back();
    this.sidenavRight.close();
  }

  public changeSchool(): void {
    this.scholarshipService.schoolSelected = this.idSchool;
  }

  public changeDashboard(): void {
    this.processes$ = this.store.filterProcessesSchool(this.idSchool);
    this.changeSchool();
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

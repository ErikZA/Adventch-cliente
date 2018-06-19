import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

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
  columns: any = 3;
  schools$: Observable<School[]>;
  schools: School[] = new Array<School>();
  idSchool = -1;
  processes: Process[] = new Array<Process>();
  processes$: Observable<Process[]>;


  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService,
    private store: ProcessesStore
  ) {
    if (window.screen.width < 600) {
      this.columns = 1;
    }
  }

  ngOnInit() {
    this.getAllDatas();
    this.setSchool();
    this.getSchools();
    this.sidenavService.setSidenav(this.sidenavRight);
    this.getData();
    this.scholarshipService.refresh$.subscribe((refresh: boolean) => {
      this.getData();
    });
  }

  private getAllDatas(): void {
    this.processes$ = this.store.processes$;
    this.schools$ = this.store.schools$;
    this.store.loadAll();
  }

  closeSidenav() {
    this.scholarshipService.processEdit = new Process();
    this.sidenavRight.close();
    this.getData();
    this.router.navigate([this.router.url.replace('/novo', '').replace('/editar', '')]);
  }

  getData() {
    this.changeSchool();
    this.processes = [];
    this.store.loadAll();
    this.scholarshipService.getProcesses(this.idSchool).subscribe((data: Process[]) => {
      this.processes = Object.assign(this.processes, data as Process[]);
      this.processes$ = this.processes$ = this.store.processes$;
    });
  }

  setSchool() {
    if (this.authService.getCurrentUser().idSchool === 0) {
      this.idSchool = this.scholarshipService.schoolSelected;
    } else {
      this.idSchool = this.authService.getCurrentUser().idSchool;
      this.scholarshipService.schoolSelected = this.idSchool;
    }
  }

  changeSchool() {
    this.scholarshipService.schoolSelected = this.idSchool;
  }

  changeDashboard() {
    this.getData();
  }

  redirectToProcess(idStatus) {
    this.scholarshipService.updateStatus(idStatus);
    this.router.navigate(['/bolsas/processos']);
  }

  getTotalByStatus(idStatus) {
    if (this.processes.length === 0) {
      return 0;
    }
    const filteredItens = this.processes.filter(f => f.status === idStatus);
    return filteredItens.length;
  }

  getPercentByStatus(idStatus) {
    if (this.processes.length === 0) {
      return 0;
    }
    const filteredItens = this.processes.filter(f => f.status === idStatus);
    return (filteredItens.length / this.processes.length * 100);
  }

  onResize(event) {
    const element = event.target.innerWidth;
    if (element > 600) {
      this.columns = 3;
    } else {
      this.columns = 1;
    }
  }

  getSchools() {
    this.schools = [];
    this.scholarshipService.getSchools().subscribe((data: School[]) => {
      const idSchool = this.authService.getCurrentUser().idSchool;
      if (idSchool === 0) {
        this.schools = Object.assign(this.schools, data as School[]);
        this.schools$ = Observable.of(this.schools);
        // this.scholarshipService.updateSchool('-1');
      } else {
        const lst = Object.assign(this.schools, data as School[]);
        this.schools = [];
        this.schools.push(lst.find(f => f.id === idSchool));
        this.schools$ = Observable.of(this.schools);
        this.scholarshipService.updateSchool(idSchool.toString());
      }
    });
  }
  compareIds(id1: any, id2: any): boolean {
    const a1 = id1;
    const a2 = id2;
    return a1 === a2;
  }
}

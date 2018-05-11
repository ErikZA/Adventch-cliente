import { Component, OnInit, ViewChild } from '@angular/core';
import { equalSegments } from '@angular/router/src/url_tree';
import { ScholarshipService } from '../scholarship.service';
import { School } from '../models/school';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { MatSidenav } from '@angular/material';
import { Router } from '@angular/router';
import { SidenavService } from '../../core/services/sidenav.service';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {

  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  columns: any = 5;
  schools$: Observable<School[]>;
  schools: School[] = new Array<School>();
  formDashboard: FormGroup;
  school = '-1';


  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
    private router: Router,
    private sidenavService: SidenavService
  ) { }

  ngOnInit() {
    this.formDashboard = new FormGroup({
      school: new FormControl()
    });
    this.getSchools();
    this.sidenavService.setSidenav(this.sidenavRight);
  }

  closeSidenav() {
    this.sidenavRight.close();
    this.router.navigate(['bolsas/processos']);
  }

  onResize(event) {
    const element = event.target.innerWidth;
    if(element > 750)
      this.columns = 5
    else
      this.columns = 1
  }

  getSchools(){
    this.schools = [];
    this.scholarshipService.getSchools().subscribe((data: School[]) =>{
      var idSchool = this.authService.getCurrentUser().idSchool;
      if(idSchool == 0){
        this.schools = Object.assign(this.schools, data as School[]);
        this.schools$ = Observable.of(this.schools);
        this.school = '-1';
      }else{
        var lst = Object.assign(this.schools, data as School[]);
        this.schools = [];
        this.schools.push(lst.find(f => f.id == idSchool));
        this.schools$ = Observable.of(this.schools);
        this.school = idSchool.toString();
      }
    });
  }

}

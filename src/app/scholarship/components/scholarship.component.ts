import { Component, OnInit } from '@angular/core';
import { equalSegments } from '@angular/router/src/url_tree';
import { ScholarshipService } from '../scholarship.service';
import { School } from '../models/school';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {

  columns: any = 5;
  schools$: Observable<School[]>;
  schools: School[] = new Array<School>();
  formDashboard: FormGroup;

  
  constructor(
    public scholarshipService: ScholarshipService,
    public authService: AuthService,
  ) { }

  ngOnInit() {
    this.formDashboard = new FormGroup({
      school: new FormControl()
   });
    this.getSchools();
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
        this.scholarshipService.schoolSelected = '-1';
      }else{
        var lst = Object.assign(this.schools, data as School[]);
        this.schools = [];
        this.schools.push(lst.find(f => f.id == idSchool));
        this.schools$ = Observable.of(this.schools);
        this.scholarshipService.schoolSelected = idSchool.toString();
      }
    });
  }
}

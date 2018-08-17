
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { RequirementStore } from '../requirements.store';

@Component({
  selector: 'app-requirements-form',
  templateUrl: './requirements-form.component.html',
  styleUrls: ['./requirements-form.component.scss']
})
export class RequirementFormComponent implements OnInit, OnDestroy {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  constructor(
    public store: RequirementStore,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

  }
  ngOnDestroy() {

  }
}

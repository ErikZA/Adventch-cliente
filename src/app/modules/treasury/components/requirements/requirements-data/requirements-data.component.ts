import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { RequirementStore } from '../requirements.store';

@Component({
  selector: 'app-requirements-data',
  templateUrl: './requirements-data.component.html',
  styleUrls: ['./requirements-data.component.scss']
})
export class RequirementDataComponent implements OnInit, OnDestroy {
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
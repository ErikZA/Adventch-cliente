import { Component, OnInit } from '@angular/core';
import { equalSegments } from '@angular/router/src/url_tree';

@Component({
  selector: 'app-scholarship',
  templateUrl: './scholarship.component.html',
  styleUrls: ['./scholarship.component.scss']
})
export class ScholarshipComponent implements OnInit {

  columns: any = 5;

  constructor() { }

  ngOnInit() {
  }

  onResize(event) {
    const element = event.target.innerWidth;
    if(element > 750)
      this.columns = 5
    else
      this.columns = 1
  }

}

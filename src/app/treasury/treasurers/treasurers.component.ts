import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { State } from '../../core/components/progress-spinner/models/state';
import { Table } from '../../core/components/data-table/models/table';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-treasurer',
  templateUrl: './treasurers.component.html',
  styleUrls: ['./treasurers.component.scss']
})
export class TreasurersComponent implements OnInit {

  form: FormGroup;
  table: Table = {
    data: [],
    columns: [{
      header: 'Name',
      label: 'Nome'
    }]
  };
  state: State = {
    isLoadingResults: false,
    isRateLimitReached: false,
    // messageRateLimitReached: "GitHub's API rate limit has been reached. It will be reset in one minute."
  };
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      search: [null, null],
    });
  }

  getData(){
    //return this.http
    //  .get('values/getTreasurers')
      //.map((res: String) => {
      //  const data = res.json() as String;

      //  data.forEach((o: TreasurerModel) => {
      //    o.items.forEach(i => i.parentObj = o);
      //  });

       // return data;
      //})
    //  .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

}

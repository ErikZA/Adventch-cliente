import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { loaded } from 'src/app/actions/loading.action';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  constructor(
    private store: Store<any>,
  ) {
    store.dispatch(loaded(true));
  }

  ngOnInit() {
  }

}

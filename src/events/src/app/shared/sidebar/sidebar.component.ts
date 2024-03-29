import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public sidebar$: Observable<any>;
  public auth$: Observable<any>;

  public open = true;
  public isLogin: boolean;

  public mode = new FormControl('over');
  public shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  constructor(
    private store: Store<any>,
  ) {
    this.sidebar$ = store.select('sidebar')
    this.auth$ = store.select('auth')
  }

  ngOnInit() {
    this.sidebar$.subscribe((res: any) => {
      this.open = res.open
    });

    this.auth$.subscribe(res => this.isLogin = res)

  }


}

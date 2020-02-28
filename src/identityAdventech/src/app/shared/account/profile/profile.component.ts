import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user$: Observable<any>;
  public user;

  constructor(
    private store: Store<any>,
    private auth: AuthService
  ) {
    this.user$ = store.select('user')
  }

  ngOnInit() {
    this.user$.subscribe(res => this.user = res);
  }

  logout() {
    this.auth.logout();
  }

}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

// import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { User } from './shared/models/user.model';
import { AuthService } from './shared/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  subscribe1: Subscription;
  subscribe2: Subscription;
  currentUser: User;
  showApp: boolean = false;

  title: string = 'Belagricola';

  constructor(
    private authService: AuthService,
    private router: Router,
    // private translate: TranslateService
  ) {
    // this.translate.addLangs(['en', 'es', 'pt']);
    // translate.setDefaultLang('pt');
    // let browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt');
  }

  ngOnInit() {
    this.subscribe1 = this.authService.currentUser.subscribe(currentUser => this.currentUser = currentUser, err => { console.log(err); });
    this.subscribe2 = this.authService.showApp.subscribe(showApp => this.showApp = showApp, err => { console.log(err); });
    if (!this.showApp)
      this.authService.loggedIn();
  }

  ngOnDestroy() {
    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();
  }

  logoff() {
    this.authService.logoff();
  }

}

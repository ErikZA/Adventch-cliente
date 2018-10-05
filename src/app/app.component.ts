import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

// import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { auth } from './auth/auth';
import { User } from './shared/models/user.model';
import { AuthService } from './shared/auth.service';
import { MatIconRegistry } from '@angular/material';
import { Responsible } from './modules/scholarship/models/responsible';
import * as Raven from 'raven-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

  subscribe1: Subscription;
  subscribe2: Subscription;
  subscribe3: Subscription;
  currentUser: User;
  currentResponsible: Responsible;
  showApp = false;

  title = 'Adven.tech';

  constructor(
    private authService: AuthService,
    private router: Router,
    private matIconRegistry: MatIconRegistry
    // private translate: TranslateService
  ) {
    matIconRegistry.registerFontClassAlias('fa');
    // this.translate.addLangs(['en', 'es', 'pt']);
    // translate.setDefaultLang('pt');
    // let browserLang = translate.getBrowserLang();
    // translate.use(browserLang.match(/en|es|pt/) ? browserLang : 'pt');
  }

  ngOnInit() {
    this.subscribe1 = auth.currentUser.subscribe(currentUser => {
      this.currentUser = currentUser;
      Raven.setUserContext(currentUser);
    }, err => { console.log(err); });
    this.subscribe2 = auth.showApp.subscribe(showApp => this.showApp = showApp, err => { console.log(err); });
    this.subscribe3 = auth.currentResponsible
      .subscribe(currentResponsible => {
        this.currentResponsible = currentResponsible;
        Raven.setUserContext(currentResponsible);
      }, err => console.log(err));
    if (!this.showApp && this.currentUser) {
      auth.loggedInMain();
      if (!this.showApp) {
        this.router.navigate(['/login']);
        auth.logoffMain();
      }
    } else if (!this.showApp && this.currentResponsible) {
      auth.loggedInResponsible();
      if (!this.showApp) {
        this.router.navigate(['/educacao']);
        auth.logoffResponsible();
      }
    }
  }

  ngOnDestroy() {
    this.subscribe1.unsubscribe();
    this.subscribe2.unsubscribe();
  }

  logoff() {
    this.router.navigate(['/login']);
    auth.logoffMain();
    auth.logoffResponsible();
  }

  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event) {
  //   localStorage.clear();
  // }

}

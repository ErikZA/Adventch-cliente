import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { SharedService } from '../../../shared.service';
import { Release } from '../../../models/release.model';
import { ReleaseNotesStore } from '../../release-notes.store';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { AuthService } from '../../../auth.service';

import * as moment from 'moment';
import { auth } from '../../../../auth/auth';

@Component({
  selector: 'app-release-notes-data',
  templateUrl: './release-notes-data.component.html',
  styleUrls: ['./release-notes-data.component.scss']
})
export class ReleaseNotesDataComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;
  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  releases: Release[] = new Array<Release>();
  releases$: Observable<Release[]>;
  private _releases: BehaviorSubject<Release[]>;

  constructor(
    private service: SharedService,
    private store: ReleaseNotesStore,
    private sidenavService: SidenavService,
    private authService: AuthService,
    private location: Location,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.navigate([this.router.url.replace(/.*/, 'notas-da-versao')]);
    this.loadAllReleaseNotes();
    this.sidenavService.setSidenav(this.sidenavRight);
    this.search$.subscribe(search => {
      this.search(search);
    });
    moment.locale('pt');
  }


  private search(search: string) {
    this.releases$ = this.store.search(search);
  }

  public closeSidenav() {
    this.location.back();
    this.sidenavRight.close();
  }

  openSidenav() {
    this.sidenavService.open();
  }

  private loadAllReleaseNotes(): void {
    this.releases$ = this.store.releases$;
    this.store.loadAll();
    this.releases$.subscribe(x => { this.releases = x; });
  }

  public getDateFormatted(date): string {
    return moment(date).fromNow();
  }

  public onScroll() {
    this.showList += 15;
  }

  public checkAdd(): boolean {
    return auth.getCurrentUser().email.indexOf('@forlogic.net') > 0;
  }

}

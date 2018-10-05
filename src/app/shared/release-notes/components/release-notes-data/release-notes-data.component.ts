import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Observable ,  Subject ,  BehaviorSubject ,  Subscription } from 'rxjs';

import { SharedService } from '../../../shared.service';
import { Release } from '../../../models/release.model';
import { ReleaseNotesStore } from '../../release-notes.store';
import { SidenavService } from '../../../../core/services/sidenav.service';

import * as moment from 'moment';
import { auth } from '../../../../auth/auth';
import { AbstractSidenavContainer } from '../../../abstract-sidenav-container.component';

@Component({
  selector: 'app-release-notes-data',
  templateUrl: './release-notes-data.component.html',
  styleUrls: ['./release-notes-data.component.scss']
})
export class ReleaseNotesDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = 'notas-daversao';

  searchButton = false;
  showList = 15;
  search$ = new Subject<string>();
  releases: Release[] = new Array<Release>();
  releases$: Observable<Release[]>;
  private _releases: BehaviorSubject<Release[]>;

  private searchText = '';

  private releaseSub: Subscription;

  constructor(
    private service: SharedService,
    private store: ReleaseNotesStore,
    private sidenavService: SidenavService,
    private location: Location,
    public router: Router
  ) { super(router); }

  ngOnInit() {
    this.loadAllReleaseNotes();
    this.search$.subscribe(search => {
      this.search(search);
    });
    moment.locale('pt');
  }

  ngOnDestroy(): void {
    if (this.releaseSub) { this.releaseSub.unsubscribe(); }
  }
  private search(search: string) {
    this.searchText  = search;
    this.releases$ = this.store.search(search);
  }

  private loadAllReleaseNotes(): void {
    this.releases$ = this.store.releases$;
    this.store.loadAll();
    this.releaseSub = this.releases$.subscribe(x => { this.releases = x; });
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

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Observable ,  Subject ,  BehaviorSubject ,  Subscription } from 'rxjs';

import { Release } from '../../../models/release.model';
import { ReleaseNotesStore } from '../../release-notes.store';

import * as moment from 'moment';
import { auth } from '../../../../auth/auth';
import { AbstractSidenavContainer } from '../../../abstract-sidenav-container.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@Component({
  selector: 'app-release-notes-data',
  templateUrl: './release-notes-data.component.html',
  styleUrls: ['./release-notes-data.component.scss']
})
@AutoUnsubscribe()
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
  private subsSearch: Subscription;

  constructor(
    private store: ReleaseNotesStore,
    public router: Router
  ) { super(router); }

  ngOnInit() {
    this.loadAllReleaseNotes();
    this.subsSearch = this.search$.subscribe(search => {
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

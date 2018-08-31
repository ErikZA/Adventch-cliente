import { Injectable } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';
import { MatSnackBar } from '@angular/material';
import { Location } from '@angular/common';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import { map } from 'rxjs/operators';

import * as moment from 'moment';
import { Release } from '../models/release.model';
import { SharedService } from '../shared.service';
import { ReleaseNote } from '../models/releaseNote.model';
import { SidenavService } from '../../core/services/sidenav.service';

@Injectable()
export class ReleaseNotesStore {

  releases$: Observable<Release[]>;
  private _releases: BehaviorSubject<Release[]>;
  private dataStore: {
    releases: Release[]
  };
  public currentVersion = 'v0.0.0';

  constructor(
    private service: SharedService,
    private snackBar: MatSnackBar,
    private location: Location,
    private sidenavService: SidenavService
  ) {
    this.dataStore = {
      releases: []
    };
    this._releases = <BehaviorSubject<Release[]>>new BehaviorSubject([]);
    this.releases$ = this._releases.asObservable();
    moment.locale('pt');
  }

  public loadAll() {
    this.service.getReleaseNotes().subscribe((data: Release[]) => {
      this.dataStore.releases = data;
      this._releases.next(Object.assign({}, this.dataStore).releases);
    });
  }

  public search(search): Observable<Release[]> {
    if (search === '' || search === undefined) {
      return Observable.of(this.dataStore.releases);
    }

    const releasesFiltered = new Array<Release>();
    for (const release of this.dataStore.releases) {
      if (this.searchInProperty(release.version, search)) {
        releasesFiltered.push(release);
        continue;
      }
      for (const note of release.notes) {
        const description = (note.isBug ? '(erro) ' : '(melhoria) ') + note.description; // Formatando para tornar igual a listagem
        if (this.searchInProperty(description, search)) {
          releasesFiltered.push(release);
          break;
        }
      }
    }
    return Observable.of(releasesFiltered);
  }

  private searchInProperty(property: string, search: string): boolean {
    if (property.toLowerCase().indexOf(search.toLowerCase()) !== -1) {
      return true;
    }
    return false;
  }

  public saveReleaseNotes(releaseNotes: any): void {
    this.service.insertReleaseNotes(releaseNotes).subscribe((id: number) => {
      this.location.back();
      this.sidenavService.close();
      releaseNotes.id = id;
      this.setCurrentRelease(releaseNotes);
      this.dataStore.releases.unshift(releaseNotes);
      this._releases.next(Object.assign({}, this.dataStore).releases);
    }, err => {
      console.log(err);
      this.snackBar.open('Erro ao salvar os dados da versão, tente novamente.', 'OK', { duration: 5000 });
    });
  }

  private setCurrentRelease(currentRelease) {
    this.currentVersion = currentRelease.version;
  }

  public getVersion() {
    if (!this.currentVersion || this.currentVersion === 'v0.0.0') {
      return this.service.getCurrentRelease().subscribe((data: Release) => {
        if (data != null || data !== undefined) {
          this.currentVersion = data.version;
        }
      });
    }
  }
}

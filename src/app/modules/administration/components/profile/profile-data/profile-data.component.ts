import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { MatSidenav } from '@angular/material';

import { ProfileStore } from '../profile.store';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { Module } from '../../../../../shared/models/modules.enum';
import { EModules } from '../../../../../shared/models/modules.enum';
import { utils } from '../../../../../shared/utils';
import { Profile } from '../../../models/profile/profile.model';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent implements OnInit {

  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  showList = 15;
  searchButton = false;
  search$ = new Subject<string>();
  layout: String = 'row';
  profiles$: Observable<Profile[]>;

  constructor(
    private store: ProfileStore,
    private confirmDialogService: ConfirmDialogService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.profiles$ = this.store.profiles$;
    this.search$.subscribe(search => {
      this.searchProfile(search);
    });
    this.store.loadAllProfiles();
  }

  public onScroll(): void {
    this.showList += 15;
  }
  public getModuleName(module: EModules): string {
    return new Module(module).getModuleName();
  }

  public searchProfile(search: string) {
    this.profiles$ = this.store.searchProfile(search);
  }

  public openSidenav(): void {
    this.router.navigate(['novo'], { relativeTo: this.route });
  }

  public closeSidenav(): void {
    this.router.navigate(['/administracao/papeis']);
    this.sidenavRight.close();
  }

  public editProfile(role: Profile): void {
    this.router.navigate([role.id, 'editar'], { relativeTo: this.route });
  }

  public removeProfile(role: Profile): void {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este papel?', 'REMOVER')
      .subscribe(res => {
        if (res === true) {
          this.store.removeProfile(role);
        }
      });
  }
}

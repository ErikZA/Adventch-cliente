import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { MatSidenav } from '@angular/material';

import { ProfileStore } from '../profile.store';
import { AuthService } from '../../../../../shared/auth.service';
import { SidenavService } from '../../../../../core/services/sidenav.service';
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
    private sidenavService: SidenavService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.profiles$ = this.store.profiles$;
    this.search$.subscribe(search => {
      this.searchProfile(search);
    });
    this.updateUnit();
    this.sidenavService.setSidenav(this.sidenavRight);
    utils.checkRouteUrl(this.router, '/administracao/papeis', () => this.sidenavRight.close());
  }

  private updateUnit(): void {
    this.store.loadAllProfiles();
    const regex = /papeis(.*)/;
    const url = this.router.url.match(regex);
    if (url && url[0].length !== 0) {
      this.router.navigate([this.router.url.replace(/.*/, 'administracao/papeis')]);
    }
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
    this.sidenavService.open();
  }

  public closeSidenav(): void {
    this.location.back();
    this.sidenavRight.close();
  }

  public editProfile(role: Profile): void {
    this.router.navigate([role.id, 'editar'], { relativeTo: this.route });
    this.sidenavService.open();
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

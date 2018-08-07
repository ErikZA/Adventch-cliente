import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../../../../../shared/auth.service';
import { UserStore } from '../user.store';
import { SidenavService } from '../../../../../core/services/sidenav.service';

import { EModules, Module } from '../../../../../shared/models/modules.enum';
import { User } from '../../../../../shared/models/user.model';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { utils } from '../../../../../shared/utils';
import { auth } from '../../../../../auth/auth';


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit {
  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  search$ = new Subject<string>();
  showList = 15;
  inSearch: boolean;
  modules = new Array<EModules>();
  search = '';

  users$: Observable<User[]>;
  constructor(
    private store: UserStore,
    private sidenavService: SidenavService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location,
    private confirmDialogService: ConfirmDialogService,
  ) { }

  ngOnInit() {
    this.search = '';
    this.search$.subscribe(search => {
      this.search = search;
      this.searchUser(search);
    });
    this.loadAllDatas();
    this.sidenavService.setSidenav(this.sidenavRight);
    auth.currentUnit.subscribe(unit => {
      if (unit) {
        this.updateUnit();
      }
    });

    utils.checkRouteUrl(this.router, '/administracao/usuarios', () => this.sidenavRight.close());
  }

  private loadAllDatas(): void {
    this.users$ = this.store.users$;
    this.store.loadAllUsers();
  }

  private updateUnit(): void {
    this.store.loadAllUsers();
    this.sidenavService.close();
    const regex = /usuarios(.*)/;
    const url = this.router.url.match(regex);
    if (url && url[0].length !== 0) {
      this.router.navigate([this.router.url.replace(/.*/, 'administracao/usuarios')]);
    }
  }

  public closeSidenav(): void {
    this.location.back();
    this.sidenavRight.close();
  }

  public openSidenav() {
    this.sidenavService.open();
  }

  public getModulesUnit(): EModules[] {
    const { modules } = auth.getCurrentUnit();
    return modules;
  }

  public getModuleName(module): string {
    return new Module(module).getModuleName();
  }

  public searchUser(search: string): void {
    this.users$ = this.store.searchUser(search);
  }


  public filterModules(module: EModules, checked: boolean): void {
    this.users$ = this.store.filterModules(module, checked);
    this.searchUser(this.search);
  }

  /*
  INÍCIO UTIL
  */
  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public onScroll(): void {
    this.showList += 15;
  }

  /*
  FINAL UTIL
  */

  public editUser(user: User): void {
    this.router.navigate([user.id, 'editar'], { relativeTo: this.route });
    this.sidenavService.open();
  }

  public removeUser(user: User): void {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este usuário?', 'REMOVER')
      .subscribe(res => {
        if (res === true) {
          this.store.removeUser(user.id);
        }
      });
  }
}

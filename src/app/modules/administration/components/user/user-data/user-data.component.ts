import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material';

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { UserStore } from '../user.store';

import { EModules, Module } from '../../../../../shared/models/modules.enum';
import { User } from '../../../../../shared/models/user.model';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { auth } from '../../../../../auth/auth';


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit, OnDestroy {

  @ViewChild('sidenavRight') sidenavRight: MatSidenav;

  searchButton = false;
  search$ = new Subject<string>();
  showList = 15;
  inSearch: boolean;
  modules = new Array<EModules>();
  search = '';

  users$: Observable<User[]>;

  authStoreSub: Subscription;
  constructor(
    private store: UserStore,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
  ) { }

  ngOnInit() {
    this.search = '';
    this.search$.subscribe(search => {
      this.search = search;
      this.searchUser(search);
    });
    this.loadAllDatas();

  }
  ngOnDestroy(): void {
    if (this.authStoreSub) { this.authStoreSub.unsubscribe(); }
  }
  private loadAllDatas(): void {
    this.users$ = this.store.users$;
    this.store.loadAllUsers();
  }
  public closeSidenav(): void {
    this.router.navigate(['/administracao/usuarios/']);
    this.sidenavRight.close();
  }

  public openSidenav() {
    this.sidenavRight.open();
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
    this.searchButton = false;
    this.users$ = this.store.users$;
  }

  public removeUser(user: User): void {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este usuário?', 'REMOVER')
      .subscribe(res => {
        if (res === true) {
          this.store.removeUser(user.id);
          this.searchUser(this.search);
        }
      });
  }
}

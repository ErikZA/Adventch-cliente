import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Subject } from 'rxjs/Subject';


import { EModules, Module } from '../../../../../shared/models/modules.enum';
import { User } from '../../../../../shared/models/user.model';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { auth } from '../../../../../auth/auth';
import { AdministrationService } from '../../../administration.service';
import { utils } from '../../../../../shared/utils';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';


@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
@AutoUnsubscribe()
export class UserDataComponent extends AbstractSidenavContainer implements OnInit {
  protected componentUrl = '/administracao/usuarios/';

  searchButton = false;
  search$ = new Subject<string>();
  showList = 15;
  modulesFilter: EModules[] = [];
  searchText = '';

  users: User[] = [];
  usersCache: User[] = [];

  sub1: Subscription;
  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private administrationService: AdministrationService,
    private snackBar: MatSnackBar
  ) {  super(router); }

  ngOnInit() {
    this.sub1 = this.getData().switchMap(() => this.search$).subscribe(search => {
      this.searchText = search;
      this.search(search);
    });

  }
  getData() {
    this.search$.next('');
    return this.administrationService
      .getUsers(auth.getCurrentUnit().id)
      .do(data => {
        this.usersCache = data;
        this.users = data;
      });
  }
  checkModule(module: EModules) {
    if (this.modulesFilter.some(m => m === module)) {
      this.modulesFilter = this.modulesFilter.filter(m => m !== module);
    } else {
      this.modulesFilter.push(module);
    }
    this.search(this.searchText);
  }
  public getModulesUnit(): EModules[] {
    const { modules } = auth.getCurrentUnit();
    return modules;
  }

  public getModuleName(module): string {
    return new Module(module).getModuleName();
  }

  public search(search: string): void {
    this.users = this
      .filterUsersProfilesModules(this.usersCache)
      .filter(u =>
        utils.buildSearchRegex(search).test(u.name) ||
        utils.buildSearchRegex(search).test(u.email)
      );
  }
  private filterUsersProfilesModules(users: User[]): User[] {
    if (this.modulesFilter.length > 0) {
      return users.filter(user => {
        if (Array.isArray(user.profiles)) {
          return user.profiles.some(p => {
            return this.modulesFilter.some(x => x === p.software);
          });
        }
        return false;
      });
    }
    return this.usersCache;
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
  }
  public removeUser(user: User): void {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este usuário?', 'REMOVER')
      .skipWhile(res => res !== true)
      .switchMap(() => this.administrationService.deleteUser(user.id))
      .switchMap(() => this.getData())
      .subscribe(() => {
        this.snackBar.open('Removido com sucesso', 'OK', { duration: 3000 });
      });
  }
}

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';

import { EModules, Module } from '../../../../../shared/models/modules.enum';
import { User } from '../../../../../shared/models/user.model';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { auth } from '../../../../../auth/auth';
import { AdministrationService } from '../../../administration.service';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { switchMap, tap, skipWhile } from 'rxjs/operators';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { Filter } from '../../../../../core/components/filter/Filter.model';
import { UserService } from '../user.service';
import { UserDataInterface } from '../../../interfaces/user/user-data-interface';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
@AutoUnsubscribe()
export class UserDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = '/administracao/usuarios/';

  showList = 80;
  modulesFilter: EModules[] = [];
  filter: Filter[] = [];
  searchText = '';

  users: UserDataInterface[];
  usersCache: UserDataInterface[];

  sub1: Subscription;
  constructor(
    protected router: Router,
    private route: ActivatedRoute,
    private confirmDialogService: ConfirmDialogService,
    private administrationService: AdministrationService,
    private snackBar: MatSnackBar,
    private filterService: FilterService,
    private userService: UserService
  ) { super(router); }

  ngOnInit() {
    this.getData()
    .subscribe();
    this.loadFilters();
  }

  ngOnDestroy(): void {
    this.filterService.destroy();
  }

  public getData() {
    return this.getUsers()
      .pipe(
        tap(data => this.filterService.setConfiguration(data, ['name', 'email', 'birthday'])),
        tap(() => this.search())
      );
  }

  private getUsers() {
    const { id } = auth.getCurrentUnit();
    return this.userService
      .getUsers(id)
      .pipe(
        tap(data => {
          this.users = data;
          this.usersCache = data;
        })
      );
  }

  private loadFilters(): void {
    const modules = this.getModulesUnit();
    modules.forEach(module => {
      this.filter.push(new Filter(Number(module), this.getModuleName(module)));
    });
  }

  public checkModule(module) {
    if (this.modulesFilter.some(m => m === module)) {
      this.modulesFilter = this.modulesFilter.filter(m => m !== module);
    } else {
      this.modulesFilter.push(module);
    }
    this.search();
  }

  private getModulesUnit(): EModules[] {
    const { modules } = auth.getCurrentUnit();
    return modules;
  }

  public getModuleName(module): string {
    return new Module(module).getModuleName();
  }

  public searchString(search: string): void {
    this.searchText = search;
    this.search();
  }

  private search(): void {
    const usersSearch = this.filterService.search(this.searchText);
    this.users = this.filterUsersProfilesModules(usersSearch);
  }

  private filterUsersProfilesModules(users: UserDataInterface[]): UserDataInterface[] {
    if (this.modulesFilter.length > 0) {
      return users.filter(user => {
        if (Array.isArray(user.profiles)) {
          return user.profiles.some(p => {
            return this.modulesFilter.some(x => x === p.software);
          });
        }
        return false;
      });
    } else {
      return users;
    }
  }

  public getDataFilter(): Array<Filter> {
    const filter = new Array<Filter>();
    const modules = this.getModulesUnit();
    modules.forEach(module => {
      filter.push(new Filter(Number(module), this.getModuleName(module)));
    });
    return filter;
  }
  /*
  INÍCIO UTIL
  */
  public expandPanel(matExpansionPanel): void {
    matExpansionPanel.toggle();
  }

  public onScroll(): void {
    this.showList += 80;
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
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.administrationService.deleteUser(user.id)),
        switchMap(() => this.getData())
      ).subscribe(() => {
        this.snackBar.open('Removido com sucesso', 'OK', { duration: 3000 });
      });
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject, Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { Module } from '../../../../../shared/models/modules.enum';
import { EModules } from '../../../../../shared/models/modules.enum';
import { Profile } from '../../../models/profile/profile.model';
import { AdministrationService } from '../../../administration.service';
import { auth } from '../../../../../auth/auth';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import { utils } from '../../../../../shared/utils';
import { skipWhile, switchMap, tap, map } from 'rxjs/operators';
import { FilterService } from '../../../../../core/components/filter/service/filter.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { HeaderDataComponent } from '../../../../../core/components/container/data/header-data/header-data.component';

@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
@AutoUnsubscribe()
export class ProfileDataComponent extends AbstractSidenavContainer implements OnInit, OnDestroy {
  protected componentUrl = '/administracao/papeis';

  searchText = '';
  showList = 80;
  searchButton = false;
  search$ = new Subject<string>();
  layout: String = 'row';
  profiles: Profile[] = [];

  sub1: Subscription;

  constructor(
    protected router: Router,
    private confirmDialogService: ConfirmDialogService,
    private route: ActivatedRoute,
    private administrationService: AdministrationService,
    private snackBar: MatSnackBar,
    private filterService: FilterService
  ) { super(router); }

  ngOnInit() {
    this.sub1 = this.getData().subscribe();
  }

  ngOnDestroy(): void {
    this.filterService.destroy();
  }

  getData() {
    const { id } = auth.getCurrentUnit();
    return this.administrationService
      .getProfiles(id)
      .pipe(
        map(p => p.sort((a, b) => a.name.localeCompare(b.name))),
        tap((data: Profile[]) => {
          this.profiles =  data;
          this.filterService.setConfiguration(data, ['name'], ['software']);
          this.searchProfile(this.searchText);
        })
      );
  }

  public searchProfile(search: string) {
    this.searchText = search;
    this.profiles = this.filterService.search(search);
  }

  public onScroll(): void {
    this.showList += 80;
  }

  public getModuleName(module: EModules): string {
    return new Module(module).getModuleName();
  }

  public editProfile(role: Profile): void {
    this.router.navigate([role.id, 'editar'], { relativeTo: this.route });
  }

  public removeProfile(role: Profile): void {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este papel?', 'REMOVER')
      .pipe(
        skipWhile(res => res !== true),
        switchMap(() => this.administrationService.deleteProfile(role.id)),
        switchMap(() => this.getData()),
        tap(() => this.snackBar.open('Papel removido com sucesso!', 'OK', { duration: 30000 }))
      ).subscribe();
  }
}

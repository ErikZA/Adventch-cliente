import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { MatSnackBar } from '@angular/material';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { Module } from '../../../../../shared/models/modules.enum';
import { EModules } from '../../../../../shared/models/modules.enum';
import { utils } from '../../../../../shared/utils';
import { Profile } from '../../../models/profile/profile.model';
import { AdministrationService } from '../../../administration.service';
import { auth } from '../../../../../auth/auth';
import { Subscription } from 'rxjs/Subscription';
import { AutoUnsubscribe } from '../../../../../shared/auto-unsubscribe-decorator';
import { AbstractSidenavContainer } from '../../../../../shared/abstract-sidenav-container.component';
import 'rxjs/add/operator/switchMap';
@Component({
  selector: 'app-profile-data',
  templateUrl: './profile-data.component.html',
  styleUrls: ['./profile-data.component.scss']
})
@AutoUnsubscribe()
export class ProfileDataComponent extends AbstractSidenavContainer implements OnInit {
  protected componentUrl = '/administracao/papeis';
  showList = 15;
  searchButton = false;
  search$ = new Subject<string>();
  layout: String = 'row';
  profiles: Profile[] = [];
  profilesCache: Profile[] = [];

  sub1: Subscription;

  constructor(
    protected router: Router,
    private confirmDialogService: ConfirmDialogService,
    private route: ActivatedRoute,
    private administrationService: AdministrationService,
    private snackBar: MatSnackBar
  ) { super(router); }

  ngOnInit() {
    this.sub1 = this.getData().switchMap(() => this.search$).subscribe(search => {
      this.searchProfile(search);
    });
  }
  getData() {
    this.search$.next('');
    const { id } = auth.getCurrentUnit();
    return this.administrationService
      .getProfiles(id)
      .map(p => p.sort((a, b) => a.name.localeCompare(b.name)))
      .do((data: Profile[]) => {
        this.profiles =  data;
        this.profilesCache = data;
      });
  }
  public onScroll(): void {
    this.showList += 15;
  }
  public getModuleName(module: EModules): string {
    return new Module(module).getModuleName();
  }

  public searchProfile(search: string) {
    this.profiles = this.profilesCache.filter(p =>
      utils.buildSearchRegex(search).test(p.name) ||
      utils.buildSearchRegex(search).test(new Module(p.software).getModuleName())
    );
  }

  public editProfile(role: Profile): void {
    this.router.navigate([role.id, 'editar'], { relativeTo: this.route });
  }

  public removeProfile(role: Profile): void {
    this.confirmDialogService
      .confirm('Remover registro', 'Você deseja realmente remover este papel?', 'REMOVER')
      .skipWhile(res => res !== true)
      .switchMap(() => this.administrationService.deleteProfile(role.id))
      .switchMap(() => this.getData())
      .do(() => this.snackBar.open('Removido com sucesso', 'OK', { duration: 30000 }))
      .subscribe();
  }
}

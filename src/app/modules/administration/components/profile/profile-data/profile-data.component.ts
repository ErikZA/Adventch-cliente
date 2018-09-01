import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subject } from 'rxjs/Subject';
import { MatSidenav, MatSnackBar } from '@angular/material';
import { ConfirmDialogService } from '../../../../../core/components/confirm-dialog/confirm-dialog.service';
import { Module } from '../../../../../shared/models/modules.enum';
import { EModules } from '../../../../../shared/models/modules.enum';
import { utils } from '../../../../../shared/utils';
import { Profile } from '../../../models/profile/profile.model';
import { AdministrationService } from '../../../administration.service';
import { auth } from '../../../../../auth/auth';

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
  profiles: Profile[] = [];
  profilesCache: Profile[] = [];

  constructor(
    private confirmDialogService: ConfirmDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private administrationService: AdministrationService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.search$.subscribe(search => {
      this.searchProfile(search);
    });
    this.getData();
  }
  getData(): void {
    const { id } = auth.getCurrentUnit();
    this.administrationService
      .getProfiles(id).map(p => p.sort((a, b) => a.name.localeCompare(b.name)))
      .subscribe((data: Profile[]) => {
        this.profiles =  data;
        this.profilesCache = data;
    }, err => console.log('Could not load todos profiles.'));
  }
  public onScroll(): void {
    this.showList += 15;
  }
  public getModuleName(module: EModules): string {
    return new Module(module).getModuleName();
  }

  public searchProfile(search: string) {
    this.profiles = this.profilesCache.filter(p => utils.buildSearchRegex(search).test(p.name));
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
          this.administrationService.deleteProfile(role.id).subscribe(() => {
            this.snackBar.open('Removido com sucesso', 'OK', { duration: 30000 });
            this.getData();
          });
        }
      });
  }
}

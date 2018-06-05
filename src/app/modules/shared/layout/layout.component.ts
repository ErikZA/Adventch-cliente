import { Component, OnInit, OnDestroy, Inject, ViewChild, Output } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from '../../../../app/app.component';
import { AuthService } from '../auth.service';
import { SidenavService } from '../../core/services/sidenav.service';
import { MatDrawer, MatDialog, MatDialogRef } from '@angular/material';
import { ChangePasswordComponent } from '../../core/components/password/change-password/change-password.component';
import { SharedService } from '../shared.service';
import { Unit } from '../models/unit.model';
import { EventEmitter } from 'events';
import { EModules } from '../models/modules.enum';
import { ScholarshipService } from '../../scholarship/scholarship.service';
import { Permission } from '../models/permission.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') navMenu: MatDrawer;
  @ViewChild('drawerR') nav: MatDrawer;
  subscribe: Subscription;
  isMobile = false;
  isOpen = true;
  get year(): number { return new Date().getFullYear(); }
  dialogRef: MatDialogRef<ChangePasswordComponent>;
  subscribe1: Subscription;
  subscribe2: Subscription;
  lstUnits: Unit[] = new Array<Unit>();
  unit: Unit;
  urlScholarship: String;

  constructor(
    public authService: AuthService,
    private media: ObservableMedia,
    private dialog: MatDialog,
    private router: Router,
    public scholarshipService: ScholarshipService,
    public app: AppComponent,
    public sharedService: SharedService,
    private sidenavService: SidenavService
  ) { }

  redirectToDashboard() {
    this.router.navigate(['/bolsas/dashboard']);
  }


  ngOnInit() {
    this.getUnits();
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias === 'xs');
      this.isOpen = !(this.isMobile || (change.mqAlias === 'sm') || (change.mqAlias === 'md'));
    });
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  logoff() {
    this.authService.logoff();
    if (this.subscribe1 !== undefined) {
      this.subscribe1.unsubscribe();
    }
    if (this.subscribe2 !== undefined) {
      this.subscribe2.unsubscribe();
    }
  }

  getUrlScholarship() {
    return this.router.url.replace('/novo', '') + '/novo';
  }

  updateCurrentNav(nav: string) {
    this.router.navigate([this.router.url.replace(/.*/, nav)]);
  }

  changePassword() {
    this.dialogRef = this.dialog.open(ChangePasswordComponent, {
      width: '400px',
      height: '500px'
    });
    this.dialogRef.afterClosed().subscribe(result => {
      if (!result) { return; }
    });
  }

  getUnits() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    this.unit = this.authService.getCurrentUnit();
    this.subscribe1 = this.sharedService.getUnits(user.identifier).subscribe((data: Unit[]) => {
      this.lstUnits = Object.assign(this.lstUnits, data as Unit[]);
      if (this.unit == null) {
        this.unit = this.lstUnits[0];
      }
      this.updateUnit(this.unit);
    });

  }

  updateUnit(unit) {
    this.unit = unit;
    this.authService.setCurrentUnit(unit);
    const user = this.authService.getCurrentUser();
    this.subscribe2 = this.sharedService.getPermissions(user.id, unit.id).subscribe((data: Permission[]) => {
      this.authService.updatePermissions(data);
      if (!this.authService.checkAccess(this.router.url, unit)) {
        this.router.navigate(['/']);
      }
    });
  }

  public isRouteActive(route) {
    return this.router.url.indexOf(route) !== -1;
  }

  public checkPermission(module) {
    return this.authService.checkPermission(module);
  }

  public checkPermissionScholarship() {
    return this.authService.getCurrentUser().isScholarship;
  }

  openSidenav() {
    if (!this.isOpen) {
      this.navMenu.close();
    }
    this.sidenavService.open();
  }
}

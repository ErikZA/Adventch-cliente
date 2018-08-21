import { User } from '../models/user.model';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from '../../app.component';

import { ScholarshipService } from '../../modules/scholarship/scholarship.service';
import { SidenavService } from '../../core/services/sidenav.service';
import { MatDrawer } from '@angular/material';
import { SharedService } from '../shared.service';
import { AuthService } from '../auth.service';
import { PermissionService } from '../../core/components/permissions/service/permission.service';
import { ReleaseNotesStore } from '../release-notes/release-notes.store';

import { Unit } from '../models/unit.model';
import { auth } from '../../auth/auth';
import { EFeatures } from '../models/EFeatures.enum';
import { EPermissions } from '../models/permissions.enum';

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
  subscribe1: Subscription;
  subscribe2: Subscription;
  lstUnits: Unit[] = new Array<Unit>();
  unit: Unit;
  urlScholarship: String;
  user: User;
  private releaseSub: Subscription;
  private authSub: Subscription;

  constructor(
    public authService: AuthService,
    private media: ObservableMedia,
    public router: Router,
    public scholarshipService: ScholarshipService,
    public app: AppComponent,
    public sharedService: SharedService,
    private sidenavService: SidenavService,
    public releaseNotes: ReleaseNotesStore,
    private permissionService: PermissionService
  ) { }


  ngOnInit() {
    this.getUnits();
    this.authSub = auth.currentUser.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.releaseSub = this.releaseNotes.getVersion();
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias === 'xs');
      this.isOpen = !(this.isMobile || (change.mqAlias === 'sm') || (change.mqAlias === 'md'));
    });
  }

  ngOnDestroy() {
    if (this.subscribe) { this.subscribe.unsubscribe(); }
    if (this.releaseSub) { this.releaseSub.unsubscribe(); }
    if (this.authSub) { this.authSub.unsubscribe(); }
    if (this.subscribe1) { this.subscribe1.unsubscribe(); }
    if (this.subscribe2) { this.subscribe2.unsubscribe(); }
  }


  logoff() {
    this.router.navigate(['/login']);
    auth.logoffMain();
    this.removeUnitsFromLocalStorage();
    if (this.subscribe1 !== undefined) {
      this.subscribe1.unsubscribe();
    }
    if (this.subscribe2 !== undefined) {
      this.subscribe2.unsubscribe();
    }
  }

  public redirectToDashboard(): void {
    if (this.permissionService.checkFeatureAccess(EFeatures.DASHBOARDBOLSAS)) {
      this.router.navigate(['/bolsas/dashboard']);
    }
  }

  public redirectToTreasury(): void {
    if (this.permissionService.checkFeatureAccess(EFeatures.DASHBOARDTESOURARIA)) {
      this.router.navigate(['/tesouraria/dashboard']);
    }
  }


  updateCurrentNav(nav: string) {
    this.router.navigate([this.router.url.replace(/.*/, nav)]);
  }
  private removeUnitsFromLocalStorage(): void {
    localStorage.removeItem('user-units');
  }
  private setUnitsToLocalStorage(units: Unit[]): void {
    localStorage.setItem('user-units', JSON.stringify(units));
  }
  private getUnitFromLocalStorage(): Unit[] {
    return JSON.parse(localStorage.getItem('user-units')) as Unit[];
  }
  getUnits() {
    this.user = auth.getCurrentUser();
    this.unit = auth.getCurrentUnit();
    const localUnits = this.getUnitFromLocalStorage();
    const userId = auth.getCurrentDecodedToken().userId;
    if (!Array.isArray(localUnits) && typeof userId === 'number') {
      this.subscribe1 = this.sharedService.getUnits(userId).subscribe((data: Unit[]) => {
        this.setUnitsToLocalStorage(data);
        this.lstUnits = data;
        if (data) {
          if (!this.unit || this.unit === null || this.unit === undefined) {
            this.unit = data[0];
            this.updateUnit(this.unit);
          } else {
            this.updateUnit(this.unit);
          }
        }
      });
    } else {
      this.lstUnits = localUnits;
    }
  }
  public redirectToHome() {
    if (this.router.url !== '/') {
      this.router.navigate(['/']);
    }
  }
  public updateUnit(unit): void {
    this.unit = unit;
    this.authService.setCurrentUnit(unit);
  }

  public isRouteActive(route) {
    return this.router.url.indexOf(route) !== -1;
  }

  public checkUserIsAdmin(): boolean {
    return this.authService.checkUserIsAdmin();
  }

  public checkPermissionSoftware(module): boolean {
    return this.authService.checkModuleAccess(module) && this.checkContaisProfile(module);
  }

  public checkContaisProfile(module): boolean {
    return this.permissionService.checkProfileContaisSoftware(module);
  }

  public checkPermissionScholarship() {
    return auth.getCurrentUser().isScholarship;
  }

  openSidenav() {
    if (!this.isOpen) {
      this.navMenu.close();
    }
    this.sidenavService.open();
  }

  public changeProfile(): void {
    this.router.navigate(['/perfil/editar']);
  }
}

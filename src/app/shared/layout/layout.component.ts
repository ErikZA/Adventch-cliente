import { Component, OnInit, OnDestroy, Inject, ViewChild, Output, ChangeDetectorRef } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs/Subscription';

import { AppComponent } from './../../../app/app.component';
import { AuthService } from './../../../app/shared/auth.service';
import { SidenavService } from '../../core/services/sidenav.service';
import { MatDrawer, MatDialog, MatDialogRef } from '@angular/material';
import { ChangePasswordComponent } from '../../core/components/password/change-password/change-password.component';
import { SharedService } from '../shared.service';
import { Unit } from '../models/unit.model';
import { EventEmitter } from 'events';
import { Modules } from '../models/modules.enum';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  @ViewChild('drawerR') nav: MatDrawer;
  subscribe: Subscription;
  isMobile: boolean = false;
  isOpen: boolean = true;
  get year(): number { return new Date().getFullYear() };
  dialogRef: MatDialogRef<ChangePasswordComponent>;
  subscribe1: Subscription;
  lstUnits: Unit[] = new Array<Unit>();
  unit: Unit;

  constructor(
    private authService: AuthService,
    private media: ObservableMedia,
    private dialog: MatDialog,
    private router: Router,
    public app: AppComponent,
    public navService: SidenavService,
    public sharedService: SharedService,
    public cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getUnits();
    this.subscribe = this.media.subscribe((change: MediaChange) => {
      this.isMobile = (change.mqAlias == 'xs');
      this.isOpen = !(this.isMobile || (change.mqAlias == 'sm') || (change.mqAlias == 'md'));
    });
    this.navService.toggle
      .asObservable()
      .subscribe(() => this.nav.toggle());
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }

  logoff() {
    this.authService.logoff();
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
      if (!result) return;
    });
  }

  getUnits(){
    var user = JSON.parse(localStorage.getItem('currentUser'));
    this.unit = this.authService.getCurrentUnit();
    this.subscribe1 = this.sharedService.getUnits(user.identifier).subscribe((data: Unit[]) =>{
      this.lstUnits = Object.assign(this.lstUnits, data as Unit[]);
      if(this.unit == null)
        this.unit = this.lstUnits[0];
      this.authService.setCurrentUnit(this.unit);
    });

  }

  updateUnit(unit){
    this.unit = unit;
    this.authService.setCurrentUnit(unit);
    this.cd.detectChanges();
    if(!this.authService.checkAccess(this.router.url, unit))
      this.router.navigate(['/']);
  }

  public isRouteActive(route) {
    return this.router.url.indexOf(route) != -1;
  }

  public checkPermission(module: Modules) {
    /*
      Verificar se a unidade atual possui permissão para acessar o modulo
      -unit- pode accesar o -module-
        return true
      else
        return false
    */
    if(this.unit == undefined)
      return false;
    for (const permission of this.unit.permissions) {
      if (permission.module == module) {
        return permission.access;
      }
      return false;
    }
  }
}

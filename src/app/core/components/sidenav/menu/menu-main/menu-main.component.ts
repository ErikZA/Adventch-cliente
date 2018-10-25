import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './../../../../../shared/auth.service';
import { auth } from './../../../../../auth/auth';
import { ScholarshipService } from './../../../../../modules/scholarship/scholarship.service';
import { PermissionService } from '../../../permissions/service/permission.service';
import { EFeatures } from '../../../../../shared/models/EFeatures.enum';
import { EPermissions } from '../../../../../shared/models/permissions.enum';

@Component({
  selector: 'app-menu-main',
  templateUrl: './menu-main.component.html',
  styleUrls: ['./menu-main.component.scss']
})
export class MenuMainComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private permissionService: PermissionService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public checkUserIsAdmin(): boolean {
    return this.authService.checkUserIsAdmin();
  }

  public isRouteActive(route) {
    return this.router.url.indexOf(route) !== -1;
  }

  public checkPermissionSoftware(module): boolean {
    return this.authService.checkModuleAccess(module) && this.checkContaisProfile(module);
  }

  private checkContaisProfile(module): boolean {
    return this.permissionService.checkProfileContaisSoftware(module);
  }

  private checkIfNewProcessIsActive(): boolean {
    return !this.permissionService.checkPermissionAccess(EFeatures.Processos, EPermissions.CRIAR);
  }

}

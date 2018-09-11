import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { MatSnackBar } from '@angular/material';
import { EPermissions } from '../models/permissions.enum';
import { PermissionService } from '../../core/components/permissions/service/permission.service';
import { EFeatures } from '../models/EFeatures.enum';


@Injectable()
export class FeatureGuard implements CanActivate, CanLoad {

    public permissions: any;
    constructor(
        private router: Router,
        private permissionService: PermissionService,
        private snackBar: MatSnackBar
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkFeatureAndPermission(route.data.feature, route.data.permission);
    }

    canLoad(route: Route): boolean | Observable<boolean> | Promise<boolean> {
        return this.checkFeatureAndPermission(route.data.feature, route.data.permission);
    }
    private message() {
      this.router.navigate(['/']);
      this.snackBar.open('Seu usúario não possui permissão para acessar essa página', 'OK', { duration: 3000 });
    }

    public checkFeatureAndPermission(feature: EFeatures, permission: EPermissions): boolean {
      if (feature && permission) {
        const checkPermission = this.permissionService.checkPermissionAccess(Number(feature), Number(permission));
        if (!checkPermission) { this.message(); }
        return checkPermission;
      } else if (feature && !permission) {
        const checkFeature = this.permissionService.checkFeatureAccess(feature);
        if (!checkFeature) { this.message(); }
        return checkFeature;
      } else {
        console.log('configure permissão da rota');
        return false;
      }
    }

}

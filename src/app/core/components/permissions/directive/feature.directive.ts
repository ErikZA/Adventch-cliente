import { Directive, OnInit, TemplateRef, ElementRef, ViewContainerRef, Input } from '@angular/core';

import { PermissionService } from '../service/permission.service';
import { auth } from '../../../../auth/auth';
import { EFeatures } from '../../../../shared/models/EFeatures.enum';
import { EPermissions } from '../../../../shared/models/permissions.enum';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[Feature]'
})
export class FeatureDirective implements OnInit {
  private feature: EFeatures;
  private permission: EPermissions;

  @Input('Feature')
  set hasFeature(val: EFeatures) {
    this.feature = val;
    this.updateView();
  }

  @Input('permission')
  set hasPermission(val: EPermissions) {
    this.permission = val;
    this.updateView();
  }

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    auth.currentUser.subscribe(user => {
      this.updateView();
    });
  }

  private updateView(): void {
    this.viewContainer.clear();
    if (this.checkFeatureAndPermission()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  public checkFeatureAndPermission(): boolean {
    if (this.feature && this.permission) {
      return this.permissionService.checkPermissionAccess(Number(this.feature), Number(this.permission));
    } else if (this.feature && !this.permission) {
      return this.permissionService.checkFeatureAccess(this.feature);
    }
  }

}

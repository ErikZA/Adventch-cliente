import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationService } from './administration.service';

import { CoreModule } from '../../core/core.module';
import { AdministratioRoutingModule } from './administration-routing.module';
import { UserDataComponent } from './components/user/user-data/user-data.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { ProfileDataComponent } from './components/profile/profile-data/profile-data.component';
import { ProfileFormComponent } from './components/profile/form/profile-form/profile-form.component';
import { TreePermissionFormComponent } from './components/profile/form/tree-permission-form/tree-permission-form.component';
import { PermissionFormComponent } from './components/profile/form/permission-form/permission-form.component';
import { UserService } from './components/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AdministratioRoutingModule,
  ],
  providers: [
    AdministrationService,
    UserService
  ],
  declarations: [
    ProfileDataComponent,
    UserDataComponent,
    UserFormComponent,
    ProfileFormComponent,
    TreePermissionFormComponent,
    PermissionFormComponent
  ]
})
export class AdministrationModule { }

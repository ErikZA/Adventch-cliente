import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserStore } from './components/user/user.store';
import { AdministrationService } from './administration.service';

import { CoreModule } from '../../core/core.module';
import { ProcessesStore } from '../scholarship/components/process/processes.store';
import { AdministratioRoutingModule } from './administration-routing.module';
import { UserDataComponent } from './components/user/user-data/user-data.component';
import { UserFormComponent } from './components/user/user-form/user-form.component';
import { ProfileDataComponent } from './components/profile/profile-data/profile-data.component';
import { ProfileStore } from './components/profile/profile.store';
import { ProfileFormComponent } from './components/profile/profile-form/profile-form.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    AdministratioRoutingModule,
  ],
  providers: [
    AdministrationService,
    ProfileStore,
    UserStore,
    ProcessesStore
  ],
  declarations: [
    ProfileDataComponent,
    UserDataComponent,
    UserFormComponent,
    ProfileFormComponent,
  ]
})
export class AdministrationModule { }

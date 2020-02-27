import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMaskModule } from 'ngx-mask';

// Modules
import { MaterialModule } from './material.module';

// Components
import { NavbarComponent } from './navbar/navbar.component';
import { SnackBarComponent } from './snack-bar/snack-bar.component';

// Services
import { SnackBarService } from './snack-bar/snack-bar.service';
import { AuthService } from './auth/auth.service';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [
    NavbarComponent,
    SnackBarComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    NgxMaskModule
  ],
  exports: [
    NavbarComponent,
    SnackBarComponent,
    FlexLayoutModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,
    SidebarComponent
  ],
  entryComponents: [SnackBarComponent],
  providers: [
    SnackBarService,
    AuthService,
  ]
})
export class SharedModule { }

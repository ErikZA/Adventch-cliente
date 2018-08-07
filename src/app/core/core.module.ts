import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { TranslateModule } from '@ngx-translate/core';

import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { LockScreenComponent } from './components/lock-screen/lock-screen.component';
import { LockScreenService } from './components/lock-screen/lock-screen.service';
import { ConfirmDialogService } from './components/confirm-dialog/confirm-dialog.service';
import { FocusDirective } from './components/focus.directive';

import { MaterialModule } from './material/material.module';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { SidenavService } from './services/sidenav.service';
import { InputMaskDirective } from './components/input-mask.directive';
import { LayoutComponent } from '../shared/layout/layout.component';
import { ScholarshipService } from '../modules/scholarship/scholarship.service';
import { PasswordFeedbackComponent } from './components/password/password-feedback/password-feedback.component';
import { StrengthMeterComponent } from './components/password/strength-meter/strength-meter.component';
import { FeatureDirective } from './components/permissions/directive/feature.directive';
import { StrongPasswordDirective } from './components/password/strong-password.directive';
import { PermissionService } from './components/permissions/service/permission.service';
import { BackButtonComponent } from './components/back-button/back-button.component';

import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
// const globalRippleConfig: RippleGlobalOptions = {
//   disabled: false,
//   baseSpeedFactor: 1.5 // Ripples will animate 50% faster than before.
// }

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    NgProgressHttpModule,
    NgProgressModule,
    FlexLayoutModule,
    InfiniteScrollModule,
    MaterialModule
  ],
  exports: [
    // old Components
    ColorPickerComponent,
    ConfirmDialogComponent,
    IconPickerComponent,
    LockScreenComponent,
    FocusDirective,
    LayoutComponent,

    // new Components
    StrongPasswordDirective,
    PasswordFeedbackComponent,
    StrengthMeterComponent,
    InputMaskDirective,
    BackButtonComponent,
    FeatureDirective,

    // modules Generics
    FlexLayoutModule,
    InfiniteScrollModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgProgressHttpModule,
    NgProgressModule
  ],
  declarations: [
    // old Declarations
    ColorPickerComponent,
    ConfirmDialogComponent,
    IconPickerComponent,
    LockScreenComponent,
    FocusDirective,
    LayoutComponent,

    // new Declarations
    PasswordFeedbackComponent,
    StrengthMeterComponent,
    StrongPasswordDirective,
    ProgressSpinnerComponent,
    InputMaskDirective,
    BackButtonComponent,
    FeatureDirective
  ],
  providers: [
    LockScreenService,
    ConfirmDialogService,
    SidenavService,
    ScholarshipService,
    PermissionService
    // { provide: DateAdapter, useClass: CustomDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    // { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }
  ],
  entryComponents: [
    ConfirmDialogComponent,
    LockScreenComponent
  ]
})
export class CoreModule { }

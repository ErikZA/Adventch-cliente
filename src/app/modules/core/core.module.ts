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
import { LockScreenService } from "./components/lock-screen/lock-screen.service";
import { ConfirmDialogService } from "./components/confirm-dialog/confirm-dialog.service";
import { FocusDirective } from "./components/focus.directive";
import { MyDT } from "./components/my-dt/my-dt.component";
import { MyDTHeader } from "./components/my-dt/my-dt-header.directive";
import { MyDTHeaderOptions } from "./components/my-dt/my-dt-header-options.directive";
import { MyDTFooter } from "./components/my-dt/my-dt-footer.directive";
import { MyDTRow } from "./components/my-dt/my-dt-row.directive";
import { MyDTColumn } from "./components/my-dt/my-dt-column.directive";
import { MyDtPaginationComponent } from './components/my-dt/my-dt-pagination/my-dt-pagination.component';

import { MaterialModule } from './material/material.module';
import { DataTableComponent } from './components/data-table/data-table.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { SidenavService } from './services/sidenav.service';
import { ChangePasswordComponent } from './components/password/change-password/change-password.component';
import { ChangePasswordService } from './components/password/change-password/change-password.service';
import { StrengthMeterComponent } from './components/password/strength-meter/strength-meter.component';
import { PasswordFeedbackComponent } from './components/password/password-feedback/password-feedback.component';
import { StrongPasswordDirective } from './components/password/strong-password.directive';
import { InputMaskDirective } from './components/input-mask.directive';

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
    MyDT, MyDTHeader, MyDTHeaderOptions, MyDTFooter, MyDTRow, MyDTColumn, FocusDirective, MyDtPaginationComponent,

    // new Components
    DataTableComponent,
    ChangePasswordComponent,
    InputMaskDirective,

    // modules Generics
    FlexLayoutModule,
    InfiniteScrollModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    // old Declarations
    ColorPickerComponent,
    ConfirmDialogComponent,
    IconPickerComponent,
    LockScreenComponent,
    MyDT, MyDTHeader, MyDTHeaderOptions, MyDTFooter, MyDTRow, MyDTColumn, FocusDirective, MyDtPaginationComponent,

    // new Declarations
    DataTableComponent,
    ProgressSpinnerComponent,
    ChangePasswordComponent,
    StrengthMeterComponent,
    PasswordFeedbackComponent,
    StrongPasswordDirective,
    InputMaskDirective,
  ],
  providers: [
    LockScreenService,
    ConfirmDialogService,
    SidenavService,
    ChangePasswordService
    // { provide: DateAdapter, useClass: CustomDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    // { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }
  ],
  entryComponents: [
    ConfirmDialogComponent,
    ChangePasswordComponent,
    LockScreenComponent
  ]
})
export class CoreModule { }
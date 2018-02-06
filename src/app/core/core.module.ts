import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NativeDateModule, RippleGlobalOptions, MAT_RIPPLE_GLOBAL_OPTIONS } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  DateAdapter,
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatCommonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSnackBarModule,
  MatSortModule,
  MatTabsModule,
  MatChipsModule,
  MatToolbarModule,
  MatTooltipModule,
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS
} from '@angular/material';

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

const globalRippleConfig: RippleGlobalOptions = {
  disabled: false,
  baseSpeedFactor: 1.5 // Ripples will animate 50% faster than before.
}

@NgModule({
  imports: [
    CommonModule,
    HttpModule,
    FormsModule,
    RouterModule,

    TranslateModule,

    FlexLayoutModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatCommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTabsModule,
    MatChipsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  exports: [
    ColorPickerComponent,
    ConfirmDialogComponent,
    IconPickerComponent,
    LockScreenComponent,
    MyDT, MyDTHeader, MyDTHeaderOptions, MyDTFooter, MyDTRow, MyDTColumn, FocusDirective, MyDtPaginationComponent,

    FlexLayoutModule,

    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatCommonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSnackBarModule,
    MatSortModule,
    MatTabsModule,
    MatChipsModule,
    MatToolbarModule,
    MatTooltipModule
  ],
  declarations: [
    ColorPickerComponent,
    ConfirmDialogComponent,
    IconPickerComponent,
    LockScreenComponent,
    MyDT, MyDTHeader, MyDTHeaderOptions, MyDTFooter, MyDTRow, MyDTColumn, FocusDirective, MyDtPaginationComponent
  ],
  providers: [
    LockScreenService,
    ConfirmDialogService,
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

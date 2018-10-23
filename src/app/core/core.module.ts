import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';

import { TranslateModule } from '@ngx-translate/core';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { OrderModule } from 'ngx-order-pipe';

import { ColorPickerComponent } from './components/color-picker/color-picker.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { IconPickerComponent } from './components/icon-picker/icon-picker.component';
import { ConfirmDialogService } from './components/confirm-dialog/confirm-dialog.service';

import { MaterialModule } from './material/material.module';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { SidenavService } from './services/sidenav.service';
import { InputMaskDirective } from './components/input-mask.directive';
import { PasswordFeedbackComponent } from './components/password/password-feedback/password-feedback.component';
import { StrengthMeterComponent } from './components/password/strength-meter/strength-meter.component';
import { FeatureDirective } from './components/permissions/directive/feature.directive';
import { StrongPasswordDirective } from './components/password/strong-password.directive';
import { PermissionService } from './components/permissions/service/permission.service';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { ToolbarComponent } from './components/header/toolbar/toolbar.component';
import { LogoMainComponent } from './components/header/logo-main/logo-main.component';
import { ButtonUserComponent } from './components/header/button-user/button-user.component';
import { LayoutMainComponent } from './components/container/layout-main/layout-main.component';
import { ButtonUnitComponent } from './components/header/button-unit/button-unit.component';
import { MenuMainComponent } from './components/sidenav/menu/menu-main/menu-main.component';
import { MenuExpansionItemComponent } from './components/sidenav/menu/menu-expansion-item/menu-expansion-item.component';
import { FooterMainComponent } from './components/footer/footer-main/footer-main.component';
import { LayoutDataComponent } from './components/container/data/layout-data/layout-data.component';
import { MenuMainInformationsComponent } from './components/sidenav/menu/menu-main-informations/menu-main-informations.component';
import { FormSidenavRightComponent } from './components/sidenav/form/form-sidenav-right/form-sidenav-right.component';
import { UnitService } from './services/unit.service';
import { ButtonLanguageComponent } from './components/header/button-language/button-language.component';
import { HeaderTitleComponent } from './components/container/shared/header-title/header-title.component';
import { HeaderFormComponent } from './components/container/form/header-form/header-form.component';
import { HeaderDataComponent } from './components/container/data/header-data/header-data.component';
import { FilterComponent } from './components/filter/filter.component';
import { FilterService } from './components/filter/service/filter.service';
import { ScholarshipService } from '../modules/scholarship/scholarship.service';
import { SharedService } from '../shared/shared.service';
import { LayoutResponsibleComponent } from './components/container/layout-responsible/layout-responsible.component';
import { LogoResponsibleComponent } from './components/header/responsible/logo-responsible/logo-responsible.component';
import { ButtonResponsibleUserComponent } from './components/header/responsible/button-responsible-user/button-responsible-user.component';
import { FooterResponsibleComponent } from './components/footer/responsible/footer-responsible/footer-responsible.component';
import { MAT_DATE_LOCALE } from '@angular/material';

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
    AngularSvgIconModule,
    OrderModule,
    MaterialModule
  ],
  exports: [
    // old Components
    ColorPickerComponent,
    ConfirmDialogComponent,
    IconPickerComponent,

    // new Components
    StrongPasswordDirective,
    PasswordFeedbackComponent,
    StrengthMeterComponent,
    InputMaskDirective,
    BackButtonComponent,
    FeatureDirective,
    ToolbarComponent,
    LogoMainComponent,
    ButtonUnitComponent,
    ButtonUserComponent,
    LayoutMainComponent,
    MenuMainComponent,
    MenuExpansionItemComponent,
    FooterMainComponent,
    LayoutDataComponent,
    HeaderDataComponent,
    MenuMainInformationsComponent,
    FormSidenavRightComponent,
    ButtonLanguageComponent,
    HeaderTitleComponent,
    HeaderFormComponent,
    FilterComponent,
    LayoutResponsibleComponent,

    // modules Generics
    FlexLayoutModule,
    InfiniteScrollModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgProgressHttpModule,
    NgProgressModule,
    AngularSvgIconModule,
    OrderModule
  ],
  declarations: [
    // old Declarations
    ColorPickerComponent,
    ConfirmDialogComponent,
    IconPickerComponent,

    // new Declarations
    PasswordFeedbackComponent,
    StrengthMeterComponent,
    StrongPasswordDirective,
    ProgressSpinnerComponent,
    InputMaskDirective,
    BackButtonComponent,
    FeatureDirective,
    ToolbarComponent,
    LogoMainComponent,
    ButtonUnitComponent,
    ButtonUserComponent,
    LayoutMainComponent,
    MenuMainComponent,
    MenuExpansionItemComponent,
    FooterMainComponent,
    LayoutDataComponent,
    HeaderDataComponent,
    MenuMainInformationsComponent,
    FormSidenavRightComponent,
    ButtonLanguageComponent,
    HeaderTitleComponent,
    HeaderFormComponent,
    FilterComponent,
    LayoutResponsibleComponent,
    LogoResponsibleComponent,
    ButtonResponsibleUserComponent,
    FooterResponsibleComponent
  ],
  providers: [
    ConfirmDialogService,
    SidenavService,
    ScholarshipService,
    PermissionService,
    UnitService,
    FilterService,
    SharedService,
    // { provide: DateAdapter, useClass: CustomDateAdapter },
    // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    // { provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: globalRippleConfig }
  ],
  entryComponents: [
    ConfirmDialogComponent
  ]
})
export class CoreModule { }

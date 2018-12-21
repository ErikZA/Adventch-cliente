import { AuthModule } from './auth/auth.module';
import { AdminGuard } from './shared/guards/admin.guard';
// angular
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRouting } from './app-routing.module';
import { AuthService } from './shared/auth.service';

// core
import { CoreModule } from './core/core.module';

// shared components
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { EditUserComponent } from './shared/profile/edit-user/edit-user.component';
import { LayoutContainerComponent } from './shared/layout-container/layout-container.component';
import { RedefinePasswordComponent } from './shared/redefine-password/redefine-password.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';

// services
import { SharedService } from './shared/shared.service';
import { ReportService } from './shared/report.service';
import { SharedStore } from './shared/shared.store';
import { ProfileStore } from './shared/profile/profile.store';
import { ReleaseNotesStore } from './shared/release-notes/release-notes.store';
import { ChangePasswordService } from './shared/change-password/change-password.service';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/token.interceptor';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { ReleaseNotesDataComponent } from './shared/release-notes/components/release-notes-data/release-notes-data.component';
import { ReleaseNotesFormComponent } from './shared/release-notes/components/release-notes-form/release-notes-form.component';
import { ModuleGuard } from './shared/guards/module.guard';
import { AuthMainGuard } from './shared/guards/auth-main.guard';
import { AuthResponsibleGuard } from './shared/guards/auth-responsible.guard';
import { NgProgressModule } from '@ngx-progressbar/core';
import { provideErrorHandler } from './shared/error/raven-error-handler';
import { JwtModule } from '@auth0/angular-jwt';
import { auth } from './auth/auth';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { BudgetDataComponent } from './modules/payment/components/budget/budget-data/budget-data.component';

registerLocaleData(ptBr);

export function tokenGetter() {
  return auth.getMainToken();
}

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    ReleaseNotesDataComponent,
    ReleaseNotesFormComponent,
    EditUserComponent,
    LayoutContainerComponent,
    RedefinePasswordComponent,
    ChangePasswordComponent,
    BudgetDataComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    AuthModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: [
          'localhost:29459',
          'adventech-test-api.azurewebsites.net',
          'adventech-api.azurewebsites.net'],
        blacklistedRoutes: ['']
      }
    }),
    NgProgressModule.forRoot({
      trickleSpeed: 100,
      min: 5,
      max: 95,
      // ease: 'easeInElastic',
      color: 'white',
      thick: true,
      meteor: false,
      spinner: false,
      debounceTime: 200
    }),
    NgProgressHttpModule.forRoot(),
    // deixar AppRouting sempre por último
    AppRouting
  ],
  exports: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    LayoutContainerComponent
  ],
  providers: [
    AuthMainGuard,
    AuthResponsibleGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    ReportService,
    SharedService,
    SharedStore,
    ChangePasswordService,
    ReleaseNotesStore,
    ProfileStore,
    ModuleGuard,
    AdminGuard,
    { provide: ErrorHandler, useFactory: provideErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

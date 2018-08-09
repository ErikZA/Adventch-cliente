import { AuthModule } from './auth/auth.module';
import { AdminGuard } from './shared/admin.guard';
// angular
import { NgModule, LOCALE_ID, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRouting } from './app-routing.module';
import { AuthGuard } from './shared/auth.guard';
import { AuthService } from './shared/auth.service';

// core
import { CoreModule } from './core/core.module';

// shared components
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { EmptyPageComponent } from './shared/empty-page/empty-page.component';
import { EditUserComponent } from './shared/profile/edit-user/edit-user.component';
import { LayoutContainerComponent } from './shared/layout-container/layout-container.component';
import { RedefinePasswordComponent } from './shared/redefine-password/redefine-password.component';
import { ChangePasswordComponent } from './shared/change-password/change-password.component';

// components

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
import { ModuleGuard } from './shared/module.guard';
import { AuthMainGuard } from './shared/guards/auth-main.guard';
import { AuthResponsibleGuard } from './shared/guards/auth-responsible.guard';
import { NgProgressModule } from '@ngx-progressbar/core';
import { provideErrorHandler } from './shared/error/raven-error-handler';
registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    EmptyPageComponent,
    ReleaseNotesDataComponent,
    ReleaseNotesFormComponent,
    EditUserComponent,
    LayoutContainerComponent,
    RedefinePasswordComponent,
    ChangePasswordComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    AuthModule,
    NgProgressModule.forRoot({
      trickleSpeed: 100,
      min: 5,
      max: 95,
      // ease: 'easeInElastic',
      color: 'white',
      thick: true,
      meteor: false,
      spinner: false,
    }),

    // deixar AppRouting sempre por último
    AppRouting
  ],
  exports: [
    AppComponent,
    DashboardComponent,
    PageNotFoundComponent,
    EmptyPageComponent,
    LayoutContainerComponent
  ],
  providers: [
    AuthGuard,
    AuthMainGuard,
    AuthResponsibleGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'pt-PT'
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

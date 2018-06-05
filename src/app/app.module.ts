// angular
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRouting } from './app-routing.module';
import { AuthGuard } from './modules/shared/auth.guard';
import { AuthService } from './modules/shared/auth.service';

// core
import { CoreModule } from './modules/core/core.module';

// shared components
import { LayoutComponent } from './modules/shared/layout/layout.component';
import { DashboardComponent } from './modules/shared/dashboard/dashboard.component';
import { LoginComponent } from './modules/shared/login/login.component';
import { PageNotFoundComponent } from './modules/shared/page-not-found/page-not-found.component';
import { EmptyPageComponent } from './modules/shared/empty-page/empty-page.component';

// components

// services
import { SharedService } from './modules/shared/shared.service';

// modules
import { TreasuryModule } from './modules/treasury/treasury.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './modules/shared/token.interceptor';

import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { ScholarshipModule } from './modules/scholarship/scholarship.module';
import { ReportService } from './modules/shared/report.service';
registerLocaleData(ptBr);


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    DashboardComponent,
    LoginComponent,
    PageNotFoundComponent,
    EmptyPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    TreasuryModule,
    ScholarshipModule,
    // deixar AppRouting sempre por último
    AppRouting
  ],
  exports: [
    AppComponent,
    LayoutComponent,
    DashboardComponent,
    LoginComponent,
    PageNotFoundComponent,
    EmptyPageComponent
  ],
  providers: [
    AuthGuard,
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
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

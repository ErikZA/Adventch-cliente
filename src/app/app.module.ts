// angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRouting } from './app-routing.module';
import { AuthGuard } from './shared/auth.guard';
import { AuthService } from './shared/auth.service';

// core
import { CoreModule } from './core/core.module';

// shared components
import { LayoutComponent } from './shared/layout/layout.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { LoginComponent } from './shared/login/login.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { EmptyPageComponent } from './shared/empty-page/empty-page.component';

// components

// services
import { SharedService } from './shared/shared.service';

//modules
 import { PaymentModule } from './payment/payment.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/token.interceptor';

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
    FlexLayoutModule,
    HttpClientModule,
    CoreModule,
    PaymentModule,    
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
    SharedService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

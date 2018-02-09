// angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { NgModule, Injector } from '@angular/core';
import { Router } from '@angular/router';
// translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { AuthGuard } from './shared/auth.guard';
import { AuthService } from './shared/auth.service';
import { HttpInterceptor } from './shared/http-interceptor.service';

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
// import { BonificationModule } from './bonification/bonification.module';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './shared/token.interceptor';


// export function createTranslateLoader(http: Http) {
//   return new TranslateHttpLoader(http, './assets/i18n/', '.json');
// }

// export function HttpInterceptorFactory(backend: XHRBackend, options: RequestOptions, router: Router, injector: Injector) {
//   return new HttpInterceptor(backend, options, router, injector);
// }

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
    // HttpModule,
    HttpClientModule,
    CoreModule,
    // TranslateModule.forRoot({
    //   loader: {
    //     provide: TranslateLoader,
    //     useFactory: (createTranslateLoader),
    //     deps: [Http]
    //   }
    // }),
    AppRouting,

    // BonificationModule
  ],
  exports: [
    AppComponent,
    LayoutComponent,
    DashboardComponent,
    LoginComponent,
    PageNotFoundComponent,
    EmptyPageComponent
  ],
  // providers: [
  //   AuthGuard,
  //   AuthService,
  //   {
  //     provide: Http,
  //     useFactory: HttpInterceptorFactory,
  //     deps: [XHRBackend, RequestOptions, Router, Injector]
  //   },
  //   SharedService
  // ],
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

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Reducers
import { couponReducer } from './reducers/coupon.reducer';
import { MaterialModule } from './shared/material.module';
import { productReducer } from './reducers/products.reducer';
import { eventReducer } from './reducers/event.reducer';
import { authReducer } from './reducers/auth.reducer';
import { BankAccountReducer } from './reducers/bankAccount.reducer';
import { ListReducer } from './reducers/list.reducer';
import { UserReducer } from './reducers/user.reducer';
import { CieloAccountReducer } from './reducers/cielo.reducers';

// Services
import { AuthGuard } from './shared/auth/auth.guard';
import { fieldReducer } from './reducers/field.reducer';
import { HomeModule } from './modules/home/home.module';
import { HttpRequestInterceptor } from './shared/http-interceptor';
import { SidebarReducer } from './reducers/sidebar.reducer';
import { SubscriptionReducer } from './reducers/subscription.reducer';
import { LoadingReducer } from './reducers/loading.reducer';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function tokenGetter() {
  return JSON.parse(localStorage.getItem("token"));
}

registerLocaleData(localePt, 'pt-BR');

export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    HomeModule,
    NgxMaskModule.forRoot(options),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient],
      },
      isolate: true,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5003', 'localhost:5002'],
        blacklistedRoutes: ['viacep.com.br']
      }
    }),
    StoreModule.forRoot({
      coupon: couponReducer,
      event: eventReducer,
      product: productReducer,
      auth: authReducer,
      field: fieldReducer,
      user: UserReducer,
      bankAccount: BankAccountReducer,
      list: ListReducer,
      sidebar: SidebarReducer,
      cielo: CieloAccountReducer,
      subscription: SubscriptionReducer,
      loaded: LoadingReducer
    }),
  ],
  providers: [
    AuthGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

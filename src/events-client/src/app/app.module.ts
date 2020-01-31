import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { registerLocaleData } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import localePt from '@angular/common/locales/pt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

// Reducers
import { couponReducer } from './reducers/coupon.reducer';
import { newEvent } from './reducers/newEvent.reducer';
import { MaterialModule } from './shared/material.module';
import { productReducer } from './reducers/products.reducer';
import { eventReducer } from './reducers/event.reducer';
import { RequestInterceptor } from './shared/request-interceptor.module';
import { authReducer } from './reducers/auth.reducer';

// Services
import { AuthGuard } from './shared/auth/auth.guard';
import { JwtModule } from '@auth0/angular-jwt';
import { AccountModule } from './modules/account/account.module';


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
    RequestInterceptor,
    AccountModule,
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
        whitelistedDomains: ['localhost:5001', 'api-store.adven.tech'],
        blacklistedRoutes: ['viacep.com.br']
      }
    }),
    StoreModule.forRoot({
      coupon: couponReducer,
      newevent: newEvent,
      event: eventReducer,
      product: productReducer,
      auth: authReducer,
    }),
  ],
  providers: [
    AuthGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

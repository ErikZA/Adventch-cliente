import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { JwtModule } from '@auth0/angular-jwt';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { AccountModule } from './modules/account/account.module';
import { HomeModule } from './modules/home/home.module';
import { SharedModule } from './shared/shared.module';
// Components
import { AppComponent } from './app.component';
// Action
import { AuthReducer } from './reducers/auth.reducer';
// Services
import { AuthGuard } from './shared/auth/auth.guard';
import { MAT_DATE_LOCALE } from '@angular/material';

export function tokenGetter() {
  return JSON.parse(localStorage.getItem("token"));
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AccountModule,
    HomeModule,
    SharedModule,
    StoreModule.forRoot({
      auth: AuthReducer
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:5000'],
        blacklistedRoutes: []
      }
    }),
  ],
  providers: [
    AuthGuard,
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

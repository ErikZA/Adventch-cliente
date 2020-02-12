import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Oauth2Service {

  constructor() { }

  public redirect(redirectUri: string, accessToken: string, idToken: string, state: string) {
    const accessTokenParam = accessToken ? `&access_token=${accessToken}` : '';
    const stateParam = state ? `&state=${state}` : '';
    const idTokenParam = idToken ? `&id_token=${idToken}` : '';
    window.location.href = `${redirectUri}#v=0${accessTokenParam}${stateParam}${idTokenParam}`;
  }
}

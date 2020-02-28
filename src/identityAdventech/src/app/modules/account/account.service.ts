import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  public uri = environment.identityApiUrl;

  constructor(
    public http: HttpClient
  ) { }

}

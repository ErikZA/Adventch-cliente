import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IUrlParams } from '../interfaces/url-params.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly baseUrl = '/users/';
  constructor(
    private http: HttpClient
  ) { }

  public loginRequest(params: IUrlParams) {
    this.http.post(`${this.baseUrl}login`, params);
  }
}

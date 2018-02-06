import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { User } from './models/user.model';

@Injectable()
export class SharedService {

  constructor(
    private http: HttpClient
  ) { }


}
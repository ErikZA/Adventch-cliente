import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Rx';

@Injectable()
export class TreasuryService {
  constructor(
    private http: HttpClient
  ) { }
}

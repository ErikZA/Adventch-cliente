
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
@Injectable()
export class ResponsibleService {

  constructor(
    private http: HttpClient
  ) {
  }

  public saveFiles(processId, files): Observable<any> {
    const formData = new FormData();
    if (files) {
      files.forEach((f, i) => {
        formData.append('filename_' + i, JSON.stringify(f.type));
        formData.append('filedata_' + i, f, f.name);
      });
    }
    const url = environment.apiUrl + `/scholarship/responsible/upload/process/${processId}`;

    return this.http.post(url, formData);
  }
}


import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import { HttpEventType } from '@angular/common/http';

import { Observable, Subject } from 'rxjs';

import { environment } from '../../../../environments/environment.homolog';
import { ResponsibleUploadInterface } from '../interfaces/responsible-upload-interface';
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

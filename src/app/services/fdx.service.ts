import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { SERVER_URL_PRODUCTION, SERVER_URL_DEV, SERVER_URL_STAGING } from '../generic/fdx.constants';
import { IUserModel } from '@app/generic/fdx.models';

@Injectable()
export class FdxService {
  private serviceDomain: string;

  constructor(private http: HttpClient) {
    if (environment.production) {
      this.serviceDomain = SERVER_URL_PRODUCTION;
    } else if (environment.staging) {
      this.serviceDomain = SERVER_URL_STAGING;
    } else {
      this.serviceDomain = SERVER_URL_DEV;
    }
  }

  public wakeUpApp(): Observable<any> {
    const payload = {};
    const apiURL = `${this.serviceDomain}/user/wakeUpApp`;
    return this.http.post(apiURL, payload).pipe();
  }

  public handleUserSignUp(userModel: IUserModel): Observable<any> {
    const payload = { userModel };
    const apiURL = `${this.serviceDomain}/user/handleUserSignUp`;
    return this.http.post(apiURL, payload).pipe();
  }

  public handleUserSignOut(userModel: IUserModel): Observable<any> {
    const payload = { userModel };
    const apiURL = `${this.serviceDomain}/user/handleUserSignOut`;
    return this.http.post(apiURL, payload).pipe();
  }
}

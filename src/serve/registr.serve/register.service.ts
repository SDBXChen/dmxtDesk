import { Injectable } from '@angular/core';
import {retry} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConstURL} from '../constURL';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class RegisterService {
  urls = this.constURL.getURL() + '/user/registerStudent';
  urlt = this.constURL.getURL() + '/user/registerTeacher';
  urlu = this.constURL.getURL() + '/user/judge';
  urlf = this.constURL.getURL() + '/user/editPassword';

  constructor( private http: HttpClient, private constURL: ConstURL ) { }
  postRegisterUserS (registeruser) {
    return this.http.post(this.urls, registeruser, httpOptions).pipe(retry(3));
  }
  postRegisterUserT (registeruser) {
    return this.http.post(this.urlt, registeruser, httpOptions).pipe(retry(3));
  }

  postUserName (registeruser) {
    return this.http.post(this.urlu, registeruser, httpOptions).pipe(retry(3));
  }

  postForget (forgetmes) {
    return this.http.post(this.urlf, forgetmes, httpOptions).pipe(retry(3));
  }

}

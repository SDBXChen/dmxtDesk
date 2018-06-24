import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { retry } from 'rxjs/operators';
import {ConstURL} from '../constURL';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

// const url = 'http://192.168.191.5:8080/user/checkLogin';


@Injectable()
export class LoginService {
  url = this.constURL.getURL() + '/user/checkLogin';
  urlTl = this.constURL.getURL() + '/user/loginByPhone';
  constructor(private http: HttpClient, private constURL: ConstURL) { }
  postUser (user) {
    return this.http.post(this.url, user, httpOptions).pipe(retry(3));
  }
  postphone (tel) {
    return this.http.post(this.urlTl, tel, httpOptions).pipe(retry(3));
  }
}

import { Injectable } from '@angular/core';
import {retry} from 'rxjs/operators';
import {ConstURL} from '../constURL';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class StudentService {
  urlTi = this.constURL.getURL() + '/user/findByTeacher';
  urlId = this.constURL.getURL() + '/user/findByStudent';
  urlDl = this.constURL.getURL() + '/user/deleteNamerecord';
  urlCl = this.constURL.getURL() + '/user/addNamerecord';
  urlGc = this.constURL.getURL() + '/user/listTeacher';
  urlFr = this.constURL.getURL() + '/user/findRegister';
  urlRg = this.constURL.getURL() + '/user/updateRegisterdetail';
  urlCm = this.constURL.getURL() + '/user/findClassmate';

  constructor( private http: HttpClient, private constURL: ConstURL ) { }

  postUserID(user) {
    return this.http.post(this.urlId, user, httpOptions).pipe(retry(3));
  }
  postDelClass(classStdID) {
    return this.http.post(this.urlDl, classStdID, httpOptions).pipe(retry(3));
  }
  postClass(classMes) {
    return this.http.post(this.urlCl, classMes, httpOptions).pipe(retry(3));
  }
  getClassTeacher() {
    return this.http.get(this.urlGc, httpOptions).pipe(retry(3));
  }
  postTeacherID(user) {
    return this.http.post(this.urlTi, user, httpOptions).pipe(retry(3));
  }
  postFinReg(classID) {
    return this.http.post(this.urlFr, classID, httpOptions).pipe(retry(3));
  }
  postRegister(classStdID) {
    return this.http.post(this.urlRg, classStdID, httpOptions).pipe(retry(3));
  }
  postClassmate(userMes) {
    return this.http.post(this.urlCm, userMes, httpOptions).pipe(retry(3));
  }

}

import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ConstURL} from '../constURL';
import {retry} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};

@Injectable()
export class TeacherService {
  urlID = this.constURL.getURL() + '/user/findByTeacher';
  urlCL = this.constURL.getURL() + '/user/addCourse';
  urlDL = this.constURL.getURL() + '/user/deleteCourse';
  urlEd = this.constURL.getURL() + '/user/editCourse';
  urlSs = this.constURL.getURL() + '/user/findByCourse';
  urlQd = this.constURL.getURL() + '/user/addRegister';
  urlFr = this.constURL.getURL() + '/user/findRegister';
  urlEq = this.constURL.getURL() + '/user/updateRegister';
  urlRi = this.constURL.getURL() + '/user/listStudent';
  urlRs = this.constURL.getURL() + '/user/listRegisterByCourse';

  constructor(private http: HttpClient, private constURL: ConstURL) { }
  postUserID (user) {
    return this.http.post(this.urlID, user, httpOptions).pipe(retry(3));
  }
  postAddClass (classMes) {
    return this.http.post(this.urlCL, classMes, httpOptions).pipe(retry(3));
  }
  postDelClass (classID) {
    return this.http.post(this.urlDL, classID, httpOptions).pipe(retry(3));
  }
  postEditClass (classMes) {
    return this.http.post(this.urlEd, classMes, httpOptions).pipe(retry(3));
  }
  postShowStd (classID) {
    return this.http.post(this.urlSs, classID, httpOptions).pipe(retry(3));
  }
  postQiandao (qianDao) {
    return this.http.post(this.urlQd, qianDao, httpOptions).pipe(retry(3));
  }
  postFinReg (classID) {
    return this.http.post(this.urlFr, classID, httpOptions).pipe(retry(3));
  }
  postEndQiandao (endqianDao) {
    return this.http.post(this.urlEq, endqianDao, httpOptions).pipe(retry(3));
  }
  postRegisterID (RegisterID) {
    return this.http.post(this.urlRi, RegisterID, httpOptions).pipe(retry(3));
  }
  postRegisterScore(classID) {
    return this.http.post(this.urlRs, classID, httpOptions).pipe(retry(3));
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {validate} from 'codelyzer/walkerFactory/walkerFn';
import {RegisterService} from '../../serve/registr.serve/register.service';
import {NzMessageService} from 'ng-zorro-antd';
import {Observer} from 'rxjs/Observer';
import {Observable} from 'rxjs/Observable';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {LoginService} from '../../serve/login.serve/login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  validateForm1: FormGroup;
  validateForm2: FormGroup;
  currentPage = 0;
  registerUserS = {
    password: '',
    nickname: '',
    phoneNumber: '',
    identify: '',
    name: '',
    yard: '',
    major: '',
    stdnum: '',
    school: '',
    layer: ''
  };
  registerUserT = {
    password: '',
    nickname: '',
    phoneNumber: '',
    identify: '',
    name: '',
    yard: '',
    teanum: '',
    school: ''
  };
  user = {
    userName: ''
  };
  flog = '';
  reg = /^1[3|4|5|7|8][0-9]{9}$/;
  validateUser = false;
  validatePhone = false;


  constructor(private fb: FormBuilder, private registerServe: RegisterService, private message: NzMessageService,
              private loginService: LoginService) {
  }

  submitForm(): void {
    for (const i in this.validateForm1.controls) {
      if (this.validateForm1.controls.hasOwnProperty(i)) {
        this.validateForm1.controls[ i ].markAsDirty();
        this.validateForm1.controls[ i ].updateValueAndValidity();
      }
    }
    console.log(this.validateForm1.get('nickname').valid);
    if (this.validateUser && this.validateForm1.get('password').valid
      && this.validateForm1.get('checkPassword').valid && this.flog && this.validatePhone) {
      if (!this.validateForm1.get('agree').value) {
        this.message.create('warning', `请先阅读协议！`);
      } else {
        this.currentPage++;
      }
    }
  }

  submitMore() {
    for (const i in this.validateForm2.controls) {
      if (this.validateForm2.controls.hasOwnProperty(i)) {
        this.validateForm2.controls[ i ].markAsDirty();
        this.validateForm2.controls[ i ].updateValueAndValidity();
      }
    }
    console.log(this.validateForm2.get('identify').value);
    if ( this.validateForm2.get('identify').value === '学生' ) {
      console.log(this.validateForm2.get('identify').value);
      if ( this.validateForm2.get('school').valid && this.validateForm2.get('yard').valid && this.validateForm2.get('major').valid
        && this.validateForm2.get('layer').valid && this.validateForm2.get('stdnum').valid ) {
        // console.log(this.validateForm2.get('identify').value);
        this.registerUserS.identify = this.validateForm2.get('identify').value;
        this.registerUserS.layer = this.validateForm2.get('layer').value;
        this.registerUserS.major = this.validateForm2.get('major').value;
        this.registerUserS.name = this.validateForm2.get('name').value;
        this.registerUserS.nickname = this.validateForm1.get('nickname').value;
        this.registerUserS.password = this.validateForm1.get('password').value;
        this.registerUserS.phoneNumber = this.validateForm1.get('phoneNumber').value;
        this.registerUserS.school = this.validateForm2.get('school').value;
        this.registerUserS.stdnum = this.validateForm2.get('stdnum').value;
        this.registerUserS.yard = this.validateForm2.get('yard').value;
        this.registerServe.postRegisterUserS(this.registerUserS).subscribe((data) => {
          this.currentPage++;
          }, error => {
          this.message.create('warning', `请检查网络连接！`);
          }
        );
      }
    } else {
        if ( this.validateForm2.get('school').valid && this.validateForm2.get('yard').valid && this.validateForm2.get('teanum').valid ) {
          this.registerUserT.identify = this.validateForm2.get('identify').value;
          this.registerUserT.name = this.validateForm2.get('name').value;
          this.registerUserT.nickname = this.validateForm1.get('nickname').value;
          this.registerUserT.password = this.validateForm1.get('password').value;
          this.registerUserT.phoneNumber = this.validateForm1.get('phoneNumber').value;
          this.registerUserT.school = this.validateForm2.get('school').value;
          this.registerUserT.teanum = this.validateForm2.get('teanum').value;
          this.registerUserT.yard = this.validateForm2.get('yard').value;
          this.registerServe.postRegisterUserT(this.registerUserT).subscribe((data) => {
              this.currentPage++;
            }, error => {
              this.message.create('warning', `请检查网络连接！`);
            }
          );
        }
    }
  }

  prepage() {
    this.currentPage--;
  }

  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm1.controls.checkPassword.updateValueAndValidity());
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm1.controls.password.value) {
      return { confirm: true, error: true };
    }
  }

  userNameAsyncValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      this.user.userName = this.validateForm1.get('nickname').value;
      this.registerServe.postUserName(this.user).subscribe((data) => {
        // console.log(data);
        this.flog = data['result'];
        console.log(this.flog);
        if (this.flog.toString() === 'false') {
          observer.next({ error: true, duplicated: true });
          this.validateUser = false;
        } else {
          observer.next(null);
          this.validateUser = true;
        }
        observer.complete();
      }, error => {
        this.message.create('warning', `请检查网络连接！`);
      });
    }, 1000);
  })

  phoneValidator = (control: FormControl) => Observable.create((observer: Observer<ValidationErrors>) => {
    setTimeout(() => {
      this.loginService.postphone({'tel': this.validateForm1.get('phoneNumber').value}).subscribe(
        (data) => {
          console.log(data);
          if (!data.hasOwnProperty('exit')) {
            observer.next({ error: true, duplicated: true });
            this.validatePhone = false;
          } else if ( !this.reg.test(control.value )) {
            observer.next({ required: true });
            this.validatePhone = false;
          } else {
            observer.next(null);
            this.validatePhone = true;
          }
          observer.complete();
        }, error2 => {
          this.message.create('warning', `请检查网络连接！`);
        });
    }, 1000);
  })

  ngOnInit() {
    this.validateForm1 = this.fb.group({
      password: [ null, [ Validators.required ] ],
      checkPassword: [ null, [ Validators.required, this.confirmationValidator ] ],
      nickname: [ null, [ Validators.required ], [ this.userNameAsyncValidator ] ],
      phoneNumberPrefix: [ '+86' ],
      phoneNumber: [ null, [ Validators.required ], [ this.phoneValidator ] ],
      agree: [ false ]
    });

    this.validateForm2 = this.fb.group({
      identify: [ '学生', [ Validators.required ] ],
      name: [ null, [ Validators.required ] ],
      school: [ null, [ Validators.required ] ],
      yard: [ null, [ Validators.required ] ],
      major: [ null, [ Validators.required ] ],
      layer: [ null, [ Validators.required ] ],
      stdnum: [ null, [ Validators.required ] ],
      teanum: [ null, [ Validators.required ] ]
    });
  }

}

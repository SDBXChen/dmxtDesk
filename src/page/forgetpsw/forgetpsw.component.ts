import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../serve/login.serve/login.service';
import {NzMessageService} from 'ng-zorro-antd';
import {RegisterService} from '../../serve/registr.serve/register.service';

@Component({
  selector: 'app-forgetpsw',
  templateUrl: './forgetpsw.component.html',
  styleUrls: ['./forgetpsw.component.scss']
})
export class ForgetpswComponent implements OnInit {
  currentPage = 0;
  validateForm1: FormGroup;
  validateForm2: FormGroup;
  reg = /^1[3|4|5|7|8][0-9]{9}$/;
  textSend = '发送验证码';
  boolSend = false;
  clock;
  nums;
  currentUser = {
    rolename: '',
    ID: '',
    newpassword: ''
  };
  validateCode;

  constructor( private fb: FormBuilder, private loginService: LoginService, private message: NzMessageService, private registerServe: RegisterService ) { }

  ngOnInit() {
    this.validateForm1 = this.fb.group({
      phone: [ null, [ this.confirmValidator ] ],
      validateCode: [ null, [ Validators.required ] ]
    });
    this.validateForm2 = this.fb.group({
      password: [ null, [ Validators.required ] ],
      checkPassword: [ null, [ Validators.required, this.confirmationValidator ] ]
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm2.controls.password.value) {
      return { confirm: true, error: true };
    }
  }
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.validateForm2.controls.checkPassword.updateValueAndValidity());
  }

  confirmValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if ( !this.reg.test(control.value )) {
      return { phone: true, error: true };
    }
  }
  getValidate() {
    if ( this.validateForm1.get('phone').valid ) {
      this.loginService.postphone({'tel': this.validateForm1.get('phone').value}).subscribe(
        (data) => {
          console.log(data);
          if (data.hasOwnProperty('exit')) {
            this.message.create('warning', `该手机号码不存在`);
          } else {
            if (data.hasOwnProperty('student')) {
              this.currentUser['rolename'] = '学生';
              this.currentUser['ID'] = data['student'].id;
            } else {
              this.currentUser['rolename'] = '老师';
              this.currentUser['ID'] = data['teacher'].id;
            }
            this.validateCode = data['message'];
            this.message.create('success', `验证码：` + data['message']);
            this.send();
          }
        }, error2 => {
          this.message.create('warning', `请检查网络连接！`);
        }
      );
    }
  }

  send() {
    this.nums = 60;
    this.textSend = this.nums + '秒后获取';
    this.boolSend = true;
    this.clock = setInterval(() => {
      this.nums--;
      // console.log(this.nums);
      if (this.nums > 0) {
        this.textSend = this.nums + '秒后获取';
      } else {
        this.textSend = '发送验证码';
        this.boolSend = false;
        clearInterval(this.clock);
      }

    }, 1000);
  }

  submitPhone(): void {
    for (const i in this.validateForm1.controls) {
      if (this.validateForm1.controls.hasOwnProperty(i)) {
        this.validateForm1.controls[ i ].markAsDirty();
        this.validateForm1.controls[ i ].updateValueAndValidity();
      }
    }
    if (this.validateForm1.valid) {
      if (this.validateForm1.get('validateCode').value === this.validateCode.toString()) {
        this.message.create('success', `验证成功！`);
        console.log(this.currentUser);
        this.currentPage++;
      } else {
        this.message.create('error', `验证码错误！`);
      }
    }
  }

  submitForm(): void {
    for (const i in this.validateForm2.controls) {
      if (this.validateForm2.controls.hasOwnProperty(i)) {
        this.validateForm2.controls[ i ].markAsDirty();
        this.validateForm2.controls[ i ].updateValueAndValidity();
      }
    }
    if (this.validateForm2.valid) {
      this.currentUser.newpassword = this.validateForm2.get('password').value;
      console.log(this.currentUser);
      this.registerServe.postForget(this.currentUser).subscribe(
        (data) => {
          if (data['result']) {
            this.currentPage++;
          } else {
            this.message.create('error', `修改失败！`);
          }
        }, error2 => {
          this.message.create('error', `网络错误！`);
        });
    }
  }

  prepage() {
    this.currentPage--;
    clearInterval(this.clock);
    this.textSend = '发送验证码';
    this.boolSend = false;
    this.validateCode = '';
    this.validateForm1.get('validateCode').reset();
  }

}

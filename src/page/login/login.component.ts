import {Component, HostBinding, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginService} from '../../serve/login.serve/login.service';
import {Router} from '@angular/router';
import {NzMessageService} from 'ng-zorro-antd';
import {LocalStorage} from '../../serve/local.storage';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  validateForm1: FormGroup;
  currentUser = {};

  loginUser = {
    username: '',
    password: '',
    logintype: ''
  };
  result: string;
  reg = /^1[3|4|5|7|8][0-9]{9}$/;

  show = 0;
  textSend = '发送验证码';
  boolSend = false;
  clock;
  nums;
  validateCode;

  constructor( private loginService: LoginService, private fb: FormBuilder, private router: Router,
               private message: NzMessageService, private localstorage: LocalStorage) {
  }

  ngOnInit() {
    this.validateForm = this.fb.group({
      userName: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });

    this.validateForm1 = this.fb.group({
      phone: [ null, [ this.confirmValidator ] ],
      validateCode: [ null, [ Validators.required ] ]
    });
  }

  confirmValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if ( !this.reg.test(control.value )) {
      return { phone: true, error: true };
    }
  }



  changeShow() {
    if (this.show === 0) {
      this.show = 1;
    } else {
      this.show = 0;
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
    }

    // this.router.navigate(['/homepage', { user: this.currentUser}]);

    if (this.validateForm.get('userName').value != null && this.validateForm.get('password').value != null) {
      this.loginUser.username = this.validateForm.get('userName').value;
      this.loginUser.password = this.validateForm.get('password').value;
      this.loginUser.logintype = this.show.toString();
      console.log(this.loginUser);
      this.loginService.postUser(this.loginUser).subscribe((data) => {
        console.log(data);
        this.currentUser = data;
        if (data['check']) {
          this.localstorage.setObject('currentUser', this.currentUser);
          this.message.create('success', `登录成功！`);
          console.log('success');
          this.router.navigate(['/homepage', this.currentUser]);
          console.log(this.currentUser);
        } else {
          this.message.create('error', `账号密码错误！`);
        }
      }, error => {
        this.message.create('warning', `请检查网络连接！`);

      });
    }
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
        this.localstorage.setObject('currentUser', this.currentUser);
        this.message.create('success', `登录成功！`);
        this.router.navigate(['/homepage', this.currentUser]);
        console.log(this.currentUser);
      } else {
        this.message.create('error', `验证码错误！`);
      }
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
              this.currentUser['student'] = data['student'];
              this.currentUser['ID'] = data['student'].id;
              this.currentUser['username'] = data['student'].name;
            } else {
              this.currentUser['rolename'] = '老师';
              this.currentUser['teacher'] = data['teacher'];
              this.currentUser['ID'] = data['teacher'].id;
              this.currentUser['username'] = data['teacher'].name;
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

}

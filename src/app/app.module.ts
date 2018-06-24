import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { AppComponent } from './app.component';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { AppRoutingModule } from './/app-routing.module';
import { WelcomeComponent } from '../page/welcome/welcome.component';
import { LoginComponent } from '../page/login/login.component';
import { HomepageComponent } from '../page/homepage/homepage.component';
import { ClassmatesComponent } from '../page/classmates/classmates.component';
import { ClassnoteComponent } from '../page/classnote/classnote.component';
import { LoginService } from '../serve/login.serve/login.service';
import { ClasstableComponent } from '../page/classtable/classtable.component';
import { WarningComponent } from '../page/warning/warning.component';
import { TeachertableComponent } from '../page/teachertable/teachertable.component';
import { StudentlistComponent } from '../page/studentlist/studentlist.component';
import { StudentmesComponent } from '../page/studentmes/studentmes.component';
import { RegisterComponent } from '../page/register/register.component';
import {RegisterService} from '../serve/registr.serve/register.service';
import {ConstURL} from '../serve/constURL';
import {TeacherService} from '../serve/teacher.serve/teacher.service';
import {LocalStorage} from '../serve/local.storage';
import { StdregisterComponent } from '../page/stdregister/stdregister.component';
import {StudentService} from '../serve/student.serve/student.service';
import { ForgetpswComponent } from '../page/forgetpsw/forgetpsw.component';

registerLocaleData(zh);


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    HomepageComponent,
    ClassmatesComponent,
    ClassnoteComponent,
    ClasstableComponent,
    WarningComponent,
    TeachertableComponent,
    StudentlistComponent,
    StudentmesComponent,
    RegisterComponent,
    StdregisterComponent,
    ForgetpswComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgZorroAntdModule.forRoot(),
    AppRoutingModule

  ],
  bootstrap: [ AppComponent ],
  providers: [
    LoginService,
    RegisterService,
    ConstURL,
    TeacherService,
    LocalStorage,
    StudentService
  ]
})
export class AppModule { }

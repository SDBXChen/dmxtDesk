import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {TeacherService} from '../../serve/teacher.serve/teacher.service';
import {LocalStorage} from '../../serve/local.storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-teachertable',
  templateUrl: './teachertable.component.html',
  styleUrls: ['./teachertable.component.scss']
})
export class TeachertableComponent implements OnInit {

  validateForm: FormGroup;

  classMes = {
    classname: '',
    classteacher: '',
    classtime: '',
    classlocal: '',
    classteacherID: '',
    classnum: ''
  };

  dataSet = [];

  isEdit = false;
  mTitle = '';
  teachername = '';


  constructor( private modalService: NzModalService, private teacherService: TeacherService, private localstorage: LocalStorage,
               private fb: FormBuilder, private message: NzMessageService) {
  }

  ngOnInit() {
    this.teachername = this.localstorage.get('userName');
    this.classMes.classteacherID = this.localstorage.get('userID');
    this.showData();

    this.validateForm = this.fb.group({
      classname: [ null, [ Validators.required ] ],
      classteacher: [ this.teachername, [ Validators.required ] ],
      classtime: [ null, [ Validators.required ] ],
      classlocal: [ null, [ Validators.required ] ]
    });
  }

  showDel(datas): void {
    this.modalService.confirm({
      nzTitle: '确认删除',
      nzContent: '删除后无法恢复！',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.teacherService.postDelClass({ 'course_number': datas.course_number}).subscribe( (data) => {
          this.message.create('success', `删除成功！`);
          this.showData();
        }, error2 => {
          this.message.create('warning', `请检查网络连接！`);
        });
      }
    });
  }
  showEdit(data): void {
    this.validateForm.get('classname').setValue(data.course_name);
    this.validateForm.get('classtime').setValue(data.class_time);
    this.validateForm.get('classlocal').setValue(data.class_location);
    this.mTitle = '修改课程';
    this.isEdit = true;
    this.classMes.classnum = data.course_number;
  }

  showNew(): void {
    this.validateForm.get('classname').reset();
    this.validateForm.get('classtime').reset();
    this.validateForm.get('classlocal').reset();
    this.mTitle = '添加课程';
    this.isEdit = true;
  }

  handleOk(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
    }
    if (this.validateForm.valid) {
      this.classMes.classname = this.validateForm.get('classname').value;
      this.classMes.classteacher = this.validateForm.get('classteacher').value;
      this.classMes.classtime = this.validateForm.get('classtime').value;
      this.classMes.classlocal = this.validateForm.get('classlocal').value;
      this.isEdit = false;
      if (this.mTitle === '添加课程') {
        this.teacherService.postAddClass(this.classMes).subscribe(
          (data) => {
            this.message.create('success', `添加成功！`);
            this.showData();
          }, error2 => {
            this.message.create('warning', `请检查网络连接！`);
          });
      } else {
        this.teacherService.postEditClass(this.classMes).subscribe(
          (data) => {
            this.message.create('success', `修改成功！`);
            this.showData();
          }, error2 => {
            this.message.create('warning', `请检查网络连接！`);
          });
      }

    }
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isEdit = false;
  }

  showData() {
    this.teacherService.postUserID({ 'userID': this.classMes.classteacherID }).subscribe(
      (data) => {
        console.log(data);
        this.dataSet = data['result'];
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }

}

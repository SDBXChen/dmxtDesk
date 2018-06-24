import { Component, OnInit } from '@angular/core';
import {NzMessageService, NzModalService} from 'ng-zorro-antd';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LocalStorage} from '../../serve/local.storage';
import {StudentService} from '../../serve/student.serve/student.service';
import {retry} from 'rxjs/operators';

const teachers = [];
const courses = {};

const flog = 0;

@Component({
  selector: 'app-classtable',
  templateUrl: './classtable.component.html',
  styleUrls: ['./classtable.component.scss']
})
export class ClasstableComponent implements OnInit {
  validateForm: FormGroup;
  studentname = '';
  studentID = '';
  classStdID = {
    stdID: '',
    classID: ''
  };
  dataSet = [];
  dataClassTeacher = [];
  currClass = [];
  key: string;
  flogClass = 1;

  isEdit = false;
  mTitle = '';
  values: any[] = null;

  constructor( private modalService: NzModalService, private fb: FormBuilder, private localstorage: LocalStorage,
               private studentService: StudentService, private message: NzMessageService ) { }

  ngOnInit() {
    this.studentname = this.localstorage.get('userName');
    this.studentID = this.localstorage.get('userID');
    this.showData();
    this.getClassTeacher();

    this.validateForm = this.fb.group({
      classname: [ null, [ Validators.required ] ]
    });
  }

  showDel(item): void {
    this.modalService.confirm({
      nzTitle: '确认删除',
      nzContent: '删除后无法恢复！',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        this.classStdID.classID = item.course.course_number;
        this.classStdID.stdID = this.studentID;
        this.studentService.postDelClass(this.classStdID).subscribe( (data) => {
          this.message.create('success', `删除成功！`);
          this.showData();
        }, error2 => {
          this.message.create('warning', `请检查网络连接！`);
        });
      }
    });
  }

  showNew(): void {
    this.mTitle = '添加课程';
    this.isEdit = true;
    // console.log(courses);
  }

  handleOk(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[ i ].markAsDirty();
        this.validateForm.controls[ i ].updateValueAndValidity();
      }
    }
    this.classStdID.stdID = this.studentID;
    this.classStdID.classID = this.validateForm.get('classname').value[1];
    console.log(this.classStdID);
    this.studentService.postClass(this.classStdID).subscribe(
      (data) => {
        if (!data['result']) {
          this.message.create('warning', `该课程已存在，请重新选择！`);
        } else {
          this.message.create('success', `添加成功！`);
          this.showData();
          this.isEdit = false;
        }
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isEdit = false;
  }

  showData() {
    this.studentService.postUserID({ 'userID': this.studentID }).subscribe(
      (data) => {
        console.log(data);
        this.dataSet = data['result'];
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }
  onChanges(values: any): void {
    console.log(values, this.values);
  }

  loadData(node: any, index: number): PromiseLike<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (index < 0) { // if index less than 0 it is root node
          node.children = teachers;
        } else if (index === 0) {
          node.children = courses[node.value];
        }
        resolve();
      }, 1000);
    });
  }

  getClassTeacher() {
    // console.log('hahah');
    this.studentService.getClassTeacher().subscribe(
      (data) => {
        teachers.splice(0, teachers.length);
        console.log(teachers);
        this.dataClassTeacher = data['result'];
        for (let i = 0; i < this.dataClassTeacher.length; i++) {
          teachers.push(
            {
              value: this.dataClassTeacher[i].name,
              label: this.dataClassTeacher[i].name
            });
        }
        for (let i = 0; i < this.dataClassTeacher.length; i++) {
          this.getClass(this.dataClassTeacher[i].id, this.dataClassTeacher[i].name);
        }
      }, error2 => {
        console.log('hahaaha');
      });
  }
  getClass(id, teachername) {
    // console.log(id);
    this.studentService.postTeacherID({'userID': id}).subscribe(
      (data) => {
        this.flogClass++;
        this.currClass = [];
        // console.log(data['result']);
        for (let i = 0; i < data['result'].length; i++) {
          this.currClass.push(
            {
              value: data['result'][i].id,
              label: data['result'][i].course_name,
              isLeaf: true
            }
          );
        }
        this.key = teachername.toString();
        courses[this.key] = this.currClass;
      }, error2 => {});
  }
}

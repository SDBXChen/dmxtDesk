import { Component, OnInit } from '@angular/core';
import {LocalStorage} from '../../serve/local.storage';
import {NzMessageService} from 'ng-zorro-antd';
import {StudentService} from '../../serve/student.serve/student.service';

@Component({
  selector: 'app-stdregister',
  templateUrl: './stdregister.component.html',
  styleUrls: ['./stdregister.component.scss']
})
export class StdregisterComponent implements OnInit {
  studentname = '';
  studentID = '';
  dataSet = [];
  classStdID = {
    stdID: '',
    classID: '',
    registerID: ''
  };
  constructor( private localstorage: LocalStorage, private studentService: StudentService, private message: NzMessageService ) { }

  ngOnInit() {
    this.studentname = this.localstorage.get('userName');
    this.studentID = this.localstorage.get('userID');
    this.showData();
  }

  showData() {
    this.studentService.postUserID({ 'userID': this.studentID }).subscribe(
      (data) => {
        // console.log(data);
        this.dataSet = data['result'];
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }
  showregister(item) {
    this.studentService.postFinReg({ 'classID': item.course.course_number}).subscribe(
      (data) => {
        console.log(data);
        if (data['result']) {
          this.classStdID.classID = item.course.id;
          this.classStdID.stdID = this.studentID;
          this.classStdID.registerID = data['register_ID'];
          console.log(this.classStdID);
          this.studentService.postRegister(this.classStdID).subscribe(
            (data2) => {
              console.log(data2);
              if (data2['result'] === 0) {
                this.message.create('success', `签到成功！`);
              } else if (data2['result'] === 2) {
                this.message.create('warning', `已经签到过，请勿重复签到！`);
              } else if (data2['result'] === 1) {
                this.message.create('warning', `不在该网段内，签到失败！`);
              }
            }, error2 => {

            }
          );

        } else {
          this.message.create('warning', `该课程未创建签到！`);
        }
      }, error2 => {
      }
    );
  }

}

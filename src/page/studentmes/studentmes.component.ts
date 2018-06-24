import { Component, OnInit } from '@angular/core';
import {TeacherService} from '../../serve/teacher.serve/teacher.service';
import {NzMessageService} from 'ng-zorro-antd';
import {LocalStorage} from '../../serve/local.storage';

@Component({
  selector: 'app-studentmes',
  templateUrl: './studentmes.component.html',
  styleUrls: ['./studentmes.component.scss']
})
export class StudentmesComponent implements OnInit {
  dataClass = [];
  isSelectClass = '';
  isSelectName = '';
  dataSet = [];
  num = 0;


  constructor( private teacherService: TeacherService, private message: NzMessageService, private localstorage: LocalStorage ) { }

  ngOnInit() {
    this.showData();
    console.log(this.isSelectClass);
  }
  selectClass(data) {
    this.isSelectClass = data.course_number;
    this.isSelectName = data.course_name;
    this.showStd();
  }

  showData() {
    this.teacherService.postUserID({ 'userID': this.localstorage.get('userID') }).subscribe(
      (data) => {
        console.log(data);
        this.num = data['result'].length;
        if (data['result'].length > 0 ) {
          this.dataClass = data['result'];
          this.isSelectClass = this.dataClass[0].course_number;
          this.isSelectName = this.dataClass[0].course_name;
          this.showStd();
        }
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }
  showStd() {
    this.teacherService.postShowStd({ 'classID': this.isSelectClass}).subscribe(
      (data) => {
        console.log(data);
        this.dataSet = data['result'];
      }, error2 => {
      });
  }

}

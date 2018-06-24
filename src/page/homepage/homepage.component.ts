import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LocalStorage} from '../../serve/local.storage';
import {NzMessageService} from 'ng-zorro-antd';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']

})
export class HomepageComponent implements OnInit {
  students = [
    {
      title: '全班同学',
      icon: 'anticon anticon-team'
    },
    // {
    //   title: '课程笔记',
    //   icon: 'anticon anticon-file'
    // },
    {
      title: '课程表',
      icon: 'anticon anticon-copy'
    },
    {
      title: '签到',
      icon: 'anticon anticon-edit'
    },
    {
      title: '旷课预警',
      icon: 'anticon anticon-user-delete'
    }
  ];

  teacher = [
    {
      title: '教师课程',
      icon: 'anticon anticon-copy'
    },
    {
      title: '学生列表',
      icon: 'anticon anticon-team'
    },
    {
      title: '学生签到',
      icon: 'anticon anticon-edit'
    }
  ];

  select = '';
  currentUser = {};
  dataset = [];
  data = {
    student_ID: '',
    school: '',
    college: '',
    profession: '',
    grade: ''
  };
  data1 = {
    teacher_ID: '',
    school: '',
    college: '',
    profession: '',
    grade: ''
  };
  dataAll: any;
  show: any;

  constructor( private route: ActivatedRoute, private localstorage: LocalStorage, private router: Router, private message: NzMessageService) {}


  ngOnInit() {
    this.route.params
      .subscribe((params: Params) => {
        this.currentUser = params;
        console.log(this.currentUser);
      });
    if (this.currentUser['rolename'] === '老师') {
      this.localstorage.set('userID', this.currentUser['ID']);
      this.localstorage.set('userName', this.currentUser['username']);
      this.show = 0;
      this.dataset = this.teacher;
      this.select = '教师课程';
    } else {
      this.localstorage.set('userID', this.currentUser['ID']);
      this.localstorage.set('userName', this.currentUser['username']);
      this.show = 1;
      this.dataAll = this.localstorage.getObject('currentUser')['student'];
      console.log(this.dataAll);
      this.data.school = this.dataAll.school;
      this.data.college = this.dataAll.college;
      this.data.grade = this.dataAll.grade;
      this.data.profession = this.dataAll.profession;
      this.data.student_ID = this.dataAll.student_ID;
      this.dataset = this.students;
      this.select = '全班同学';
    }
  }

  isSelect(item) {
    this.select = item.title;
  }
  loginout() {
    if (this.localstorage.get('registering') !== 'underWay') {
      this.localstorage.clearall();
      this.router.navigate(['/login']);
    } else {
      this.message.create('warning', `正在进行签到，请先结束签到！`);
    }
  }

}

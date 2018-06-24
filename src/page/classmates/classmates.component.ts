import { Component, OnInit } from '@angular/core';
import {StudentService} from '../../serve/student.serve/student.service';
import {LocalStorage} from '../../serve/local.storage';

@Component({
  selector: 'app-classmates',
  templateUrl: './classmates.component.html',
  styleUrls: ['./classmates.component.scss']
})
export class ClassmatesComponent implements OnInit {
  index = 1;
  sum: number;
  currentUser: any;
  userMes = {
    college: '',
    grade: '',
    school: '',
    profession: ''
  };
  data = [];
  datashow = [];
  constructor( private studentService: StudentService, private localstorage: LocalStorage ) {}

  ngOnInit() {
    this.currentUser = this.localstorage.getObject('currentUser');
    this.getClassmate();
  }

  changeIndex() {
    console.log(this.index);
    this.datashow = this.data.slice(6 * (this.index - 1), 6 * this.index);
  }

  getClassmate() {
    this.userMes.college = this.currentUser.student.college;
    this.userMes.grade = this.currentUser.student.grade;
    this.userMes.profession = this.currentUser.student.profession;
    this.userMes.school = this.currentUser.student.school;
    console.log(this.userMes);
    this.studentService.postClassmate(this.userMes).subscribe(
      (data) => {
        console.log(data);
        this.data = data['result'];
        this.datashow = this.data.slice(0, 6 * this.index);
        this.sum  = this.data.length;
      }, error2 => {}
    );

  }

}

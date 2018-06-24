import { Component, OnInit } from '@angular/core';
import {StudentService} from '../../serve/student.serve/student.service';
import {LocalStorage} from '../../serve/local.storage';

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {

  studentname = '';
  studentID = '';

  dataSet = [];

  constructor( private studentService: StudentService, private localstorage: LocalStorage ) { }

  ngOnInit() {
    this.studentname = this.localstorage.get('userName');
    this.studentID = this.localstorage.get('userID');
    this.showData();
  }

  showData() {
    this.studentService.postUserID({ 'userID': this.studentID }).subscribe(
      (data) => {
        this.dataSet = data['result'];
      }, error2 => {
      }
    );
  }

}

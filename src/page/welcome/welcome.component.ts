import { Component, OnInit } from '@angular/core';
import {element} from 'protractor';
import {elementStyle} from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  array = [ 'assets/wel1.jpg', 'assets/wel2.jpg', 'assets/wel3.jpg', 'assets/wel4.jpg' ];
  constructor() {
  }
  ngOnInit() {

  }


}

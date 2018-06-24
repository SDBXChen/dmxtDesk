import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzMessageService, NzModalService, NzNotificationService} from 'ng-zorro-antd';
import {TeacherService} from '../../serve/teacher.serve/teacher.service';
import {LocalStorage} from '../../serve/local.storage';
declare var BMap;
declare var BMAP_ANIMATION_BOUNCE, BMAP_ANCHOR_TOP_LEFT, BMAP_ANCHOR_TOP_RIGHT, BMAP_NAVIGATION_CONTROL_SMALL, BMAP_STATUS_SUCCESS;

@Component({
  selector: 'app-studentlist',
  templateUrl: './studentlist.component.html',
  styleUrls: ['./studentlist.component.scss']
})
export class StudentlistComponent implements OnInit, OnDestroy {
  dataSet = [];
  islocat = false;
  registeringID = '';
  butCont = '开始签到';
  dataClass = [];
  isSelectClass = '';
  isSelectName = '';
  index = 1;
  sum = 0;
  data = [];
  datashow = [];
  qiandao = {
    course_ID: '',
    start_time: '',
    end_time: '',
    sign: '',
    lng: '',
    lat: ''
  };
  flog = false;
  SelectClass = {
    course_number: '',
    course_name: ''
  };

  showWarn = false;
  map: any;
  point: any;
  marker: any;
  currentpoint: any;
  geolocation: any;
  currentP = {
    lng: '',
    lat: ''
  };
  mapP = {
    maplng: '',
    maplat: ''
  };
  top_left_control: any;
  top_left_navigation: any;
  date: Date;
  time = {
    year: 0,
    month: 0,
    day: 0,
    hh: 0,
    mm: 0
  };

  endqiandao = {
    register_ID: '',
    end_time: ''
  };
  isVisible = false;
  isVisibleEnd = false;
  isQiandao: boolean;
  num = 0;
  disable = false;

  constructor( private modalService: NzModalService, private teacherService: TeacherService, private message: NzMessageService,
               private localstorage: LocalStorage ) {
  }

  ngOnInit() {
    this.message.remove();
    this.showData();
    if (this.localstorage.get('islocat') === 'true') {
      this.islocat = true;
      document.getElementById('maplng').innerText = this.localstorage.get('maplng');
      document.getElementById('maplat').innerText = this.localstorage.get('maplat');
    }
  }
  ngOnDestroy() {
    this.message.remove();
  }

  showData() {
    this.teacherService.postUserID({ 'userID': this.localstorage.get('userID') }).subscribe(
      (data) => {
        // console.log(data);
        this.dataClass = data['result'];
        this.num = this.dataClass.length;
        if (this.num !== 0) {
          this.SelectClass.course_number = this.localstorage.get('SelectClassNumber');
          this.SelectClass.course_name = this.localstorage.get('SelectClassName');
          // console.log(this.SelectClass);
          if (!this.SelectClass.course_name && !this.SelectClass.course_number) {
            this.isSelectClass = this.dataClass[0].course_number;
            this.isSelectName = this.dataClass[0].course_name;
          } else {
            this.isSelectClass = this.SelectClass.course_number;
            this.isSelectName = this.SelectClass.course_name;
          }
          this.registerScord();
          this.isRegister();
        } else {
          this.disable = true;
        }
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }

  selectClass(data) {
    this.isSelectClass = data.course_number;
    this.isSelectName = data.course_name;
    this.localstorage.set('SelectClassNumber', data.course_number);
    this.localstorage.set('SelectClassName', data.course_name);
    this.registerScord();
  }

  registerScord() {
    this.teacherService.postRegisterScore({ 'classID': this.isSelectClass}).subscribe(
      (data) => {
        this.dataSet = [];
        // console.log(data);
        for (let i = 0; i < data['result'].length; i++) {
          for (const key in data['record'][i]) {
            if (data['result'][i].hasOwnProperty(key)) {
              continue;
            }
            data['result'][i][key] = data['record'][i][key];
          }
          // console.log(data['result'][i]);
          this.dataSet.push(data['result'][i]);
        }
        this.dataSet = this.dataSet.reverse();
      }, error2 => {
      }
    );
  }

  isRegister() {
    this.teacherService.postFinReg({ 'classID': this.isSelectClass}).subscribe(
      (data) => {
        // console.log(data);
        this.isQiandao = data['result'];
        this.registeringID = data['register_ID'];
        if (this.isQiandao) {
          // console.log(this.registeringID);
          this.message.remove();
          this.message.create('warning', `该课程已创建签到...`, {nzDuration: 0});
          this.butCont = '结束签到';
          this.flog = true;
        }
      }, error2 => {
      }
    );
  }

  showStd() {
    this.isVisibleEnd = true;
    this.teacherService.postRegisterID({ 'registerID': this.registeringID, 'classID': this.isSelectClass}).subscribe(
      (data) => {
        console.log(data);
        this.localstorage.remove('registering');
        this.data = data['result'];
        this.datashow = this.data.slice(0, 4 * this.index);
        this.sum  = this.data.length;
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }

  changeIndex() {
    console.log(this.index);
    this.datashow = this.data.slice(6 * (this.index - 1), 6 * this.index);
  }
  startQian() {
    this.modalService.confirm({
      nzTitle: '确认',
      nzContent: this.isSelectName + '(' + this.currentP.lng + 'N' + ',' + this.currentP.lat + 'E)',
      nzOkText: '开始签到',
      nzCancelText: '重新选择',
      nzOnOk: () => {
        this.isQiandao = true;
        this.butCont = '结束签到';
        this.flog = true;
        this.doQian();
      },
      nzOnCancel: () => {
        this.showModal();
      }
    });
  }

  doQian() {
    this.qiandao.course_ID = this.isSelectClass;
    this.qiandao.start_time = this.getTime();
    this.qiandao.sign = '1';
    this.qiandao.lng = this.currentP.lng;
    this.qiandao.lat = this.currentP.lat;
    this.postIP(this.qiandao);
    this.message.remove();
    this.message.create('warning', `正在进行签到...`, {nzDuration: 0});
  }
  postIP(qianDao) {
    this.teacherService.postQiandao(qianDao).subscribe(
      (data) => {
        console.log(data);
        this.registeringID = data['result'];
        this.localstorage.set('registering', 'underWay');
        this.registerScord();
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }

  getTime(): string {
    this.date = new Date();
    this.time.year = this.date.getFullYear();
    this.time.month = this.date.getMonth() + 1;
    this.time.day = this.date.getDate();
    this.time.hh = this.date.getHours();
    this.time.mm = this.date.getMinutes();
    let clock = this.time.year + '-';
    if (this.time.month < 10) {
      clock += '0';
    }
    clock += this.time.month + '-';
    if (this.time.day < 10) {
      clock += '0';
    }
    clock += this.time.day + ' ';
    if (this.time.hh < 10) {
      clock += '0';
    }
    clock += this.time.hh + ':';
    if (this.time.mm < 10) {
      clock += '0';
    }
    clock += this.time.mm;
    return clock;
  }


  showModal(): void {
    console.log(this.islocat);
    if (this.butCont === '开始签到') {
      if (!this.islocat) {
        this.location();
        this.islocat = true;
      }
      this.teacherService.postFinReg({ 'classID': this.isSelectClass}).subscribe(
        (data) => {
          // console.log(data);
          this.isQiandao = data['result'];
          this.registeringID = data['register_ID'];
          if (this.isQiandao) {
            // console.log(this.registeringID);
            this.message.remove();
            this.message.create('warning', `正在进行签到...`, {nzDuration: 0});
            this.butCont = '结束签到';
            this.flog = true;
          } else {
            this.currentP.lng = '';
            this.currentP.lat = '';
            document.getElementById('lng').innerText = '';
            document.getElementById('lat').innerText = '';
            if (document.getElementById('maplng').innerText !== '' && document.getElementById('maplat').innerText !== '') {
              this.localstorage.set('islocat', 'true');
              this.localstorage.set('maplng', document.getElementById('maplng').innerText);
              this.localstorage.set('maplat', document.getElementById('maplat').innerText);
              this.isVisible = true;
              this.locadMap();
            } else {
              this.message.remove();
              this.message.create('warning', `等待定位,大概3-5秒...`);
            }
          }
        }, error2 => {
        }
      );
    } else {
      this.modalService.confirm({
        nzTitle: '确认',
        nzContent: '是否结束签到',
        nzOkText: '结束签到',
        nzCancelText: '继续签到',
        nzOnOk: () => {
          this.endQiandao();
        }
      });
    }
  }

  handleOk(): void {
    this.currentP.lng = document.getElementById('lng').innerText;
    this.currentP.lat = document.getElementById('lat').innerText;
    // console.log(this.currentP);
    if (this.currentP.lng !== '' && this.currentP.lat !== '') {
      this.isVisible = false;
      this.startQian();
    } else {
      this.showWarn = true;
      setTimeout(() => {
        this.showWarn = false;
      }, 3000);
    }
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }

  locadMap() {
    this.map = new BMap.Map('conntainerBaidu');
    this.mapP.maplng = document.getElementById('maplng').innerText;
    this.mapP.maplat = document.getElementById('maplat').innerText;
    console.log(document.getElementById('maplng').innerText, document.getElementById('maplat').innerText);
    console.log(this.mapP.maplng, this.mapP.maplat);
    this.point = new BMap.Point(this.mapP.maplng, this.mapP.maplat); // 创建点坐标
    this.map.centerAndZoom(this.point, 15); // 初始化地图，设置中心点坐标和地图级别
    this.map.enableScrollWheelZoom(true);

    this.top_left_control = new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT});
    this.top_left_navigation = new BMap.NavigationControl();

    this.map.addControl(this.top_left_control);
    this.map.addControl(this.top_left_navigation);
    this.map.addEventListener('click', function(e) {
      this.currentpoint = new BMap.Point(e.point.lng, e.point.lat);
      this.marker = new BMap.Marker(this.currentpoint);
      this.clearOverlays();
      this.addOverlay(this.marker);
      this.marker.setAnimation(BMAP_ANIMATION_BOUNCE);
      document.getElementById('lng').innerText = e.point.lng;
      document.getElementById('lat').innerText =  e.point.lat;
    });
  }

  endQiandao() {
    this.endqiandao.register_ID = this.registeringID;
    this.endqiandao.end_time = this.getTime();
    console.log(this.endqiandao);
    this.teacherService.postEndQiandao(this.endqiandao).subscribe(
      (data) => {
        this.butCont = '开始签到';
        this.flog = false;
        this.message.remove();
        this.message.create('success', `签到完成！`);
        this.registerScord();
        this.showStd();
      }, error2 => {
        this.message.create('warning', `请检查网络连接！`);
      });
  }
  location() {
    this.geolocation = new BMap.Geolocation();
    this.geolocation.getCurrentPosition(function(r) {
      if (this.getStatus() === BMAP_STATUS_SUCCESS) {
        if (r.point.lng !== null && r.point.lat !== null) {
          // alert('定位完成，您的位置：' + r.point.lng + ',' + r.point.lat);
          document.getElementById('maplng').innerText = r.point.lng;
          document.getElementById('maplat').innerText =  r.point.lat;
        } else {
          document.getElementById('maplng').innerText = '';
          document.getElementById('maplat').innerText =  '';
        }
      } else {
        alert('failed' + this.getStatus());
      }
    }, {enableHighAccuracy: true});
  }
  endhandleCancel() {
    this.isVisibleEnd = false;
  }
}

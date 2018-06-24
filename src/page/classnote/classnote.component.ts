import { Component, OnInit } from '@angular/core';
import {NzModalService} from 'ng-zorro-antd';

@Component({
  selector: 'app-classnote',
  templateUrl: './classnote.component.html',
  styleUrls: ['./classnote.component.scss']
})
export class ClassnoteComponent implements OnInit {
  index = 1;
  sum: number;
  datashow = [];
  isMore = false;
  isEdit = false;
  mTitle = '';

  moreMessage = {
    title: '',
    date: '',
    content: ''
  };
  data = [
    {
      title: 'Title 1',
      content: '“你们帮帮我，我女儿失踪了，快一个月了……”4月24日上午，洪女士的妈妈到杭州建德某派出所报案，称自己的女儿20多天前外出打工。“你们帮帮我，我女儿失踪了'
    },
    {
      title: 'Title 2',
      content: ''
    },
    {
      title: 'Title 3',
      content: '“你们帮帮我，我女儿失踪了，快一个月了……”4月24日上午，洪女士的妈妈到杭州建德某派出所报案，称自己的女儿20多天前外出打工。'
    },
    {
      title: 'Title 4',
      content: ''
    },
    {
      title: 'Title 5',
      content: ''
    },
    {
      title: 'Title 6',
      content: ''
    }
  ];

  constructor(private modalService: NzModalService) { }

  ngOnInit() {
    this.datashow = this.data.slice(0, 6 * this.index);
    this.sum  = this.data.length;
  }
  changeIndex() {
    console.log(this.index);
    this.datashow = this.data.slice(6 * (this.index - 1), 6 * this.index);
  }

  showMore(item): void {
    this.isMore = true;
    this.moreMessage = item;
    this.moreMessage.date = '2017/5/28';
  }
  showEdit(item): void {
    this.mTitle = '修改笔记';
    this.isEdit = true;
    this.moreMessage = item;
    this.moreMessage.date = '2017/5/28';
  }
  showNew(): void {
    this.mTitle = '新建笔记';
    this.isEdit = true;
    this.moreMessage = {
      title: '',
      date: '',
      content: ''
    };
  }

  showDel(): void {
    this.modalService.confirm({
      nzTitle: '确认删除',
      nzContent: '删除后无法恢复！',
      nzOkText: '确定',
      nzCancelText: '取消',
      nzOnOk: () => {
        console.log( 'hahaha' );
      }
    });
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    this.isMore = false;
    this.isEdit = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isMore = false;
    this.isEdit = false;
  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgetpswComponent } from './forgetpsw.component';

describe('ForgetpswComponent', () => {
  let component: ForgetpswComponent;
  let fixture: ComponentFixture<ForgetpswComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgetpswComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgetpswComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

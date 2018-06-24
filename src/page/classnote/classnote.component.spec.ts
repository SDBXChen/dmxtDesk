import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassnoteComponent } from './classnote.component';

describe('ClassnoteComponent', () => {
  let component: ClassnoteComponent;
  let fixture: ComponentFixture<ClassnoteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassnoteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassnoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

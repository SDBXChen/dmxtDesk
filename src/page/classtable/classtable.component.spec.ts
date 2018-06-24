import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasstableComponent } from './classtable.component';

describe('ClasstableComponent', () => {
  let component: ClasstableComponent;
  let fixture: ComponentFixture<ClasstableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClasstableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClasstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentmesComponent } from './studentmes.component';

describe('StudentmesComponent', () => {
  let component: StudentmesComponent;
  let fixture: ComponentFixture<StudentmesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentmesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentmesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

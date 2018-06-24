import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachertableComponent } from './teachertable.component';

describe('TeachertableComponent', () => {
  let component: TeachertableComponent;
  let fixture: ComponentFixture<TeachertableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeachertableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeachertableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

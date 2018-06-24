import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StdregisterComponent } from './stdregister.component';

describe('StdregisterComponent', () => {
  let component: StdregisterComponent;
  let fixture: ComponentFixture<StdregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StdregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StdregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

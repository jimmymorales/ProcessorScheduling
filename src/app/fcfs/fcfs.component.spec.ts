import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FcfsComponent } from './fcfs.component';

describe('FcfsComponent', () => {
  let component: FcfsComponent;
  let fixture: ComponentFixture<FcfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FcfsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FcfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

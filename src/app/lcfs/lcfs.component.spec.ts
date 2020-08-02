import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcfsComponent } from './lcfs.component';

describe('LcfsComponent', () => {
  let component: LcfsComponent;
  let fixture: ComponentFixture<LcfsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcfsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcfsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

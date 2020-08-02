import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LjfComponent } from './ljf.component';

describe('LjfComponent', () => {
  let component: LjfComponent;
  let fixture: ComponentFixture<LjfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LjfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LjfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
